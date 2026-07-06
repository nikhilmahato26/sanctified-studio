import { Nav } from "@/components/customer/Nav";
import { Footer } from "@/components/customer/Footer";
import { BrandSplash } from "@/components/customer/BrandSplash";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BrandSplash />
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
