import Sidebar from "@/components/Sidebar";
import { requireAuth } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return (
    <div className="min-h-screen bg-slate-900 text-white relative">
      <Sidebar />
      <main className="md:ml-56 pt-14 md:pt-0 min-h-screen">
        <div className="max-w-[80rem] mx-auto p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 relative min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
