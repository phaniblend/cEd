import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { recruiterApi } from '../../api/recruiter';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { UserRole } from '../../types';

export default function RecruiterDashboard() {
  const [skillsFilter, setSkillsFilter] = useState('');
  const [minAccepted, setMinAccepted] = useState('0');

  const { data, isLoading } = useQuery({
    queryKey: ['learners', skillsFilter, minAccepted],
    queryFn: () =>
      recruiterApi.getLearners({
        skills: skillsFilter ? skillsFilter.split(',').map((s) => s.trim()) : undefined,
        minAccepted: parseInt(minAccepted, 10) || 0,
      }),
  });

  const learners = data?.learners || [];

  return (
    <ProtectedRoute allowedRoles={[UserRole.RECRUITER, UserRole.ADMIN]}>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Talent Explorer</h1>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Skills (comma-separated)
                </label>
                <input
                  id="skills"
                  type="text"
                  value={skillsFilter}
                  onChange={(e) => setSkillsFilter(e.target.value)}
                  placeholder="React, Node.js, TypeScript"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="minAccepted" className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Accepted Tasks
                </label>
                <input
                  id="minAccepted"
                  type="number"
                  value={minAccepted}
                  onChange={(e) => setMinAccepted(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading learners...</div>
          ) : learners.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No learners found matching your criteria.</div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Headline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasks Claimed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasks Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasks Accepted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {learners.map((learner) => (
                    <tr key={learner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{learner.name}</div>
                        <div className="text-sm text-gray-500">{learner.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{learner.headline || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {learner.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {learner.skills.length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-500">
                              +{learner.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {learner.totalTasksClaimed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {learner.totalTasksSubmitted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-semibold text-green-600">
                          {learner.totalTasksAccepted}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/recruiter/learners/${learner.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

