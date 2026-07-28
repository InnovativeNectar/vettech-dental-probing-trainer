import { TrainingSession } from '@/components/training';

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <TrainingSession moduleId={moduleId} />
      </div>
    </div>
  );
}
