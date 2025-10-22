export default function ProfilePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Profile</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Nama</label>
                <p className="mt-1 dark:text-gray-200">humaniora</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">NIM</label>
                <p className="mt-1 dark:text-gray-200">000000</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                <p className="mt-1 dark:text-gray-200">humaniora@gmail.com</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
                <p className="mt-1 dark:text-gray-200">+62 000-1111-2222</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}