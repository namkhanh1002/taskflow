import type { Metadata } from "next";
import { requireUser } from "@/lib/guards";
import { getCategories } from "@/lib/data/categories";
import { CategoryManager } from "@/components/categories/category-manager";

export const metadata: Metadata = {
  title: "Danh mục",
};

export default async function CategoriesPage() {
  const session = await requireUser();
  const categories = await getCategories(session.userId);

  return <CategoryManager categories={categories} />;
}
