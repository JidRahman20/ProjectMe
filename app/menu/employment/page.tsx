export default function EmploymentPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employment Data</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Employment Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Status</label>
                <p className="mt-1">Active Student</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Faculty</label>
                <p className="mt-1">Computer Science</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}