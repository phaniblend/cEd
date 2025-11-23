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
    // Simulate AI response
    setTimeout(() => {
      setShowHelpResponse(false);
      alert('AI Help: This is a placeholder response. In a real implementation, this would connect to an AI service.');
    }, 1000);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading task...</div>
        </div>
      </Layout>
    );
  }

  if (!task || !project) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Task not found</div>
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
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              ← Back to Project
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{task.title}</h1>
                <p className="text-gray-600 mb-6">{task.description}</p>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">How to work on this task</h2>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Repository:</strong>{' '}
                      <a
                        href={githubRepoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {project.githubOrg}/{project.githubRepo}
                      </a>
                    </p>
                    {githubIssueUrl && (
                      <p>
                        <strong>Issue:</strong>{' '}
                        <a
                          href={githubIssueUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          #{task.githubIssueNumber}
                        </a>
                      </p>
                    )}
                    <p>
                      <strong>Difficulty:</strong> {task.difficulty}
                    </p>
                  </div>
                </div>

                {!existingClaim ? (
                  <div>
                    <button
                      onClick={() => claimMutation.mutate()}
                      disabled={claimMutation.isPending}
                      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {claimMutation.isPending ? 'Claiming...' : 'Start Task'}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 p-4 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Status:</strong> {existingClaim.status}
                      </p>
                      {existingClaim.githubPullRequestUrl && (
                        <p className="text-sm">
                          <strong>PR:</strong>{' '}
                          <a
                            href={existingClaim.githubPullRequestUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {existingClaim.githubPullRequestUrl}
                          </a>
                        </p>
                      )}
                    </div>

                    {existingClaim.status === TaskClaimStatus.CLAIMED && (
                      <form onSubmit={handleSubmitPR} className="space-y-4">
                        <div>
                          <label htmlFor="pr-url" className="block text-sm font-medium text-gray-700 mb-2">
                            GitHub Pull Request URL
                          </label>
                          <input
                            id="pr-url"
                            type="url"
                            value={prUrl}
                            onChange={(e) => setPrUrl(e.target.value)}
                            placeholder="https://github.com/owner/repo/pull/123"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={submitMutation.isPending}
                          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                          {submitMutation.isPending ? 'Submitting...' : 'Submit PR'}
                        </button>
                      </form>
                    )}

                    {existingClaim.status === TaskClaimStatus.SUBMITTED && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                          Your PR has been submitted and is awaiting review.
                        </p>
                      </div>
                    )}

                    {existingClaim.status === TaskClaimStatus.ACCEPTED && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-800">
                          Congratulations! Your PR has been accepted.
                        </p>
                        {existingClaim.reviewNotes && (
                          <p className="text-sm text-green-700 mt-2">
                            <strong>Review Notes:</strong> {existingClaim.reviewNotes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h2 className="text-lg font-semibold mb-4">Need help?</h2>
                <form onSubmit={handleAskHelp} className="space-y-4">
                  <textarea
                    value={helpQuestion}
                    onChange={(e) => setHelpQuestion(e.target.value)}
                    placeholder="Ask a question about this task..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Ask AI Assistant
                  </button>
                </form>
                {showHelpResponse && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
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

