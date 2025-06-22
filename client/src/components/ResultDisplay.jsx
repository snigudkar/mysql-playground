import React from 'react';

const ResultDisplay = ({ results, error }) => {
  if (error) {
    return (
      <div className="bg-red-800 p-4 rounded-lg text-red-100 mb-4 whitespace-pre-wrap font-mono">
        <strong className="block text-lg mb-2">Error:</strong>
        {error}
      </div>
    );
  }

  if (!results) {
    return <p className="text-gray-400 text-center text-lg mt-4">Execute a query to see results here.</p>;
  }

  // Handle results for DML operations (INSERT, UPDATE, DELETE)
  // better-sqlite3 returns an object like { changes: N, lastInsertRowid: M } for .run()
  if (typeof results === 'object' && results !== null && ('changes' in results || 'lastInsertRowid' in results)) {
    return (
      <div className="bg-blue-800 p-4 rounded-lg text-blue-100 mb-4">
        <strong className="block text-lg mb-2">Query Executed Successfully!</strong>
        {results.changes !== undefined && (
          <p>Rows affected: <span className="font-bold">{results.changes}</span></p>
        )}
        {results.lastInsertRowid !== undefined && results.lastInsertRowid > 0 && (
          <p>Last inserted row ID: <span className="font-bold">{results.lastInsertRowid}</span></p>
        )}
      </div>
    );
  }

  // Handle results for SELECT queries (array of objects)
  if (Array.isArray(results) && results.length > 0) {
    const columns = Object.keys(results[0]);
    return (
      <div className="overflow-x-auto max-h-80 border border-gray-700 rounded-lg">
        <table className="min-w-full bg-gray-700 text-gray-200 text-sm">
          <thead className="bg-gray-600 text-gray-100 sticky top-0 z-10">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="px-4 py-2 border-b border-gray-500 text-left whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-2 border-b border-gray-600 whitespace-nowrap">
                    {String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // If results is an empty array (e.g., SELECT with no rows)
  if (Array.isArray(results) && results.length === 0) {
    return <p className="text-gray-400 text-center text-lg mt-4">Query executed successfully, but no rows returned.</p>;
  }

  // Fallback for unexpected results format
  return (
    <div className="bg-yellow-800 p-4 rounded-lg text-yellow-100 mb-4">
      <strong className="block text-lg mb-2">Unexpected Result Format:</strong>
      <pre className="font-mono text-sm">{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
};

export default ResultDisplay;
