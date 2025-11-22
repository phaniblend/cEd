'use client';

import { useState } from 'react';

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileNode[];
}

export default function RepositoryBrowser({ projectId }: { projectId: string }) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [files] = useState<FileNode[]>([
    {
      name: 'src',
      type: 'directory',
      path: 'src',
      children: [
        {
          name: 'components',
          type: 'directory',
          path: 'src/components',
          children: [
            { name: 'Header.tsx', type: 'file', path: 'src/components/Header.tsx' },
            { name: 'Footer.tsx', type: 'file', path: 'src/components/Footer.tsx' },
          ],
        },
        { name: 'App.tsx', type: 'file', path: 'src/App.tsx' },
        { name: 'index.tsx', type: 'file', path: 'src/index.tsx' },
      ],
    },
    { name: 'package.json', type: 'file', path: 'package.json' },
    { name: 'README.md', type: 'file', path: 'README.md' },
  ]);

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return (
      <div className={`${level > 0 ? 'ml-4' : ''}`}>
        {nodes.map((node) => (
          <div key={node.path}>
            <div
              className={`flex items-center py-1 px-2 hover:bg-gray-100 rounded cursor-pointer ${
                selectedFile === node.path ? 'bg-blue-50' : ''
              }`}
              onClick={() => node.type === 'file' && setSelectedFile(node.path)}
            >
              {node.type === 'directory' ? (
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              <span className="text-sm text-gray-700">{node.name}</span>
            </div>
            {node.children && renderFileTree(node.children, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      <div className="col-span-1 card-modern p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Files</h3>
          <select className="text-sm border border-gray-300 rounded px-2 py-1">
            <option>main</option>
            <option>develop</option>
          </select>
        </div>
        {renderFileTree(files)}
      </div>
      <div className="col-span-2 card-modern p-4">
        {selectedFile ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">{selectedFile}</h3>
              <button className="text-sm text-primary-blue hover:underline">View Raw</button>
            </div>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                <code>{`// File content for ${selectedFile}\n// This will be fetched from the Git service`}</code>
              </pre>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a file to view its contents</p>
          </div>
        )}
      </div>
    </div>
  );
}

