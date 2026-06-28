import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { ClientForm } from "@/components/admin/ClientForm";
import { Card, CardContent } from "@/components/ui/card";

export default function NewClientPage() {
  return (
    <>
      <Link
        href="/admin/leads"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-espresso"
      >
        <ArrowLeft className="size-4" /> Back to leads
      </Link>
      <PageHeader
        title="Add a client"
        description="Manually create a client record. They start as a lead."
      />
      <Card>
        <CardContent className="pt-6">
          <ClientForm />
        </CardContent>
      </Card>
    </>
  );
}
