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
          <div className="card text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-purple"></div>
            <p className="mt-4 text-gray-400">Loading learner profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!learner) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <p className="text-gray-400">Learner not found</p>
          </div>
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
              className="text-accent-purple hover:text-purple-400 text-sm inline-flex items-center gap-2"
            >
              <span>←</span> Back to Talent Explorer
            </Link>
          </div>

          <div className="card mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-accent-purple flex items-center justify-center text-white text-2xl font-bold">
                {learner.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{learner.name}</h1>
                <p className="text-gray-400 mb-2">{learner.email}</p>
                {learner.headline && (
                  <p className="text-lg text-gray-300">{learner.headline}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-400 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {learner.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm bg-accent-blue/20 text-accent-blue rounded-full border border-accent-blue/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-dark-hover rounded-lg border border-dark-border">
                <div className="text-3xl font-bold text-white mb-1">
                  {learner.totalTasksClaimed}
                </div>
                <div className="text-sm text-gray-400">Tasks Claimed</div>
              </div>
              <div className="text-center p-4 bg-dark-hover rounded-lg border border-dark-border">
                <div className="text-3xl font-bold text-white mb-1">
                  {learner.totalTasksSubmitted}
                </div>
                <div className="text-sm text-gray-400">Tasks Submitted</div>
              </div>
              <div className="text-center p-4 bg-accent-green/10 rounded-lg border border-accent-green/30">
                <div className="text-3xl font-bold text-accent-green mb-1">
                  {learner.totalTasksAccepted}
                </div>
                <div className="text-sm text-gray-400">Tasks Accepted</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold text-white mb-6">Accepted Tasks</h2>
            {learner.taskClaims && learner.taskClaims.length > 0 ? (
              <div className="space-y-4">
                {learner.taskClaims.map((claim: any) => (
                  <div
                    key={claim.id}
                    className="card border-dark-border hover:border-accent-purple/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {claim.task.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Project: {claim.task.project.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {claim.githubPullRequestUrl && (
                        <a
                          href={claim.githubPullRequestUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-dark-hover text-gray-300 rounded-lg hover:bg-dark-border transition-colors text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          View Code (PR)
                        </a>
                      )}
                      {claim.task?.project?.featured && (
                        <Link
                          to={`/apps/${claim.task.project.slug}`}
                          className="inline-flex items-center px-4 py-2 bg-accent-purple/20 text-accent-purple rounded-lg hover:bg-accent-purple/30 transition-colors text-sm font-medium border border-accent-purple/30"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          className="inline-flex items-center px-4 py-2 bg-accent-green/20 text-accent-green rounded-lg hover:bg-accent-green/30 transition-colors text-sm font-medium border border-accent-green/30"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View Live App
                        </a>
                      )}
                    </div>
                    {claim.reviewNotes && (
                      <div className="mt-4 p-3 bg-dark-hover rounded-lg border border-dark-border text-sm text-gray-300">
                        <strong className="text-white">Review Notes:</strong> {claim.reviewNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">No accepted tasks yet.</div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
