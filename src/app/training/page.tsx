import Link from 'next/link';

const modules = [
  { id: 'm1', title: 'Probe Orientation & Basic Identification', type: 'orientation', difficulty: 'beginner', lessons: 4, minutes: 30 },
  { id: 'm2', title: 'Tooth Numbering System', type: 'numbering', difficulty: 'beginner', lessons: 3, minutes: 25 },
  { id: 'm3', title: 'Basic Probing Technique', type: 'technique', difficulty: 'beginner', lessons: 5, minutes: 40 },
  { id: 'm4', title: 'Sulcus Depth Measurement', type: 'measurement', difficulty: 'intermediate', lessons: 4, minutes: 35 },
  { id: 'm5', title: 'Pathology Identification', type: 'pathology', difficulty: 'intermediate', lessons: 6, minutes: 45 },
  { id: 'm6', title: 'Charting & Documentation', type: 'charting', difficulty: 'advanced', lessons: 3, minutes: 30 },
  { id: 'm7', title: 'Clinical Decision Making', type: 'decision', difficulty: 'clinical', lessons: 5, minutes: 50 },
];

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-orange-100 text-orange-800',
  clinical: 'bg-red-100 text-red-800',
};

export default function TrainingPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8">
        <h1 className="mb-2 text-3xl font-bold">Training Modules</h1>
        <p className="mb-8 text-gray-500">7 progressive lessons from basics to clinical decision making</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <Link
              key={mod.id}
              href={`/training/${mod.id}`}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${difficultyColors[mod.difficulty as keyof typeof difficultyColors]}`}>
                  {mod.difficulty}
                </span>
                <span className="text-xs text-gray-400">{mod.minutes} min</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                {mod.title}
              </h3>
              <p className="text-sm text-gray-500">{mod.lessons} lessons</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
