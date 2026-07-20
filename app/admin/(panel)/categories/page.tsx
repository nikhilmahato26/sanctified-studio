import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export default async function CategoriesPage() {
  const categories = await prisma.eventCategory.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Event Categories</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the event categories that appear on the website and in the admin dashboard.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-medium mb-4">Add new category</h2>
          <form action={createCategory} className="flex gap-3">
            <Input name="name" placeholder="Category name..." required className="max-w-sm" />
            <Button type="submit">Add</Button>
          </form>
        </div>

        <div className="rounded-xl border bg-card p-0 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-muted-foreground">
                    No categories found. Add one above.
                  </td>
                </tr>
              )}
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">{cat.name}</td>
                  <td className="px-6 py-4 text-right">
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={cat.id} />
                      <Button variant="ghost" size="icon" type="submit" title="Delete category" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="size-4" />
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
