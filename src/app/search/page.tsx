import { redirect } from "next/navigation";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolved = await searchParams;
  const q = resolved.q;

  if (q) {
    redirect(`/products?q=${encodeURIComponent(String(q))}`);
  }

  redirect("/products");
}
