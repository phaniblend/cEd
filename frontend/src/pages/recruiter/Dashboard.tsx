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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Talent Explorer 🔍
            </h1>
            <p className="text-gray-400">Discover talented developers and their contributions</p>
          </div>

          {/* Filters */}
          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-2">
                  Filter by Skills (comma-separated)
                </label>
                <input
                  id="skills"
                  type="text"
                  value={skillsFilter}
                  onChange={(e) => setSkillsFilter(e.target.value)}
                  placeholder="React, Node.js, TypeScript"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label htmlFor="minAccepted" className="block text-sm font-medium text-gray-300 mb-2">
                  Minimum Accepted Tasks
                </label>
                <input
                  id="minAccepted"
                  type="number"
                  value={minAccepted}
                  onChange={(e) => setMinAccepted(e.target.value)}
                  min="0"
                  className="input-field w-full"
                />
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          {!isLoading && learners.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="card bg-gradient-to-br from-accent-green/20 to-accent-green/5 border-accent-green/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Learners</p>
                    <p className="text-3xl font-bold text-white">{learners.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent-green/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 border-accent-blue/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Accepted Tasks</p>
                    <p className="text-3xl font-bold text-white">
                      {learners.reduce((sum, l) => sum + l.totalTasksAccepted, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent-blue/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-accent-purple/20 to-accent-purple/5 border-accent-purple/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Avg. Accepted per Learner</p>
                    <p className="text-3xl font-bold text-white">
                      {learners.length > 0
                        ? Math.round(
                            learners.reduce((sum, l) => sum + l.totalTasksAccepted, 0) / learners.length
                          )
                        : 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent-purple/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Learners Table */}
          {isLoading ? (
            <div className="card text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-purple"></div>
              <p className="mt-4 text-gray-400">Loading learners...</p>
            </div>
          ) : learners.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-400 mb-4">No learners found matching your criteria.</p>
              <p className="text-sm text-gray-500">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="card overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-dark-border">
                  <thead className="bg-dark-hover">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Headline
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Skills
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Claimed
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Accepted
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-dark-card divide-y divide-dark-border">
                    {learners.map((learner) => (
                      <tr key={learner.id} className="hover:bg-dark-hover transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{learner.name}</div>
                          <div className="text-sm text-gray-400">{learner.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-300">{learner.headline || '-'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {learner.skills.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 text-xs bg-accent-blue/20 text-accent-blue rounded border border-accent-blue/30"
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {learner.totalTasksClaimed}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {learner.totalTasksSubmitted}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-accent-green">
                            {learner.totalTasksAccepted}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/recruiter/learners/${learner.id}`}
                            className="text-accent-purple hover:text-purple-400 transition-colors"
                          >
                            View Profile →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
