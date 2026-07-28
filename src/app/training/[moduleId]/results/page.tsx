export default async function ResultsPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8">
        <h1 className="mb-6 text-3xl font-bold">Results for Module: {moduleId}</h1>
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-gray-500">Results will be displayed here after completing a training session.</p>
        </div>
      </div>
    </div>
  );
}
