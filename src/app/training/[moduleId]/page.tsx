import Link from 'next/link';

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8">
        <p className="mb-4 text-sm text-gray-500">
          <Link href="/training" className="hover:text-blue-600">Training</Link>
          {' / '}
          <span>Module</span>
        </p>
        <h1 className="mb-6 text-3xl font-bold">Module: {moduleId}</h1>
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-gray-500">3D training session will load here. Phase 1 build.</p>
        </div>
      </div>
    </div>
  );
}
