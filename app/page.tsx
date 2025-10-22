import Sidebar from "@/components/ui/sidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex">
        {/* Left: sidebar (fixed width) */}
        <div className="w-72">
          <Sidebar />
        </div>
        <h1 className="dark:text-white">DASHBOARD</h1>
        <div className="flex-1 p-6">
        <h1 className="dark:text-white">Overview</h1>
        </div>
      </div>
    </div>
  )
}