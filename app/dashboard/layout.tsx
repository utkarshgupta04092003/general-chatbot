import Sidebar from "@/components/Sidebar";
import { UsageProvider } from "@/components/providers/usage-provider";
import { requireAuth } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="md:ml-56 pt-14 md:pt-0 min-h-screen">
        <div className="max-w-[76rem] mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8 min-w-0">
          <UsageProvider>{children}</UsageProvider>
        </div>
      </main>
    </div>
  );
}
