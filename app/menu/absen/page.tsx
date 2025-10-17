export default function AbsenPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kehadiran & Aktivitas</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Status Kehadiran</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Status Hari Ini</label>
                <p className="mt-1 text-green-600">Hadir</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Jam Masuk</label>
                <p className="mt-1">08:00 WIB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}