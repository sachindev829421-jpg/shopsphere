import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting ShopSphere database seed...");

  // Clean existing data in reverse order of foreign keys
  await prisma.couponUsage.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned old database records.");

  // 1. Create Users
  const adminPasswordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "Admin@ShopSphere2026",
    10
  );
  const customerPasswordHash = await bcrypt.hash("Password@123", 10);

  const admin = await prisma.user.create({
    data: {
      name: process.env.ADMIN_NAME || "ShopSphere Admin",
      email: (process.env.ADMIN_EMAIL || "admin@shopsphere.com").toLowerCase(),
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      phone: "+91 98765 43210",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      phone: "+91 98111 22334",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      addresses: {
        create: [
          {
            name: "Aarav Sharma",
            phone: "+91 98111 22334",
            street: "42, Shanti Niketan, Ring Road",
            apartment: "Flat 302, Tower B",
            city: "New Delhi",
            state: "Delhi",
            postalCode: "110021",
            country: "India",
            isDefault: true,
            type: "SHIPPING",
          },
          {
            name: "Aarav Sharma (Office)",
            phone: "+91 98111 22334",
            street: "Cyber City, DLF Phase 2",
            apartment: "Building 10, 5th Floor",
            city: "Gurugram",
            state: "Haryana",
            postalCode: "122002",
            country: "India",
            isDefault: false,
            type: "BILLING",
          },
        ],
      },
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: "Priya Patel",
      email: "priya.patel@example.com",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      phone: "+91 99222 33445",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      addresses: {
        create: [
          {
            name: "Priya Patel",
            phone: "+91 99222 33445",
            street: "15 Marine Lines",
            apartment: "Sea View Apts, Apt 4C",
            city: "Mumbai",
            state: "Maharashtra",
            postalCode: "400020",
            country: "India",
            isDefault: true,
            type: "SHIPPING",
          },
        ],
      },
    },
  });

  console.log(`👤 Created Users: Admin (${admin.email}), Aarav, Priya`);

  // 2. Create Categories
  const catElectronics = await prisma.category.create({
    data: {
      name: "Electronics & Audio",
      slug: "electronics-audio",
      description: "Smartphones, noise-cancelling headphones, smartwatches and tech essentials.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      featured: true,
    },
  });

  const catMensFashion = await prisma.category.create({
    data: {
      name: "Men's Fashion",
      slug: "mens-fashion",
      description: "Crisp formal wear, kurtas, jackets, and modern everyday streetwear.",
      image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80",
      featured: true,
    },
  });

  const catWomensFashion = await prisma.category.create({
    data: {
      name: "Women's Fashion",
      slug: "womens-fashion",
      description: "Graceful ethnic sarees, designer anarkalis, dresses and fusion wear.",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      featured: true,
    },
  });

  const catHomeLiving = await prisma.category.create({
    data: {
      name: "Home & Living",
      slug: "home-living",
      description: "Handcrafted decor, ergonomic lighting, aromatics, and artisan cookware.",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
      featured: true,
    },
  });

  const catBeauty = await prisma.category.create({
    data: {
      name: "Beauty & Wellness",
      slug: "beauty-wellness",
      description: "Ayurvedic skincare, luxury fragrances, hair therapies, and organic botanicals.",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
      featured: true,
    },
  });

  const catFootwear = await prisma.category.create({
    data: {
      name: "Footwear & Accessories",
      slug: "footwear-accessories",
      description: "Handcrafted leather mojris, performance sneakers, wallets and analog watches.",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
      featured: false,
    },
  });

  console.log("📁 Created 6 main categories.");

  // 3. Products Data Definition (32 detailed products)
  const productsData = [
    // Electronics
    {
      name: "SonicPro Wireless ANC Headphones",
      slug: "sonicpro-wireless-anc-headphones",
      sku: "ELEC-HEAD-001",
      brand: "Acoustix India",
      categoryId: catElectronics.id,
      subcategory: "Audio",
      shortDescription: "Flagship hybrid active noise cancelling over-ear headphones with 45h battery life.",
      description: "Immerse yourself in rich, studio-grade acoustics. The SonicPro features 40mm neodymium dynamic drivers tuned specifically for deep bass and crystalline highs. With dual-mic ENC call clarity, ultra-soft memory foam earcups, and fast USB-C charging (10 mins gives 5 hours), these headphones are built for audiophiles and jet-setters.",
      price: 4999,
      compareAtPrice: 8999,
      discount: 44,
      stockQuantity: 45,
      lowStockThreshold: 5,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 142,
      tags: JSON.stringify(["audio", "anc", "bluetooth", "wireless", "headphones"]),
      sizes: JSON.stringify([]),
      colors: JSON.stringify(["Midnight Black", "Platinum Silver", "Navy Blue"]),
      specifications: JSON.stringify({
        "Battery Life": "45 Hours (ANC On)",
        "Driver Unit": "40mm Beryllium-coated",
        "Bluetooth Version": "5.3 with LDAC support",
        "Weight": "250g",
        "Warranty": "1 Year Manufacturer Replacement"
      }),
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: [
        { sku: "ELEC-HEAD-001-BLK", name: "Midnight Black", color: "Midnight Black", price: 4999, stockQuantity: 20 },
        { sku: "ELEC-HEAD-001-SLV", name: "Platinum Silver", color: "Platinum Silver", price: 4999, stockQuantity: 15 },
        { sku: "ELEC-HEAD-001-BLU", name: "Navy Blue", color: "Navy Blue", price: 5199, stockQuantity: 10 }
      ]
    },
    {
      name: "PulseFit AMOLED Smartwatch 2",
      slug: "pulsefit-amoled-smartwatch-2",
      sku: "ELEC-WATCH-002",
      brand: "TitanX",
      categoryId: catElectronics.id,
      subcategory: "Wearables",
      shortDescription: "1.43-inch Retina AMOLED display with continuous SpO2, heart rate, and Bluetooth calling.",
      description: "Stay ahead with an ultra-bright 1000-nit always-on display, stainless steel bezel, and over 110 sports tracking modes. Supports native Hindi and English UI, AI voice assistant, and 7-day battery life with IP68 water resistance.",
      price: 2999,
      compareAtPrice: 5999,
      discount: 50,
      stockQuantity: 60,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.6,
      reviewCount: 98,
      tags: JSON.stringify(["smartwatch", "fitness", "wearable", "amoled"]),
      sizes: JSON.stringify(["Standard (44mm)"]),
      colors: JSON.stringify(["Carbon Black", "Rose Gold", "Titanium Grey"]),
      specifications: JSON.stringify({
        "Display": "1.43\" AMOLED 466x466",
        "Water Resistance": "IP68 / 5 ATM",
        "Battery": "380mAh (7 Days Typical)",
        "Sensors": "Optical Heart Rate, SpO2, Accelerometer"
      }),
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: [
        { sku: "ELEC-WATCH-002-BLK", name: "Carbon Black", color: "Carbon Black", price: 2999, stockQuantity: 30 },
        { sku: "ELEC-WATCH-002-RSG", name: "Rose Gold", color: "Rose Gold", price: 3199, stockQuantity: 20 },
        { sku: "ELEC-WATCH-002-GRY", name: "Titanium Grey", color: "Titanium Grey", price: 2999, stockQuantity: 10 }
      ]
    },
    {
      name: "SoundBlast 360 Portable Waterproof Speaker",
      slug: "soundblast-360-portable-speaker",
      sku: "ELEC-SPK-003",
      brand: "boAtWave",
      categoryId: catElectronics.id,
      subcategory: "Audio",
      shortDescription: "24W omnidirectional stereo sound with deep punchy bass and IPX7 floating design.",
      description: "Engineered for outdoor treks and house parties alike. Features custom dual passive radiators, 16 hours of continuous playtime, and party-sync mode to link up to 10 speakers simultaneously.",
      price: 1899,
      compareAtPrice: 3499,
      discount: 45,
      stockQuantity: 28,
      isFeatured: false,
      isBestSeller: true,
      rating: 4.5,
      reviewCount: 76,
      tags: JSON.stringify(["speaker", "bluetooth", "waterproof", "bass"]),
      sizes: JSON.stringify([]),
      colors: JSON.stringify(["Rugged Camo", "Electric Blue", "Obsidian Black"]),
      specifications: JSON.stringify({
        "Audio Output": "24 Watts RMS",
        "Battery": "4000mAh Lithium-ion",
        "Waterproofing": "IPX7 (Submersible up to 1m)",
        "Bluetooth": "v5.2"
      }),
      images: [
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: [
        { sku: "ELEC-SPK-003-CAM", name: "Rugged Camo", color: "Rugged Camo", price: 1899, stockQuantity: 10 },
        { sku: "ELEC-SPK-003-BLU", name: "Electric Blue", color: "Electric Blue", price: 1899, stockQuantity: 8 },
        { sku: "ELEC-SPK-003-BLK", name: "Obsidian Black", color: "Obsidian Black", price: 1899, stockQuantity: 10 }
      ]
    },
    {
      name: "HyperCharge 65W GaN Fast Charger",
      slug: "hypercharge-65w-gan-fast-charger",
      sku: "ELEC-CHG-004",
      brand: "AnkerTech",
      categoryId: catElectronics.id,
      subcategory: "Accessories",
      shortDescription: "Compact 3-port Gallium Nitride wall charger with Power Delivery 3.0 & PPS support.",
      description: "Charge your MacBook, iPhone, and Apple Watch all from a single pocket-sized adapter. GaN III semiconductor technology keeps the adapter cool while delivering blazing-fast 65W total output.",
      price: 1999,
      compareAtPrice: 3299,
      discount: 39,
      stockQuantity: 50,
      isFeatured: false,
      isBestSeller: false,
      rating: 4.7,
      reviewCount: 39,
      tags: JSON.stringify(["charger", "gan", "fast-charging", "usb-c"]),
      sizes: JSON.stringify([]),
      colors: JSON.stringify(["White", "Matte Black"]),
      specifications: JSON.stringify({
        "Output": "65W Max USB-C PD 3.0",
        "Ports": "2x USB-C, 1x USB-A",
        "Safety": "Over-voltage, surge & thermal protection"
      }),
      images: [
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },
    {
      name: "TrueWireless Earbuds Pro with Spatial Audio",
      slug: "truewireless-earbuds-pro",
      sku: "ELEC-TWS-005",
      brand: "Acoustix India",
      categoryId: catElectronics.id,
      subcategory: "Audio",
      shortDescription: "Ultra-low latency 38ms gaming mode, 32dB active noise cancellation, and wireless charging case.",
      description: "Designed for all-day comfort. Features 11mm titanium diaphragm drivers, touch gestures, and quad microphones with environmental noise suppression for wind-free crystal clear calls.",
      price: 2499,
      compareAtPrice: 4999,
      discount: 50,
      stockQuantity: 3, // Low stock test case
      lowStockThreshold: 5,
      isFeatured: true,
      isBestSeller: false,
      rating: 4.4,
      reviewCount: 65,
      tags: JSON.stringify(["tws", "earbuds", "spatial-audio", "wireless"]),
      sizes: JSON.stringify([]),
      colors: JSON.stringify(["Glacier White", "Phantom Black"]),
      specifications: JSON.stringify({
        "Playtime": "36 hours total with case",
        "Latency": "38ms Ultra-low",
        "Charging": "Qi Wireless & Type-C"
      }),
      images: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },
    {
      name: "Zenith 4K UHD Streaming TV Stick",
      slug: "zenith-4k-uhd-streaming-tv-stick",
      sku: "ELEC-STRM-006",
      brand: "VisionPlus",
      categoryId: catElectronics.id,
      subcategory: "Entertainment",
      shortDescription: "Dolby Vision Atmos, HDR10+, quad-core processor and voice-controlled smart remote.",
      description: "Transform any HDMI monitor or television into an ultra-fast smart entertainment center. Instant access to Netflix, Prime Video, Hotstar, and YouTube in razor-sharp 4K HDR at 60fps.",
      price: 3299,
      compareAtPrice: 4999,
      discount: 34,
      stockQuantity: 0, // Out of stock test case
      isFeatured: false,
      isBestSeller: false,
      rating: 4.6,
      reviewCount: 42,
      tags: JSON.stringify(["streaming", "4k", "tv", "entertainment"]),
      sizes: JSON.stringify([]),
      colors: JSON.stringify(["Black"]),
      specifications: JSON.stringify({
        "Resolution": "4K Ultra HD up to 60fps",
        "Audio": "Dolby Atmos pass-through",
        "Storage": "8GB High-speed eMMC"
      }),
      images: [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },

    // Men's Fashion
    {
      name: "Handwoven Royal Khadi Nehru Jacket",
      slug: "handwoven-royal-khadi-nehru-jacket",
      sku: "MEN-JKT-007",
      brand: "FabDesi",
      categoryId: catMensFashion.id,
      subcategory: "Ethnic Wear",
      shortDescription: "Pure handspun khadi cotton Nehru jacket with handcrafted brass antique buttons.",
      description: "Elevate your celebratory ensemble with this timeless bandhgala Nehru jacket. Crafted by master artisans in Uttar Pradesh using organic breathable cotton yarn, featuring a structured mandarin collar and silk welt pockets.",
      price: 2499,
      compareAtPrice: 4499,
      discount: 44,
      stockQuantity: 35,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 58,
      tags: JSON.stringify(["ethnic", "nehru-jacket", "khadi", "wedding", "festive"]),
      sizes: JSON.stringify(["38", "40", "42", "44"]),
      colors: JSON.stringify(["Imperial Navy", "Olive Green", "Beige Khadi"]),
      specifications: JSON.stringify({
        "Fabric": "100% Handspun Organic Khadi Cotton",
        "Lining": "Premium Breathable Satin Silk",
        "Care": "Dry Clean Recommended",
        "Origin": "Varanasi, India"
      }),
      images: [
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: [
        { sku: "MEN-JKT-007-NVY-40", name: "Imperial Navy / 40", size: "40", color: "Imperial Navy", price: 2499, stockQuantity: 10 },
        { sku: "MEN-JKT-007-NVY-42", name: "Imperial Navy / 42", size: "42", color: "Imperial Navy", price: 2499, stockQuantity: 8 },
        { sku: "MEN-JKT-007-OLV-40", name: "Olive Green / 40", size: "40", color: "Olive Green", price: 2499, stockQuantity: 9 },
        { sku: "MEN-JKT-007-BGE-42", name: "Beige Khadi / 42", size: "42", color: "Beige Khadi", price: 2499, stockQuantity: 8 }
      ]
    },
    {
      name: "Tailored Oxford Cotton Formal Shirt",
      slug: "tailored-oxford-cotton-formal-shirt",
      sku: "MEN-SHT-008",
      brand: "The Bombay Shirt Co.",
      categoryId: catMensFashion.id,
      subcategory: "Shirts",
      shortDescription: "100% 2-ply Egyptian Giza cotton shirt with semi-spread collar and wrinkle-resistant finish.",
      description: "The quintessential cornerstone of modern business attire. Tailored for a crisp European silhouette with mother-of-pearl buttons and double-stitched armholes for enduring elegance.",
      price: 1599,
      compareAtPrice: 2899,
      discount: 45,
      stockQuantity: 70,
      isFeatured: false,
      isBestSeller: true,
      rating: 4.7,
      reviewCount: 110,
      tags: JSON.stringify(["formal", "cotton", "oxford", "office-wear"]),
      sizes: JSON.stringify(["39", "40", "42", "44"]),
      colors: JSON.stringify(["Powder Blue", "Crisp White", "French Pink"]),
      specifications: JSON.stringify({
        "Material": "100% Superfine Egyptian Cotton (80s 2-ply)",
        "Fit": "Slim Contemporary Fit",
        "Cuff": "Convertible Barrel Cuff"
      }),
      images: [
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: [
        { sku: "MEN-SHT-008-BLU-40", name: "Powder Blue / 40", size: "40", color: "Powder Blue", price: 1599, stockQuantity: 25 },
        { sku: "MEN-SHT-008-WHT-40", name: "Crisp White / 40", size: "40", color: "Crisp White", price: 1599, stockQuantity: 25 },
        { sku: "MEN-SHT-008-WHT-42", name: "Crisp White / 42", size: "42", color: "Crisp White", price: 1599, stockQuantity: 20 }
      ]
    },
    {
      name: "Indigo Selvedge Slim Fit Denim Jeans",
      slug: "indigo-selvedge-slim-fit-denim-jeans",
      sku: "MEN-JNS-009",
      brand: "RawCraft",
      categoryId: catMensFashion.id,
      subcategory: "Jeans",
      shortDescription: "13.5oz heavy shuttle-loomed Japanese selvedge denim with natural indigo vat dye.",
      description: "Built to develop personalized whiskers and honeycombs over time. Features vintage copper rivets, heavy-duty chain-stitched hem, and genuine vegetable-tanned leather waistband patch.",
      price: 2899,
      compareAtPrice: 4999,
      discount: 42,
      stockQuantity: 40,
      isFeatured: false,
      isBestSeller: false,
      rating: 4.8,
      reviewCount: 34,
      tags: JSON.stringify(["denim", "selvedge", "indigo", "casual"]),
      sizes: JSON.stringify(["30", "32", "34", "36"]),
      colors: JSON.stringify(["Raw Deep Indigo"]),
      specifications: JSON.stringify({
        "Denim Weight": "13.5 oz Shuttle Loomed",
        "Composition": "98% Cotton, 2% Elastane for flex",
        "Hardware": "Solid Antiqued Copper Rivets"
      }),
      images: [
        "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },
    {
      name: "Pure Chanderi Silk Kurta Pajama Set",
      slug: "pure-chanderi-silk-kurta-pajama-set",
      sku: "MEN-KRT-010",
      brand: "Manyavar Veda",
      categoryId: catMensFashion.id,
      subcategory: "Ethnic Wear",
      shortDescription: "Subtle zari threadwork along neckline with comfortable churidar trousers.",
      description: "Radiate effortless poise at family celebrations, Diwali parties, and weddings. Features lustrous Chanderi silk with cotton lining for breathability throughout warm evening events.",
      price: 3499,
      compareAtPrice: 5999,
      discount: 41,
      stockQuantity: 24,
      isFeatured: true,
      isBestSeller: false,
      rating: 4.6,
      reviewCount: 48,
      tags: JSON.stringify(["kurta", "chanderi", "silk", "ethnic", "diwali"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      colors: JSON.stringify(["Maroon Gold", "Mustard Yellow", "Emerald Green"]),
      specifications: JSON.stringify({
        "Fabric": "Chanderi Silk Blend",
        "Includes": "Long Kurta + Churidar Pajama",
        "Work": "Fine Thread Resham Embroidery"
      }),
      images: [
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },
    {
      name: "Heavyweight 280 GSM Oversized Graphic Tee",
      slug: "heavyweight-280-gsm-oversized-graphic-tee",
      sku: "MEN-TEE-011",
      brand: "UrbanGully",
      categoryId: catMensFashion.id,
      subcategory: "T-Shirts",
      shortDescription: "Drop-shoulder aesthetic streetwear t-shirt with high-density puff screen print.",
      description: "Cut from combed heavyweight ring-spun Indian cotton. Pre-shrunk, bio-washed, with ribbed crew collar that holds shape wash after wash.",
      price: 899,
      compareAtPrice: 1599,
      discount: 43,
      stockQuantity: 95,
      isFeatured: false,
      isBestSeller: true,
      rating: 4.5,
      reviewCount: 160,
      tags: JSON.stringify(["tshirt", "oversized", "streetwear", "graphic-tee"]),
      sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
      colors: JSON.stringify(["Washed Charcoal", "Off White", "Sage Green"]),
      specifications: JSON.stringify({
        "GSM": "280 GSM Heavy Combed Cotton",
        "Fit": "Relaxed Boxy Streetwear Cut",
        "Wash Care": "Machine wash cold inside out"
      }),
      images: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },

    // Women's Fashion
    {
      name: "Banarasi Katan Silk Handloom Saree",
      slug: "banarasi-katan-silk-handloom-saree",
      sku: "WOM-SAREE-012",
      brand: "Varanasi Heritage",
      categoryId: catWomensFashion.id,
      subcategory: "Sarees",
      shortDescription: "Intricate floral kadhwa gold zari jaal weaving with contrasting grand pallu.",
      description: "An heirloom treasure woven by master weavers over 28 working days. Crafted in authentic pure Katan silk, this Banarasi drape catches the light with subtle majesty, perfect for brides, receptions, and memorable galas. Comes with silk mark certification and unstitched blouse piece.",
      price: 8499,
      compareAtPrice: 14999,
      discount: 43,
      stockQuantity: 18,
      isFeatured: true,
      isBestSeller: true,
      rating: 5.0,
      reviewCount: 84,
      tags: JSON.stringify(["saree", "banarasi", "silk", "handloom", "wedding", "zari"]),
      sizes: JSON.stringify(["Free Size (6.3m with blouse)"]),
      colors: JSON.stringify(["Crimson Red", "Royal Teal", "Rani Pink"]),
      specifications: JSON.stringify({
        "Weave": "Handloom Kadhwa Zari",
        "Fabric": "100% Pure Katan Silk (Silk Mark Certified)",
        "Saree Length": "5.5 meters + 0.8 meter blouse",
        "Border": "Antique Gold Floral Zari"
      }),
      images: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: [
        { sku: "WOM-SAREE-012-RED", name: "Crimson Red & Antique Gold", color: "Crimson Red", price: 8499, stockQuantity: 8 },
        { sku: "WOM-SAREE-012-TEA", name: "Royal Teal & Silver Zari", color: "Royal Teal", price: 8499, stockQuantity: 6 },
        { sku: "WOM-SAREE-012-RNK", name: "Rani Pink & Rose Gold", color: "Rani Pink", price: 8799, stockQuantity: 4 }
      ]
    },
    {
      name: "Embroidered Georgette Anarkali Suit Set",
      slug: "embroidered-georgette-anarkali-suit-set",
      sku: "WOM-SUIT-013",
      brand: "Ritu Riwaz",
      categoryId: catWomensFashion.id,
      subcategory: "Ethnic Sets",
      shortDescription: "Floor-length flared anarkali gown with mirror embroidery and organza dupatta.",
      description: "Twirl in dreamy grace. Features intricate Lucknowi chikankari and sequence mirror embellishment across the yoke and borders. Accompanied by silk santoon churidar bottoms and scalloped dupatta.",
      price: 3999,
      compareAtPrice: 6999,
      discount: 42,
      stockQuantity: 25,
      isFeatured: true,
      isBestSeller: false,
      rating: 4.7,
      reviewCount: 67,
      tags: JSON.stringify(["anarkali", "suit", "georgette", "ethnic", "party"]),
      sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
      colors: JSON.stringify(["Dusty Peach", "Pistachio Green", "Lavender Mist"]),
      specifications: JSON.stringify({
        "Top Fabric": "Viscose Georgette with Shantoon lining",
        "Dupatta": "Pure Organza with Hand Cutwork",
        "Flare": "3.5 meters full kalidar flare"
      }),
      images: [
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },
    {
      name: "Floral Block Printed Cotton Tiered Maxi Dress",
      slug: "floral-block-printed-cotton-tiered-maxi-dress",
      sku: "WOM-DRS-014",
      brand: "Jaipur Loom",
      categoryId: catWomensFashion.id,
      subcategory: "Dresses",
      shortDescription: "Hand-carved wooden block print sundress with smocked bodice and flutter sleeves.",
      description: "Artisanal comfort for sun-drenched vacations and brunch outings. Made from breezy 60s mulmul cotton with non-toxic vegetable dyes from Sanganer, Jaipur.",
      price: 1799,
      compareAtPrice: 2999,
      discount: 40,
      stockQuantity: 42,
      isFeatured: false,
      isBestSeller: true,
      rating: 4.6,
      reviewCount: 52,
      tags: JSON.stringify(["dress", "cotton", "block-print", "jaipur", "maxi"]),
      sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
      colors: JSON.stringify(["Indigo Floral", "Marigold Ochre"]),
      specifications: JSON.stringify({
        "Material": "100% Breathable Mulmul Cotton",
        "Pockets": "Two deep side pockets",
        "Length": "50 inches Maxi length"
      }),
      images: [
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },
    {
      name: "Artisan Kantha Stitch Cotton Tote Bag",
      slug: "artisan-kantha-stitch-cotton-tote-bag",
      sku: "WOM-ACC-015",
      brand: "Bengal Craft Co.",
      categoryId: catWomensFashion.id,
      subcategory: "Bags",
      shortDescription: "Reversible quilted tote with traditional running Kantha needlework and brass magnetic snap.",
      description: "Spacious enough for a 15-inch laptop, water bottle, planner, and daily cosmetics. Crafted by women artisans in rural West Bengal using upcycled vintage cotton fabrics.",
      price: 999,
      compareAtPrice: 1699,
      discount: 41,
      stockQuantity: 30,
      isFeatured: false,
      isBestSeller: false,
      rating: 4.9,
      reviewCount: 29,
      tags: JSON.stringify(["tote", "handcrafted", "kantha", "sustainable"]),
      sizes: JSON.stringify(["One Size"]),
      colors: JSON.stringify(["Multicolor Vintage"]),
      specifications: JSON.stringify({
        "Dimensions": "16\" H x 15\" W x 4\" D",
        "Shoulder Drop": "11 inches",
        "Compartments": "1 main compartment + 2 interior zipped pockets"
      }),
      images: [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },

    // Home & Living
    {
      name: "Handcrafted Brass Diya & Urli Set",
      slug: "handcrafted-brass-diya-urli-set",
      sku: "HOME-DEC-016",
      brand: "Moradabad Artisans",
      categoryId: catHomeLiving.id,
      subcategory: "Decor",
      shortDescription: "12-inch cast virgin brass urli bowl with floating candle holders and peacock motifs.",
      description: "Infuse your entryway or living space with festive warmth. Hand-hammered in Moradabad from thick solid brass with a protective anti-tarnish lacquer coating.",
      price: 2199,
      compareAtPrice: 3899,
      discount: 43,
      stockQuantity: 36,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 92,
      tags: JSON.stringify(["brass", "urli", "diya", "home-decor", "festive", "puja"]),
      sizes: JSON.stringify(["12 Inch"]),
      colors: JSON.stringify(["Antique Gold"]),
      specifications: JSON.stringify({
        "Material": "Solid Virgin Brass",
        "Diameter": "12 inches (Urli) + 4 inch Diya stand",
        "Weight": "1.85 kg",
        "Finish": "Lacquered Antique Gold"
      }),
      images: [
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },
    {
      name: "Luxury 400 TC Egyptian Cotton Bedding Set",
      slug: "luxury-400-tc-egyptian-cotton-bedding-set",
      sku: "HOME-BED-017",
      brand: "Solitude Home",
      categoryId: catHomeLiving.id,
      subcategory: "Bedding",
      shortDescription: "Sateen weave king size flat sheet with 2 pillowcases in soothing earthy tones.",
      description: "Experience the cool, silky drape of hotel luxury every night. Crafted from extra-long staple combed cotton that resists pilling and grows softer with every wash cycle.",
      price: 2699,
      compareAtPrice: 4999,
      discount: 46,
      stockQuantity: 28,
      isFeatured: false,
      isBestSeller: true,
      rating: 4.7,
      reviewCount: 44,
      tags: JSON.stringify(["bedsheet", "egyptian-cotton", "luxury", "bedding"]),
      sizes: JSON.stringify(["King Size (108\" x 108\")", "Queen Size (90\" x 100\")"]),
      colors: JSON.stringify(["Earthy Beige", "Muted Sage", "Cloud White"]),
      specifications: JSON.stringify({
        "Thread Count": "400 TC Sateen Weave",
        "Material": "100% Long Staple Cotton",
        "Set Includes": "1 King Bed Sheet + 2 Pillow Shams"
      }),
      images: [
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: [
        { sku: "HOME-BED-017-BGE-K", name: "Earthy Beige / King", size: "King Size (108\" x 108\")", color: "Earthy Beige", price: 2699, stockQuantity: 15 },
        { sku: "HOME-BED-017-WHT-K", name: "Cloud White / King", size: "King Size (108\" x 108\")", color: "Cloud White", price: 2699, stockQuantity: 13 }
      ]
    },
    {
      name: "Ultrasonic Ceramic Essential Oil Diffuser",
      slug: "ultrasonic-ceramic-essential-oil-diffuser",
      sku: "HOME-DIF-018",
      brand: "AuraAroma",
      categoryId: catHomeLiving.id,
      subcategory: "Wellness",
      shortDescription: "Handmade fluted ceramic cool mist humidifier with 7 ambient warm LED light modes.",
      description: "Whisper-quiet 2.4MHz ultrasonic vibration transforms your room into an ayurvedic spa sanctuary. Includes auto-off safety shutoff and 4 timer interval settings.",
      price: 1899,
      compareAtPrice: 3299,
      discount: 42,
      stockQuantity: 40,
      isFeatured: false,
      isBestSeller: false,
      rating: 4.6,
      reviewCount: 38,
      tags: JSON.stringify(["diffuser", "aromatherapy", "ceramic", "wellness"]),
      sizes: JSON.stringify(["300ml"]),
      colors: JSON.stringify(["Terracotta Stone", "Pure Chalk"]),
      specifications: JSON.stringify({
        "Capacity": "300ml water tank (up to 10h run)",
        "Coverage": "Up to 350 sq ft",
        "Power": "12W DC Adapter included"
      }),
      images: [
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },
    {
      name: "Pre-Seasoned Cast Iron Dosa Tawa 11-inch",
      slug: "pre-seasoned-cast-iron-dosa-tawa",
      sku: "HOME-KIT-019",
      brand: "Indus Valley Craft",
      categoryId: catHomeLiving.id,
      subcategory: "Cookware",
      shortDescription: "Naturally non-stick toxin-free tawa triple seasoned with organic cold-pressed gingelly oil.",
      description: "Crispy restaurant-grade dosas, chapatis, and parathas without chemical Teflon coatings. Thick bottom heat distribution ensures uniform golden browning and enriches daily meals with dietary iron.",
      price: 1499,
      compareAtPrice: 2499,
      discount: 40,
      stockQuantity: 55,
      isFeatured: false,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 112,
      tags: JSON.stringify(["cast-iron", "cookware", "tawa", "healthy", "kitchen"]),
      sizes: JSON.stringify(["11 Inch"]),
      colors: JSON.stringify(["Natural Black"]),
      specifications: JSON.stringify({
        "Weight": "2.2 kg Solid Cast Iron",
        "Compatibility": "Gas, Induction, Oven & Campfire",
        "Coating": "Zero synthetic chemicals; 100% natural oil seasoned"
      }),
      images: [
        "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },

    // Beauty & Wellness
    {
      name: "Kumkumadi Ayurvedic Miraculous Beauty Fluid",
      slug: "kumkumadi-ayurvedic-miraculous-beauty-fluid",
      sku: "BTY-OIL-020",
      brand: "Vedic Radiance",
      categoryId: catBeauty.id,
      subcategory: "Skincare",
      shortDescription: "100% pure night serum with Kashmiri saffron, sandalwood, lotus, and 26 precious herbs.",
      description: "The crown jewel of Ayurvedic beauty rituals. Formulated as per classical Ayurvedic scripture, this golden elixir reduces hyperpigmentation, smooths fine lines, and illuminates dull skin with vibrant vitality.",
      price: 1899,
      compareAtPrice: 2999,
      discount: 37,
      stockQuantity: 65,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 175,
      tags: JSON.stringify(["ayurveda", "saffron", "kumkumadi", "face-oil", "radiance"]),
      sizes: JSON.stringify(["15ml", "30ml"]),
      colors: JSON.stringify([]),
      specifications: JSON.stringify({
        "Volume": "30ml Glass Dropper Bottle",
        "Key Actives": "Grade A Kashmiri Mongra Saffron, Red Sandalwood, Manjistha",
        "Free From": "Parabens, Sulphates, Mineral Oil, Silicones"
      }),
      images: [
        "https://images.unsplash.com/photo-1608248597359-bb495c02dcbe?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: [
        { sku: "BTY-OIL-020-15M", name: "15ml Trial Size", size: "15ml", price: 1099, stockQuantity: 30 },
        { sku: "BTY-OIL-020-30M", name: "30ml Full Size", size: "30ml", price: 1899, stockQuantity: 35 }
      ]
    },
    {
      name: "Wild Rose & Hibiscus Restorative Hair Mask",
      slug: "wild-rose-hibiscus-restorative-hair-mask",
      sku: "BTY-HAR-021",
      brand: "Botanica Roots",
      categoryId: catBeauty.id,
      subcategory: "Haircare",
      shortDescription: "Deep conditioning butter treatment for frizz repair and scalp nourishment.",
      description: "Infused with cold-pressed bhringraj oil, fresh organic hibiscus flower extract, and raw shea butter. Seals damaged hair cuticles and prevents split ends caused by pollution and heat styling.",
      price: 799,
      compareAtPrice: 1299,
      discount: 38,
      stockQuantity: 80,
      isFeatured: false,
      isBestSeller: false,
      rating: 4.6,
      reviewCount: 54,
      tags: JSON.stringify(["haircare", "hair-mask", "hibiscus", "organic"]),
      sizes: JSON.stringify(["200g"]),
      colors: JSON.stringify([]),
      specifications: JSON.stringify({
        "Net Weight": "200 grams",
        "Hair Type": "Dry, Damaged, Chemically Treated",
        "Fragrance": "Natural Kannauj Rose Petals"
      }),
      images: [
        "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },
    {
      name: "Oudh & Vetiver Luxury Eau De Parfum 100ml",
      slug: "oudh-vetiver-luxury-eau-de-parfum",
      sku: "BTY-PRF-022",
      brand: "Kannauj Perfumery",
      categoryId: catBeauty.id,
      subcategory: "Fragrance",
      shortDescription: "Long-lasting artisanal EDP with smokey Assam agarwood, wild Khus, and cardamon notes.",
      description: "A magnetic, unisex sillage that lingers for over 12 hours. Distilled in copper deg-bhapka stills in the historic perfume capital of India, Kannauj.",
      price: 2799,
      compareAtPrice: 4500,
      discount: 38,
      stockQuantity: 22,
      isFeatured: true,
      isBestSeller: false,
      rating: 4.8,
      reviewCount: 46,
      tags: JSON.stringify(["perfume", "oudh", "fragrance", "luxury", "edp"]),
      sizes: JSON.stringify(["100ml"]),
      colors: JSON.stringify([]),
      specifications: JSON.stringify({
        "Concentration": "22% Extrait De Parfum",
        "Top Notes": "Cardamom, Bergamot, Pink Pepper",
        "Heart Notes": "Kashmiri Rose, Cedarwood",
        "Base Notes": "Pure Assam Agarwood (Oudh), Vetiver (Khus)"
      }),
      images: [
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },

    // Footwear & Accessories
    {
      name: "Handcrafted Kolhapuri Leather Mojri",
      slug: "handcrafted-kolhapuri-leather-mojri",
      sku: "FTW-KOL-023",
      brand: "Deccan Cobblers",
      categoryId: catFootwear.id,
      subcategory: "Ethnic Footwear",
      shortDescription: "Genuine buff leather footwear with braided thread detailing and cushioned insole.",
      description: "Authentic Kolhapuri craftsmanship tanned naturally with acacia bark. Flexible, durable, and designed with a soft padded footbed to pair effortlessly with festive kurtas or casual jeans.",
      price: 1699,
      compareAtPrice: 2899,
      discount: 41,
      stockQuantity: 32,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.7,
      reviewCount: 88,
      tags: JSON.stringify(["shoes", "kolhapuri", "leather", "ethnic-footwear"]),
      sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]),
      colors: JSON.stringify(["Tan Brown", "Deep Chestnut"]),
      specifications: JSON.stringify({
        "Upper Material": "100% Genuine Full Grain Leather",
        "Sole": "Hand-stitched Vegetable Tanned Leather",
        "Padding": "5mm High Density EVA Foam"
      }),
      images: [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: [
        { sku: "FTW-KOL-023-TAN-8", name: "Tan Brown / UK 8", size: "UK 8", color: "Tan Brown", price: 1699, stockQuantity: 10 },
        { sku: "FTW-KOL-023-TAN-9", name: "Tan Brown / UK 9", size: "UK 9", color: "Tan Brown", price: 1699, stockQuantity: 12 },
        { sku: "FTW-KOL-023-BRN-9", name: "Deep Chestnut / UK 9", size: "UK 9", color: "Deep Chestnut", price: 1699, stockQuantity: 10 }
      ]
    },
    {
      name: "Heritage Brass & Leather Automatic Men's Watch",
      slug: "heritage-brass-leather-automatic-watch",
      sku: "ACC-WCH-024",
      brand: "HMT Revival",
      categoryId: catFootwear.id,
      subcategory: "Watches",
      shortDescription: "Self-winding 24-jewel Japanese mechanical movement with domed sapphire crystal.",
      description: "A celebration of mid-century industrial horology. Features an open-heart skeleton dial, exhibition glass back, 40-hour power reserve, and Italian saddle-stitched calfskin leather strap.",
      price: 6999,
      compareAtPrice: 11999,
      discount: 42,
      stockQuantity: 15,
      isFeatured: true,
      isBestSeller: false,
      rating: 4.9,
      reviewCount: 31,
      tags: JSON.stringify(["watch", "automatic", "horology", "leather", "mechanical"]),
      sizes: JSON.stringify(["40mm"]),
      colors: JSON.stringify(["Vintage Gold & Cognac Leather"]),
      specifications: JSON.stringify({
        "Case Diameter": "40mm 316L Stainless Steel",
        "Glass": "Anti-reflective Sapphire Crystal",
        "Water Resistance": "100m (10 ATM)",
        "Strap Width": "20mm Interchangeable"
      }),
      images: [
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },
    {
      name: "Aerolight Carbon Performance Running Shoes",
      slug: "aerolight-carbon-running-shoes",
      sku: "FTW-RUN-025",
      brand: "StrideX",
      categoryId: catFootwear.id,
      subcategory: "Sports Shoes",
      shortDescription: "Full-length carbon composite propulsion plate with supercritical foam cushioning.",
      description: "Engineered for half-marathons and everyday speed runs. Weighing just 210g, the engineered mono-mesh upper provides maximum airflow while the carbon plate provides explosive energy return.",
      price: 3499,
      compareAtPrice: 5999,
      discount: 42,
      stockQuantity: 44,
      isFeatured: false,
      isBestSeller: true,
      rating: 4.6,
      reviewCount: 63,
      tags: JSON.stringify(["shoes", "running", "carbon-plate", "marathon", "sports"]),
      sizes: JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10"]),
      colors: JSON.stringify(["Neon Volt", "Triple Black"]),
      specifications: JSON.stringify({
        "Weight": "210g (UK 8)",
        "Stack Height": "38mm Heel / 30mm Forefoot (8mm drop)",
        "Outsole": "High-abrasion rubber lugged grip"
      }),
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: [
        { sku: "FTW-RUN-025-VLT-8", name: "Neon Volt / UK 8", size: "UK 8", color: "Neon Volt", price: 3499, stockQuantity: 15 },
        { sku: "FTW-RUN-025-BLK-9", name: "Triple Black / UK 9", size: "UK 9", color: "Triple Black", price: 3499, stockQuantity: 15 }
      ]
    },
    {
      name: "Top-Grain Leather Minimalist RFID Cardholder",
      slug: "top-grain-leather-rfid-cardholder",
      sku: "ACC-WLT-026",
      brand: "RawCraft",
      categoryId: catFootwear.id,
      subcategory: "Wallets",
      shortDescription: "Ultra-slim front pocket wallet with quick-draw thumb slot and RFID blocking liner.",
      description: "Holds up to 8 cards plus folded currency notes without pocket bulge. Crafted in full-grain waxed leather that develops a magnificent patina as it ages.",
      price: 799,
      compareAtPrice: 1499,
      discount: 47,
      stockQuantity: 80,
      isFeatured: false,
      isBestSeller: false,
      rating: 4.7,
      reviewCount: 51,
      tags: JSON.stringify(["wallet", "cardholder", "leather", "rfid", "edc"]),
      sizes: JSON.stringify(["Slim"]),
      colors: JSON.stringify(["Hunter Green", "Crazy Horse Tan", "Matte Black"]),
      specifications: JSON.stringify({
        "Dimensions": "10cm x 7.5cm x 0.6cm",
        "Security": "13.56 MHz RFID Shielding",
        "Slots": "6 card slots + 1 center cash pocket"
      }),
      images: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },

    // Additional Products to ensure complete coverage & 30+ items
    {
      name: "Ergonomic Aluminium Laptop Riser Stand",
      slug: "ergonomic-aluminium-laptop-riser-stand",
      sku: "ELEC-STD-027",
      brand: "AnkerTech",
      categoryId: catElectronics.id,
      subcategory: "Accessories",
      shortDescription: "Foldable 6-level adjustable ergonomic riser with anti-slip silicone cushions.",
      description: "Improve your posture and keep your workspace clean with this precision-crafted aircraft grade aluminum laptop riser. Features open airflow ventilation to prevent thermal throttling.",
      price: 899,
      compareAtPrice: 1599,
      discount: 44,
      stockQuantity: 65,
      isFeatured: false,
      isBestSeller: false,
      rating: 4.8,
      reviewCount: 77,
      tags: JSON.stringify(["laptop-stand", "desk-setup", "work-from-home", "ergonomics"]),
      sizes: JSON.stringify([]),
      colors: JSON.stringify(["Space Grey", "Silver"]),
      specifications: JSON.stringify({
        "Material": "Anodized Aerospace Aluminum Alloy",
        "Compatibility": "10\" to 17\" Laptops and Tablets"
      }),
      images: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },
    {
      name: "Pure Copper Hammered Water Bottle 1000ml",
      slug: "pure-copper-hammered-water-bottle",
      sku: "HOME-COP-028",
      brand: "AyurVessel",
      categoryId: catHomeLiving.id,
      subcategory: "Drinkware",
      shortDescription: "99.7% pure leakproof Ayurvedic copper flask with silicone seal cap.",
      description: "Experience the benefits of Tamra Jal as prescribed in ancient Ayurvedic scriptures. Naturally ionizes and purifies drinking water, aids digestion, and promotes antioxidant health.",
      price: 999,
      compareAtPrice: 1799,
      discount: 44,
      stockQuantity: 50,
      isFeatured: false,
      isBestSeller: true,
      rating: 4.6,
      reviewCount: 89,
      tags: JSON.stringify(["copper", "water-bottle", "ayurveda", "health"]),
      sizes: JSON.stringify(["1000ml"]),
      colors: JSON.stringify(["Natural Hammered Copper"]),
      specifications: JSON.stringify({
        "Material": "100% Certified Food Grade Copper",
        "Capacity": "1000 ml",
        "Benefits": "Natural antimicrobial water ionization"
      }),
      images: [
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },
    {
      name: "Organic Neem Wood Hair Detangling Comb Set",
      slug: "organic-neem-wood-comb-set",
      sku: "BTY-CMB-029",
      brand: "Botanica Roots",
      categoryId: catBeauty.id,
      subcategory: "Haircare",
      shortDescription: "Pack of 3 hand-carved medicinal neem combs for anti-dandruff and anti-frizz care.",
      description: "Gentle on the scalp and static-free. Crafted from naturally seasoned medicinal Indian neem wood, these wide-toothed combs stimulate circulation and reduce hair breakage while untangling knots effortlessly.",
      price: 399,
      compareAtPrice: 699,
      discount: 43,
      stockQuantity: 120,
      isFeatured: false,
      isBestSeller: true,
      rating: 4.7,
      reviewCount: 140,
      tags: JSON.stringify(["neem-wood", "comb", "anti-dandruff", "natural"]),
      sizes: JSON.stringify(["Pack of 3"]),
      colors: JSON.stringify([]),
      specifications: JSON.stringify({
        "Wood": "100% Seasoned Azadirachta Indica (Neem)",
        "Includes": "Wide Tooth Comb, Handle Comb, Tail Comb"
      }),
      images: [
        "https://images.unsplash.com/photo-1590159763121-7c9ff3149e0a?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },
    {
      name: "Hand-Knotted Jute Floor Area Rug 4x6 Ft",
      slug: "hand-knotted-jute-floor-area-rug",
      sku: "HOME-RUG-030",
      brand: "Bhadohi Weavers",
      categoryId: catHomeLiving.id,
      subcategory: "Rugs",
      shortDescription: "100% natural braided eco-friendly golden jute reversible area carpet.",
      description: "Add rustic warmth and tactile texture to your living room or study. Hand-braided by traditional carpet artisans using biodegradable sustainable golden jute fibers.",
      price: 3299,
      compareAtPrice: 5999,
      discount: 45,
      stockQuantity: 16,
      isFeatured: true,
      isBestSeller: false,
      rating: 4.8,
      reviewCount: 37,
      tags: JSON.stringify(["jute", "rug", "carpet", "eco-friendly", "boho"]),
      sizes: JSON.stringify(["4x6 Feet", "5x8 Feet"]),
      colors: JSON.stringify(["Natural Golden"]),
      specifications: JSON.stringify({
        "Fiber": "100% Golden Organic Jute",
        "Weave": "Reversible Flat Braid",
        "Origin": "Bhadohi, Uttar Pradesh"
      }),
      images: [
        "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },
    {
      name: "Handmade Scented Soy Wax Pillar Candles (Set of 4)",
      slug: "handmade-scented-soy-wax-pillar-candles",
      sku: "HOME-CND-031",
      brand: "AuraAroma",
      categoryId: catHomeLiving.id,
      subcategory: "Candles",
      shortDescription: "Sandalwood, Jasmine, Lavender and Vanilla bean infused smokeless clean burning candles.",
      description: "Hand-poured using pure organic soy wax and natural therapeutic essential oils. Creates an inviting, soothing sanctuary in any room with over 30 hours of soot-free burn per pillar candle.",
      price: 899,
      compareAtPrice: 1499,
      discount: 40,
      stockQuantity: 45,
      isFeatured: false,
      isBestSeller: false,
      rating: 4.5,
      reviewCount: 41,
      tags: JSON.stringify(["candles", "soy-wax", "aromatherapy", "gifting"]),
      sizes: JSON.stringify(["Set of 4"]),
      colors: JSON.stringify([]),
      specifications: JSON.stringify({
        "Wax": "100% Hydrogenated Natural Soy Wax",
        "Burn Time": "30 hours per candle (120h total)",
        "Wick": "Lead-free unbleached cotton"
      }),
      images: [
        "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    },
    {
      name: "Smart Wi-Fi RGB Ambient Floor Lamp",
      slug: "smart-wifi-rgb-ambient-floor-lamp",
      sku: "HOME-LMP-032",
      brand: "VisionPlus",
      categoryId: catHomeLiving.id,
      subcategory: "Lighting",
      shortDescription: "16 million colors corner standing light with Alexa & Google Assistant sync.",
      description: "Sleek minimalist Nordic corner floor lamp that casts vibrant ambient gradients against walls. Syncs dynamically with music rhythm and games with intuitive smartphone and voice control.",
      price: 2799,
      compareAtPrice: 4999,
      discount: 44,
      stockQuantity: 20,
      isFeatured: false,
      isBestSeller: true,
      rating: 4.7,
      reviewCount: 56,
      tags: JSON.stringify(["lamp", "smart-home", "rgb", "lighting"]),
      sizes: JSON.stringify(["140cm Height"]),
      colors: JSON.stringify(["Matte Black"]),
      specifications: JSON.stringify({
        "Height": "140 cm",
        "Connectivity": "Wi-Fi 2.4GHz + Bluetooth BLE",
        "Music Mode": "Built-in mic rhythm reactive lighting"
      }),
      images: [
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80"
      ],
      variants: []
    }
  ];

  console.log(`📦 Seeding ${productsData.length} products...`);

  for (const item of productsData) {
    const { images, variants, ...prodFields } = item;

    const createdProduct = await prisma.product.create({
      data: {
        ...prodFields,
        images: {
          create: images.map((url, index) => ({
            url,
            alt: `${item.name} image ${index + 1}`,
            order: index,
          })),
        },
        variants: {
          create: variants.map((v: { sku: string; name: string; size?: string; color?: string; price?: number; stockQuantity: number }) => ({
            sku: v.sku,
            name: v.name,
            size: v.size || null,
            color: v.color || null,
            price: v.price || item.price,
            stockQuantity: v.stockQuantity,
          })),
        },
      },
    });

    // Add realistic reviews for featured & bestseller items
    if (item.rating >= 4.7) {
      await prisma.review.create({
        data: {
          userId: customer1.id,
          productId: createdProduct.id,
          rating: 5,
          title: "Exceptional quality and genuine craft!",
          comment: `Ordered this last week and was blown away by the packaging and build. Exactly as described, 100% recommended!`,
          isVerifiedPurchase: true,
          status: "APPROVED",
        },
      });

      await prisma.review.create({
        data: {
          userId: customer2.id,
          productId: createdProduct.id,
          rating: 5,
          title: "Premium finish, arrived in 2 days",
          comment: `The finish is so high-end! ShopSphere customer care also kept me updated via WhatsApp and SMS throughout delivery.`,
          isVerifiedPurchase: true,
          status: "APPROVED",
        },
      });
    }
  }

  // 4. Create Coupons
  const coupons = [
    {
      code: "WELCOME10",
      description: "Flat 10% off for first time ShopSphere customers",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 499,
      maxDiscount: 500,
      usageLimit: 10000,
      isActive: true,
    },
    {
      code: "FESTIVE25",
      description: "Festive Season special 25% off on orders above ₹1,999",
      discountType: "PERCENTAGE",
      discountValue: 25,
      minOrderValue: 1999,
      maxDiscount: 1500,
      usageLimit: 5000,
      isActive: true,
    },
    {
      code: "FLAT500",
      description: "Flat ₹500 instant discount on orders above ₹2,499",
      discountType: "FIXED",
      discountValue: 500,
      minOrderValue: 2499,
      maxDiscount: null,
      usageLimit: 1000,
      isActive: true,
    },
    {
      code: "FREESHIP",
      description: "Free shipping voucher across India",
      discountType: "FIXED",
      discountValue: 99,
      minOrderValue: 0,
      maxDiscount: null,
      usageLimit: 50000,
      isActive: true,
    },
  ];

  for (const c of coupons) {
    await prisma.coupon.create({ data: c });
  }

  console.log("🎟️ Created active coupons: WELCOME10, FESTIVE25, FLAT500, FREESHIP.");

  // 5. Seed a Sample Order for Customer 1 to demonstrate order history, tracking & admin views
  const sampleProduct = await prisma.product.findFirst({
    where: { slug: "sonicpro-wireless-anc-headphones" },
    include: { images: true },
  });

  if (sampleProduct) {
    const orderNumber = "SS-2026-89412";
    const sampleOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: customer1.id,
        customerName: customer1.name,
        customerEmail: customer1.email,
        customerPhone: customer1.phone || "+91 98111 22334",
        subtotal: 4999,
        discount: 499.9,
        couponCode: "WELCOME10",
        tax: 809.84, // 18% GST
        shipping: 0,
        total: 5308.94,
        paymentStatus: "PAID",
        paymentMethod: "RAZORPAY",
        razorpayOrderId: "order_mock_seed_101",
        razorpayPaymentId: "pay_mock_seed_202",
        razorpaySignature: "mock_sig_valid_seed_303",
        orderStatus: "PROCESSING",
        shippingAddress: JSON.stringify({
          name: "Aarav Sharma",
          phone: "+91 98111 22334",
          street: "42, Shanti Niketan, Ring Road",
          apartment: "Flat 302, Tower B",
          city: "New Delhi",
          state: "Delhi",
          postalCode: "110021",
          country: "India",
        }),
        billingAddress: JSON.stringify({
          name: "Aarav Sharma",
          phone: "+91 98111 22334",
          street: "42, Shanti Niketan, Ring Road",
          apartment: "Flat 302, Tower B",
          city: "New Delhi",
          state: "Delhi",
          postalCode: "110021",
          country: "India",
        }),
        notes: "Please call on arrival",
        trackingNumber: "DELHIVERY-AWB-998241",
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        items: {
          create: [
            {
              productId: sampleProduct.id,
              productName: sampleProduct.name,
              productImage: sampleProduct.images[0]?.url,
              sku: sampleProduct.sku,
              quantity: 1,
              price: sampleProduct.price,
              total: sampleProduct.price,
            },
          ],
        },
        payments: {
          create: [
            {
              amount: 5308.94,
              currency: "INR",
              status: "SUCCESS",
              method: "RAZORPAY",
              razorpayOrderId: "order_mock_seed_101",
              razorpayPaymentId: "pay_mock_seed_202",
              razorpaySignature: "mock_sig_valid_seed_303",
            },
          ],
        },
      },
    });

    console.log(`📦 Seeded sample order ${sampleOrder.orderNumber} for Aarav`);
  }

  console.log("✨ Seed successfully completed!");
  console.log("-----------------------------------------");
  console.log("Admin Credentials:");
  console.log(`Email:    ${admin.email}`);
  console.log(`Password: ${process.env.ADMIN_PASSWORD || "Admin@ShopSphere2026"}`);
  console.log("Customer Credentials:");
  console.log(`Email:    aarav.sharma@example.com`);
  console.log(`Password: Password@123`);
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
