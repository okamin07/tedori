import { Sidebar, MobileTopBar } from "@/components/Sidebar";
import { SimulatorProvider } from "@/lib/simulator-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SimulatorProvider>
      <div className="flex min-h-screen bg-bg">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileTopBar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SimulatorProvider>
  );
}
