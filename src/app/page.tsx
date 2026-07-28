import Link from 'next/link';

const features = [
  { title: 'Training Modules', description: '7 progressive lessons from basics to clinical decision making', href: '/training', icon: '🦷' },
  { title: 'Clinical Cases', description: 'Real-world scenarios with pathology identification', href: '/cases', icon: '📋' },
  { title: 'Assessments', description: 'Timed quizzes and practical evaluations', href: '/assessment', icon: '📝' },
  { title: 'Analytics', description: 'Track your progress and skill development', href: '/analytics', icon: '📈' },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦷</span>
            <span className="text-lg font-bold">VetTech Dental Prober</span>
          </div>
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900">
            Master Veterinary Dental Probing
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Interactive 3D simulation for veterinary technicians. Practice periodontal probing
            with realistic physics, adaptive difficulty, and comprehensive analytics.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/training"
              className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow hover:bg-blue-700"
            >
              Start Training
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              View Dashboard
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 text-3xl">{feature.icon}</div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-400">
        VetTech Dental Probing Trainer v0.1.0 — Built for veterinary education
      </footer>
    </div>
  );
}
