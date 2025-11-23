import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function Landing() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Stop stacking courses.
            <br />
            <span className="text-accent-purple">Start shipping code.</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
            Get real-world project experience by contributing to curated GitHub projects.
            Build a verifiable portfolio that recruiters trust.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/auth/register" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/projects" className="btn-secondary text-lg px-8 py-3">
              Browse Projects
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mt-16">
          <div className="card bg-gradient-to-br from-accent-green/20 to-accent-green/5 border-accent-green/30">
            <div className="w-12 h-12 rounded-full bg-accent-green/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">For Learners</h3>
            <p className="text-gray-400 mb-4">
              Work on real projects, build your portfolio, and get guidance from mentors.
            </p>
            <Link
              to="/auth/register"
              className="text-accent-green hover:text-green-400 font-medium inline-flex items-center gap-2"
            >
              Get Started <span>→</span>
            </Link>
          </div>

          <div className="card bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 border-accent-blue/30">
            <div className="w-12 h-12 rounded-full bg-accent-blue/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">For Recruiters</h3>
            <p className="text-gray-400 mb-4">
              Find talented developers with proven track records and real contributions.
            </p>
            <Link
              to="/auth/register"
              className="text-accent-blue hover:text-blue-400 font-medium inline-flex items-center gap-2"
            >
              Explore Talent <span>→</span>
            </Link>
          </div>

          <div className="card bg-gradient-to-br from-accent-purple/20 to-accent-purple/5 border-accent-purple/30">
            <div className="w-12 h-12 rounded-full bg-accent-purple/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">For Buyers</h3>
            <p className="text-gray-400 mb-4">
              Browse affordable, open-source apps built by our community of learners.
            </p>
            <Link
              to="/apps"
              className="text-accent-purple hover:text-purple-400 font-medium inline-flex items-center gap-2"
            >
              Browse Apps <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
