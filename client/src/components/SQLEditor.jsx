// client/src/components/SQLEditor.jsx
import React, { useState, useEffect } from 'react';
import { Play, Check, AlertCircle, Database, Clock } from 'lucide-react';
import { runLessonSqlQuery } from '../services/api'; // <--- UPDATED IMPORT

const SQLEditor = ({
  initialQuery = '',
  expectedResult = null,
  onQueryExecuted = () => {},
  height = '150px',
  lessonId // Need lessonId to send to backend for sandbox
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    // Reset state when lessonId changes (new lesson)
    setQuery(initialQuery);
    setResult(null);
    setError(null);
    setIsCorrect(null);
  }, [lessonId, initialQuery]);

  // Helper function to compare results (deep comparison for arrays of objects)
  const compareResults = (actual, expected) => {
    if (!Array.isArray(actual) || !Array.isArray(expected)) {
      return false; // Expecting arrays for comparison
    }
    if (actual.length !== expected.length) {
      return false;
    }

    // Sort by a consistent key if order doesn't matter, or normalize for comparison
    // For simplicity, we'll assume order matters or results are inherently ordered.
    // A robust comparison might sort both arrays by a primary key or common field.

    for (let i = 0; i < actual.length; i++) {
      const actualRow = actual[i];
      const expectedRow = expected[i];

      const actualKeys = Object.keys(actualRow).sort();
      const expectedKeys = Object.keys(expectedRow).sort();

      if (actualKeys.length !== expectedKeys.length || !actualKeys.every((key, index) => key === expectedKeys[index])) {
          return false; // Mismatched columns
      }

      for (const key of actualKeys) {
          if (actualRow[key] !== expectedRow[key]) {
              return false; // Mismatched value
          }
      }
    }
    return true;
  };

  // const executeQuery = async () => {
  //   if (!query.trim()) return;

  //   // setLoading(true);
  //   // setError(null);
  //   // setResult(null); // Clear previous result
  //   // setIsCorrect(null); // Clear correctness status
  //   setIsCorrect(true); // Always assume it's correct as long as no SQL error
  //   onQueryExecuted(true, actualResult);


  //   try {
  //     const response = await runLessonSqlQuery(query, lessonId); // Call backend API
  //     const actualResult = response.result;

  //     setResult(actualResult);

  //     if (expectedResult) {
  //       const correct = compareResults(actualResult, expectedResult);
  //       setIsCorrect(correct);
  //       onQueryExecuted(correct, actualResult); // Pass correctness to parent
  //     } else {
  //       // If no expected result (e.g., for DML operations), just show success
  //       setIsCorrect(true); // Assume correct if no comparison is needed
  //       onQueryExecuted(true, actualResult);
  //     }

  //   } catch (err) {
  //     const errorMessage = err.response && err.response.data && err.response.data.error
  //                        ? err.response.data.error
  //                        : 'Query execution failed. Please check your query syntax.';
  //     setError(errorMessage);
  //     setIsCorrect(false); // Indicate failure
  //     onQueryExecuted(false, null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const executeQuery = async () => {
  if (!query.trim()) return;

  setLoading(true);
  setError(null);
  setResult(null);
  setIsCorrect(null); // Clear previous state

  try {
    const response = await runLessonSqlQuery(query, lessonId); // Call backend API
    const actualResult = response.result;

    setResult(actualResult);
    setIsCorrect(true); // Always assume success if no error
    onQueryExecuted(true, actualResult); // Notify parent component

  } catch (err) {
    const errorMessage = err.response?.data?.error || 'Query execution failed. Please check your query syntax.';
    setError(errorMessage);
    setIsCorrect(false); // Indicate failure
    onQueryExecuted(false, null);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="border border-gray-600 bg-gray-800 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 border-b border-gray-600 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-300">SQL Practice</span>
        </div>
        <button
          onClick={executeQuery}
          disabled={loading || !query.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {loading ? 'Executing...' : 'Run Query'}
        </button>
      </div>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-4 bg-gray-900 text-gray-300 font-mono text-sm border-none outline-none resize-none placeholder-gray-500"
        style={{ height }}
        placeholder="-- Enter your SQL query here
SELECT * FROM employees;"
      />

      {error && (
        <div className="p-4 bg-red-900/50 border-t border-red-700 text-red-300">
          <p className="text-sm font-medium">Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className={`p-4 ${isCorrect ? 'bg-green-900/30 border-green-700' : 'bg-orange-900/30 border-orange-700'} border-t`}>
          <div className="flex items-center gap-2 mb-3">
            {isCorrect ? <Check className="w-4 h-4 text-green-400" /> : <AlertCircle className="w-4 h-4 text-orange-400" />}
            <p className="font-medium text-sm">
              Query executed successfully!
              {isCorrect !== null && (
                <span className={`ml-2 ${isCorrect ? 'text-green-400' : 'text-orange-400'}`}>
                  {isCorrect ? '✓ Perfect!' : '⚠ Check your result or syntax'}
                </span>
              )}
            </p>
          </div>

          {Array.isArray(result) && result.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className={`${isCorrect ? 'bg-green-800/30' : 'bg-orange-800/30'}`}>
                    {Object.keys(result[0]).map(key => (
                      <th key={key} className={`px-3 py-2 text-left font-medium ${isCorrect ? 'text-green-300' : 'text-orange-300'} border-b ${isCorrect ? 'border-green-700' : 'border-orange-700'}`}>
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className={`border-b ${isCorrect ? 'border-green-800/30' : 'border-orange-800/30'}`}>
                      {Object.values(row).map((value, i) => (
                        <td key={i} className={`px-3 py-2 ${isCorrect ? 'text-green-200' : 'text-orange-200'}`}>
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.length > 5 && (
                <p className={`text-xs mt-2 ${isCorrect ? 'text-green-400' : 'text-orange-400'}`}>... and {result.length - 5} more rows</p>
              )}
            </div>
          )}
           {!Array.isArray(result) && result && typeof result === 'object' && result.message && (
             <p className={`${isCorrect ? 'text-green-200' : 'text-orange-200'}`}>
                {result.message}
             </p>
           )}
        </div>
      )}
    </div>
  );
};

export default SQLEditor;