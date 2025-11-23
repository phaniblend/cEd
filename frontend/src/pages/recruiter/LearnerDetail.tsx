import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { recruiterApi } from '../../api/recruiter';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { UserRole } from '../../types';

export default function LearnerDetail() {
  const { learnerId } = useParams<{ learnerId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['learner', learnerId],
    queryFn: () => recruiterApi.getLearnerDetails(learnerId!),
    enabled: !!learnerId,
  });

  const learner = data?.learner;

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading learner profile...</div>
        </div>
      </Layout>
    );
  }

  if (!learner) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Learner not found</div>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.RECRUITER, UserRole.ADMIN]}>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              to="/recruiter/dashboard"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              ← Back to Talent Explorer
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{learner.name}</h1>
            <p className="text-gray-600 mb-4">{learner.email}</p>
            {learner.headline && (
              <p className="text-lg text-gray-700 mb-4">{learner.headline}</p>
            )}

            <div className="mb-4">
              <h2 className="text-sm font-medium text-gray-700 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {learner.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <div className="text-2xl font-bold text-gray-900">
                  {learner.totalTasksClaimed}
                </div>
                <div className="text-sm text-gray-600">Tasks Claimed</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <div className="text-2xl font-bold text-gray-900">
                  {learner.totalTasksSubmitted}
                </div>
                <div className="text-sm text-gray-600">Tasks Submitted</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-md">
                <div className="text-2xl font-bold text-green-600">
                  {learner.totalTasksAccepted}
                </div>
                <div className="text-sm text-gray-600">Tasks Accepted</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Accepted Tasks</h2>
            {learner.taskClaims && learner.taskClaims.length > 0 ? (
              <div className="space-y-4">
                {learner.taskClaims.map((claim: any) => (
                  <div
                    key={claim.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {claim.task.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Project: {claim.task.project.title}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {claim.githubPullRequestUrl && (
                        <a
                          href={claim.githubPullRequestUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          View Code (PR)
                        </a>
                      )}
                      {claim.task?.project?.slug && (
                        <Link
                          to={`/apps/${claim.task.project.slug}`}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          View in App Store
                        </Link>
                      )}
                      {claim.task?.project?.liveAppUrl && (
                        <a
                          href={claim.task.project.liveAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View Live App
                        </a>
                      )}
                    </div>
                    {claim.reviewNotes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                        <strong>Review Notes:</strong> {claim.reviewNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No accepted tasks yet.</div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

