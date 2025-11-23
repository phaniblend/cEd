import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function Landing() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Stop stacking courses.
            <br />
            <span className="text-blue-600">Start shipping code.</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Get real-world project experience by contributing to curated GitHub projects.
            Build a verifiable portfolio that recruiters trust.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">For Learners</h3>
            <p className="text-gray-600 mb-4">
              Work on real projects, build your portfolio, and get guidance from mentors.
            </p>
            <Link
              to="/auth/register"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">For Recruiters</h3>
            <p className="text-gray-600 mb-4">
              Find talented developers with proven track records and real contributions.
            </p>
            <Link
              to="/auth/register"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Explore Talent
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">For Buyers</h3>
            <p className="text-gray-600 mb-4">
              Browse affordable, open-source apps built by our community of learners.
            </p>
            <Link
              to="/apps"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Browse Apps
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

