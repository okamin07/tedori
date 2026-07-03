import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { SimulatorProvider } from "@/lib/simulator-context";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SimulatorProvider>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </SimulatorProvider>
  );
}
