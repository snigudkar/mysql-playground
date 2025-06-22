import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import ResultDisplay from './components/ResultDisplay';

// Backend server URL
const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM Customers;"); // Initial query
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [schema, setSchema] = useState({});
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [loadingQuery, setLoadingQuery] = useState(false);
  const editorRef = useRef(null); // Reference to the Monaco Editor instance

  // Fetch schema on component mount
  useEffect(() => {
    const fetchSchema = async () => {
      setLoadingSchema(true);
      try {
        const response = await fetch(`${API_BASE_URL}/schema`);
        const data = await response.json();
        if (data.success) {
          setSchema(data.schema);
        } else {
          console.error("Failed to fetch schema:", data.error);
          // Optionally, display schema error to user
        }
      } catch (error) {
        console.error("Error fetching schema:", error);
      } finally {
        setLoadingSchema(false);
      }
    };
    fetchSchema();
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    // You can set up custom commands, keybindings here if needed
  };

  const executeSqlQuery = async () => {
    setLoadingQuery(true);
    setQueryError(null); // Clear previous errors
    setQueryResults(null); // Clear previous results

    try {
      const response = await fetch(`${API_BASE_URL}/execute-sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sqlQuery }),
      });

      const data = await response.json();

      if (data.success) {
        setQueryResults(data.results);
      } else {
        setQueryError(data.error);
      }
    } catch (error) {
      setQueryError(`Network error or unexpected response: ${error.message}`);
    } finally {
      setLoadingQuery(false);
    }
  };

  const resetDatabase = async () => {
    setLoadingQuery(true); // Use loading query state for reset too
    setQueryError(null);
    setQueryResults(null);
    try {
      const response = await fetch(`${API_BASE_URL}/reset-db`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message); // Simple alert for reset confirmation
        // Re-fetch schema after reset to ensure it's up-to-date
        // if any DDL operations were performed by user (though not common in playground)
        // or if we wanted to show initial data again.
        await fetch(`${API_BASE_URL}/schema`).then(res => res.json()).then(d => {
          if(d.success) setSchema(d.schema);
        });
        setSqlQuery("SELECT * FROM Customers;"); // Reset query after DB reset
      } else {
        setQueryError(data.error);
      }
    } catch (error) {
      setQueryError(`Failed to reset database: ${error.message}`);
    } finally {
      setLoadingQuery(false);
    }
  };


  return (
    <div className="flex flex-col p-6 min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-400 drop-shadow-lg mb-2">SQL Playground</h1>
        <p className="text-lg md:text-xl text-gray-300">Learn SQL in your browser with a Node.js backend & Monaco Editor.</p>
      </header>

      <main className="flex flex-col md:flex-row gap-6 flex-grow">
        {/* Left Panel: Schema Viewer */}
        <section className="flex-1 bg-gray-800 rounded-xl shadow-xl p-6 flex flex-col">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">Database Schema</h2>
          {loadingSchema ? (
            <p className="text-gray-400">Loading schema...</p>
          ) : (
            <div className="bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-600">
              {Object.keys(schema).length > 0 ? (
                Object.keys(schema).map(tableName => (
                  <div key={tableName} className="mb-4 last:mb-0">
                    <h4 className="text-xl font-semibold text-green-400 mb-2">{tableName}</h4>
                    <ul className="list-disc list-inside text-gray-300 ml-4">
                      {schema[tableName].map(col => (
                        <li key={`${tableName}-${col.name}`} className="mb-1">
                          <span className="font-medium text-yellow-300">{col.name}</span>: {col.type}
                          {col.notnull && <span className="text-red-400"> (NOT NULL)</span>}
                          {col.pk && <span className="text-purple-400"> (PK)</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center">No schema information available.</p>
              )}
            </div>
          )}
          <div className="mt-6 text-center">
            <button
              onClick={resetDatabase}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out disabled:opacity-50"
              disabled={loadingQuery}
            >
              {loadingQuery ? 'Resetting...' : 'Reset Database'}
            </button>
          </div>
        </section>

        {/* Right Panel: SQL Editor & Results */}
        <section className="flex-1 bg-gray-800 rounded-xl shadow-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-300">SQL Editor</h2>
            <button
              onClick={executeSqlQuery}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out disabled:opacity-50"
              disabled={loadingQuery}
            >
              {loadingQuery ? 'Executing...' : 'Execute Query'}
            </button>
          </div>

          <div className="h-64 md:h-80 mb-6 border border-gray-600 rounded-lg overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="sql"
              defaultValue={sqlQuery}
              onChange={(value) => setSqlQuery(value)}
              onMount={handleEditorDidMount}
              theme="vs-dark" // VS Code dark theme
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                wordWrap: "on",
                overviewRulerLables: false,
                lineNumbersMinChars: 3,
              }}
            />
          </div>

          <h2 className="text-2xl font-bold text-blue-300 mb-4">Query Results</h2>
          <div className="flex-grow"> {/* This div ensures ResultDisplay takes available space */}
            <ResultDisplay results={queryResults} error={queryError} />
          </div>
        </section>
      </main>

      <footer className="mt-10 text-center text-gray-500 text-sm">
        <p>&copy; 2025 SQL Playground. Built with React, Node.js, Monaco Editor, and Tailwind CSS.</p>
      </footer>
    </div>
  );
}

export default App;
