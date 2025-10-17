import Sidebar from "@/components/ui/sidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-6xl rounded-xl overflow-hidden border border-sidebar-border bg-card/5 flex">
        {/* Left: sidebar (fixed width) */}
        <div className="w-72">
          <Sidebar />
        </div>
        <h1>DASHBOARD</h1>
        <div className="flex-1 p-6">
        <h1>Overview</h1>
        </div>
      </div>
    </div>
  )
}