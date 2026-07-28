export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8">
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Sessions</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
            <p className="mt-1 text-xs text-gray-400">Start a training session to begin</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">--</p>
            <p className="mt-1 text-xs text-gray-400">Complete assessments to see score</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Skills Mastered</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">0 / 7</p>
            <p className="mt-1 text-xs text-gray-400">Complete modules to master skills</p>
          </div>
        </div>
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
          <p className="text-sm text-gray-500">No activity yet. Start a training session!</p>
        </div>
      </div>
    </div>
  );
}
