export default function EmployeeDirectoryPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Employee Directory</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Direktori Karyawan</h2>
            <p className="text-gray-600 dark:text-gray-400">Cari dan lihat informasi karyawan.</p>
          </div>
          
          <div className="mt-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Cari karyawan..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Placeholder untuk daftar karyawan */}
              <div className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow dark:hover:bg-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div>
                    <p className="font-semibold dark:text-white">Nama Karyawan</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Jabatan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
