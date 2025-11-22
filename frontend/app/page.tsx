import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">UI UX Designs</h1>
          <p className="text-2xl mb-8 text-blue-100">Latest Trends</p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="bg-accent-orange hover:bg-accent-orange-dark text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg inline-block"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-white text-primary-blue px-8 py-3 rounded-lg font-semibold transition hover:bg-gray-100"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            ALM + SCM Platform
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-modern p-6">
              <div className="w-12 h-12 bg-primary-blue rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Repository Browser</h3>
              <p className="text-gray-600">Custom branded repository management with full Git capabilities</p>
            </div>
            <div className="card-modern p-6">
              <div className="w-12 h-12 bg-accent-orange rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Issue Tracker</h3>
              <p className="text-gray-600">Kanban boards, sprints, and story management</p>
            </div>
            <div className="card-modern p-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">PR Review</h3>
              <p className="text-gray-600">Code review with inline comments and diff viewer</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
