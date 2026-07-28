import { ModuleList } from '@/components/training';

export default function TrainingPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8">
        <h1 className="mb-2 text-3xl font-bold">Training Modules</h1>
        <p className="mb-8 text-gray-500">
          4 progressive modules from basics to clinical decision making
        </p>
        <ModuleList />
      </div>
    </div>
  );
}
