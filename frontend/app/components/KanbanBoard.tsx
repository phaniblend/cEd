'use client';

import { useState } from 'react';

interface Issue {
  id: number;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'closed';
  assignee?: string;
}

interface KanbanBoardProps {
  issues: Issue[];
  onIssueUpdate?: (issueId: number, newStatus: string) => void;
}

export default function KanbanBoard({ issues, onIssueUpdate }: KanbanBoardProps) {
  const [draggedIssue, setDraggedIssue] = useState<Issue | null>(null);

  const columns = [
    { id: 'open', title: 'Open', color: 'bg-green-50 border-green-200' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-blue-50 border-blue-200' },
    { id: 'closed', title: 'Closed', color: 'bg-gray-50 border-gray-200' },
  ];

  const handleDragStart = (issue: Issue) => {
    setDraggedIssue(issue);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: string) => {
    if (draggedIssue && onIssueUpdate) {
      onIssueUpdate(draggedIssue.id, status);
    }
    setDraggedIssue(null);
  };

  const getIssuesByStatus = (status: string) => {
    return issues.filter((issue) => issue.status === status);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className={`${column.color} border-2 rounded-lg p-4 min-h-[400px]`}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(column.id)}
        >
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center justify-between">
            <span>{column.title}</span>
            <span className="bg-white px-2 py-1 rounded-full text-sm">
              {getIssuesByStatus(column.id).length}
            </span>
          </h3>
          <div className="space-y-3">
            {getIssuesByStatus(column.id).map((issue) => (
              <div
                key={issue.id}
                draggable
                onDragStart={() => handleDragStart(issue)}
                className="bg-white rounded-lg p-4 shadow-sm cursor-move hover:shadow-md transition"
              >
                <h4 className="font-medium text-gray-800 mb-2">{issue.title}</h4>
                {issue.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{issue.description}</p>
                )}
                {issue.assignee && (
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="w-5 h-5 bg-accent-orange rounded-full flex items-center justify-center text-white text-xs mr-2">
                      {issue.assignee.charAt(0)}
                    </div>
                    {issue.assignee}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

