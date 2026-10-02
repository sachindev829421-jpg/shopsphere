import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q") || "";
    const categorySlug = searchParams.get("category");
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const rating = searchParams.get("rating") ? parseFloat(searchParams.get("rating")!) : undefined;
    const inStock = searchParams.get("inStock") === "true";
    const featured = searchParams.get("featured") === "true";
    const bestseller = searchParams.get("bestseller") === "true";
    const sort = searchParams.get("sort") || "relevance";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    const skip = (page - 1) * limit;

    // Build Prisma where conditions
    const where: any = {
      isActive: true,
    };

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { brand: { contains: q } },
        { description: { contains: q } },
        { tags: { contains: q } },
      ];
    }

    if (categorySlug && categorySlug !== "all") {
      where.category = { slug: categorySlug };
    }

    if (brand && brand !== "all") {
      where.brand = brand;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (rating !== undefined) {
      where.rating = { gte: rating };
    }

    if (inStock) {
      where.stockQuantity = { gt: 0 };
    }

    if (featured) {
      where.isFeatured = true;
    }

    if (bestseller) {
      where.isBestSeller = true;
    }

    // Build orderBy
    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") {
      orderBy = { price: "asc" };
    } else if (sort === "price_desc") {
      orderBy = { price: "desc" };
    } else if (sort === "newest") {
      orderBy = { createdAt: "desc" };
    } else if (sort === "rating") {
      orderBy = { rating: "desc" };
    } else if (sort === "popularity") {
      orderBy = { reviewCount: "desc" };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { order: "asc" } },
          variants: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Parse stringified JSON fields safely
    const parsedProducts = products.map((p) => {
      let tags: string[] = [];
      let specifications: Record<string, string> = {};
      let sizes: string[] = [];
      let colors: string[] = [];

      try {
        tags = JSON.parse(p.tags || "[]");
      } catch {}
      try {
        specifications = JSON.parse(p.specifications || "{}");
      } catch {}
      try {
        sizes = JSON.parse(p.sizes || "[]");
      } catch {}
      try {
        colors = JSON.parse(p.colors || "[]");
      } catch {}

      return {
        ...p,
        tags,
        specifications,
        sizes,
        colors,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({
      products: parsedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Products query error:", error);
    return NextResponse.json(
      { error: "Error fetching products catalog" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const {
      name,
      brand,
      categoryId,
      subcategory,
      shortDescription,
      description,
      price,
      compareAtPrice,
      discount,
      stockQuantity,
      lowStockThreshold,
      isActive,
      isFeatured,
      isBestSeller,
      tags,
      specifications,
      sizes,
      colors,
      images,
      variants,
    } = body;

    if (!name || !brand || !categoryId || !description || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const slug = slugify(name) + "-" + Math.floor(Math.random() * 10000);
    const sku = `${brand.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        brand,
        categoryId,
        subcategory: subcategory || null,
        shortDescription: shortDescription || null,
        description,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        discount: discount ? parseInt(discount) : 0,
        stockQuantity: parseInt(stockQuantity || 0),
        lowStockThreshold: parseInt(lowStockThreshold || 5),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
        tags: JSON.stringify(tags || []),
        specifications: JSON.stringify(specifications || {}),
        sizes: JSON.stringify(sizes || []),
        colors: JSON.stringify(colors || []),
        images: {
          create: (images || []).map((img: string | { url: string }, index: number) => ({
            url: typeof img === "string" ? img : img.url,
            alt: `${name} image ${index + 1}`,
            order: index,
          })),
        },
        variants: {
          create: (variants || []).map((v: any, index: number) => ({
            sku: v.sku || `${sku}-VAR-${index + 1}`,
            name: v.name || `${name} Variant ${index + 1}`,
            size: v.size || null,
            color: v.color || null,
            price: v.price ? parseFloat(v.price) : parseFloat(price),
            stockQuantity: parseInt(v.stockQuantity || 0),
          })),
        },
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
