export default async function AssessmentDetailPage({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8">
        <h1 className="mb-6 text-3xl font-bold">Assessment: {assessmentId}</h1>
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-gray-500">Assessment flow will be built in Phase 3.</p>
        </div>
      </div>
    </div>
  );
}
