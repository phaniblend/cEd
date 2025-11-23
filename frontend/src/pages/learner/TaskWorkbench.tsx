import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tasksApi } from '../../api/tasks';
import { taskClaimsApi } from '../../api/taskClaims';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { UserRole, TaskClaimStatus } from '../../types';
import { useState } from 'react';

export default function TaskWorkbench() {
  const { taskId } = useParams<{ taskId: string }>();
  const [prUrl, setPrUrl] = useState('');
  const [helpQuestion, setHelpQuestion] = useState('');
  const [showHelpResponse, setShowHelpResponse] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: taskData, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => tasksApi.getById(taskId!),
    enabled: !!taskId,
  });

  const task = taskData?.task;
  const project = task?.project;
  const existingClaim = task?.taskClaims?.find(
    (claim) => claim.status !== TaskClaimStatus.REJECTED
  );

  const submitMutation = useMutation({
    mutationFn: (url: string) => taskClaimsApi.submitClaim(existingClaim!.id, { githubPullRequestUrl: url }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      alert('PR submitted successfully!');
    },
  });

  const claimMutation = useMutation({
    mutationFn: () => taskClaimsApi.claimTask(taskId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      alert('Task claimed successfully!');
    },
  });

  const handleSubmitPR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prUrl.trim()) {
      alert('Please enter a PR URL');
      return;
    }
    submitMutation.mutate(prUrl);
  };

  const handleAskHelp = (e: React.FormEvent) => {
    e.preventDefault();
    setShowHelpResponse(true);
    setTimeout(() => {
      setShowHelpResponse(false);
      alert('AI Help: This is a placeholder response. In a real implementation, this would connect to an AI service.');
    }, 1000);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-purple"></div>
            <p className="mt-4 text-gray-400">Loading task...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!task || !project) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <p className="text-gray-400">Task not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  const githubRepoUrl = `https://github.com/${project.githubOrg}/${project.githubRepo}`;
  const githubIssueUrl = task.githubIssueNumber
    ? `${githubRepoUrl}/issues/${task.githubIssueNumber}`
    : null;

  return (
    <ProtectedRoute allowedRoles={[UserRole.LEARNER]}>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              to={`/learner/projects/${project.id}`}
              className="text-accent-purple hover:text-purple-400 text-sm inline-flex items-center gap-2"
            >
              <span>←</span> Back to Project
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="card mb-6">
                <h1 className="text-3xl font-bold text-white mb-4">{task.title}</h1>
                <p className="text-gray-400 mb-6 leading-relaxed">{task.description}</p>

                <div className="mb-6 p-4 bg-dark-hover rounded-lg border border-dark-border">
                  <h2 className="text-lg font-semibold text-white mb-3">How to work on this task</h2>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>
                      <strong className="text-white">Repository:</strong>{' '}
                      <a
                        href={githubRepoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-blue hover:text-blue-400"
                      >
                        {project.githubOrg}/{project.githubRepo}
                      </a>
                    </p>
                    {githubIssueUrl && (
                      <p>
                        <strong className="text-white">Issue:</strong>{' '}
                        <a
                          href={githubIssueUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-blue hover:text-blue-400"
                        >
                          #{task.githubIssueNumber}
                        </a>
                      </p>
                    )}
                    <p>
                      <strong className="text-white">Difficulty:</strong> {task.difficulty}
                    </p>
                  </div>
                </div>

                {!existingClaim ? (
                  <div>
                    <button
                      onClick={() => claimMutation.mutate()}
                      disabled={claimMutation.isPending}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {claimMutation.isPending ? 'Claiming...' : 'Start Task'}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 p-4 bg-dark-hover rounded-lg border border-dark-border">
                      <p className="text-sm text-gray-300 mb-2">
                        <strong className="text-white">Status:</strong>{' '}
                        <span className="text-accent-purple">{existingClaim.status}</span>
                      </p>
                      {existingClaim.githubPullRequestUrl && (
                        <p className="text-sm">
                          <strong className="text-white">PR:</strong>{' '}
                          <a
                            href={existingClaim.githubPullRequestUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-blue hover:text-blue-400 break-all"
                          >
                            {existingClaim.githubPullRequestUrl}
                          </a>
                        </p>
                      )}
                    </div>

                    {existingClaim.status === TaskClaimStatus.CLAIMED && (
                      <form onSubmit={handleSubmitPR} className="space-y-4">
                        <div>
                          <label htmlFor="pr-url" className="block text-sm font-medium text-gray-300 mb-2">
                            GitHub Pull Request URL
                          </label>
                          <input
                            id="pr-url"
                            type="url"
                            value={prUrl}
                            onChange={(e) => setPrUrl(e.target.value)}
                            placeholder="https://github.com/owner/repo/pull/123"
                            className="input-field w-full"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={submitMutation.isPending}
                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitMutation.isPending ? 'Submitting...' : 'Submit PR'}
                        </button>
                      </form>
                    )}

                    {existingClaim.status === TaskClaimStatus.SUBMITTED && (
                      <div className="p-4 bg-accent-orange/10 border border-accent-orange/30 rounded-lg">
                        <p className="text-sm text-accent-orange">
                          Your PR has been submitted and is awaiting review.
                        </p>
                      </div>
                    )}

                    {existingClaim.status === TaskClaimStatus.ACCEPTED && (
                      <div className="p-4 bg-accent-green/10 border border-accent-green/30 rounded-lg">
                        <p className="text-sm text-accent-green font-semibold mb-2">
                          🎉 Congratulations! Your PR has been accepted.
                        </p>
                        {existingClaim.reviewNotes && (
                          <p className="text-sm text-gray-300 mt-2">
                            <strong className="text-white">Review Notes:</strong> {existingClaim.reviewNotes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="card sticky top-4">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Need help?
                </h2>
                <form onSubmit={handleAskHelp} className="space-y-4">
                  <textarea
                    value={helpQuestion}
                    onChange={(e) => setHelpQuestion(e.target.value)}
                    placeholder="Ask a question about this task..."
                    rows={4}
                    className="input-field w-full resize-none"
                  />
                  <button
                    type="submit"
                    className="btn-primary w-full"
                  >
                    Ask AI Assistant
                  </button>
                </form>
                {showHelpResponse && (
                  <div className="mt-4 p-3 bg-accent-blue/10 border border-accent-blue/30 rounded-lg text-sm text-accent-blue">
                    Processing your question...
                  </div>
                )}
                <div className="mt-4 text-xs text-gray-500">
                  <p>This is a placeholder AI assistant. In production, this would connect to an AI service to provide helpful guidance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
