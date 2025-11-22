'use client';

interface DiffViewerProps {
  diff: string;
}

export default function DiffViewer({ diff }: DiffViewerProps) {
  const lines = diff.split('\n');

  return (
    <div className="card-modern p-4">
      <div className="bg-gray-900 text-gray-100 rounded-lg overflow-x-auto">
        <div className="p-4">
          {lines.map((line, index) => {
            const isAdded = line.startsWith('+') && !line.startsWith('+++');
            const isRemoved = line.startsWith('-') && !line.startsWith('---');
            const isHeader = line.startsWith('+++') || line.startsWith('---') || line.startsWith('@@');

            return (
              <div
                key={index}
                className={`font-mono text-sm ${
                  isAdded
                    ? 'bg-green-900 text-green-100'
                    : isRemoved
                    ? 'bg-red-900 text-red-100'
                    : isHeader
                    ? 'bg-blue-900 text-blue-100'
                    : 'text-gray-300'
                }`}
              >
                {line}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

