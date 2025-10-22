export default function AbsenPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Kehadiran & Aktivitas</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Status Kehadiran</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Status Hari Ini</label>
                <p className="mt-1 text-green-600 dark:text-green-400">Hadir</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Jam Masuk</label>
                <p className="mt-1 dark:text-gray-200">08:00 WIB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}