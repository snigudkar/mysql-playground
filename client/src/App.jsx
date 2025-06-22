import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import ResultDisplay from './components/ResultDisplay';

// Backend server URL
const API_BASE_URL = 'http://localhost:5000/api';
// Local Storage Key
const QUERY_HISTORY_KEY = 'sqlPlaygroundQueryHistory';

function App() {
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM Customers;"); // Initial query
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [schema, setSchema] = useState({});
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [loadingQuery, setLoadingQuery] = useState(false);
  const editorRef = useRef(null);

  // State for query history and its visibility
  const [queryHistory, setQueryHistory] = useState([]);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(true);

  // --- Local Storage Hooks for Query History ---
  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(QUERY_HISTORY_KEY);
      if (storedHistory) {
        setQueryHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load query history from localStorage:", e);
    }
  }, []);

  // Save history to localStorage whenever queryHistory changes
  useEffect(() => {
    try {
      localStorage.setItem(QUERY_HISTORY_KEY, JSON.stringify(queryHistory));
    } catch (e) {
      console.error("Failed to save query history to localStorage:", e);
    }
  }, [queryHistory]);
  // ------------------------------------------

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
  };

  const executeSqlQuery = async () => {
    setLoadingQuery(true);
    setQueryError(null);
    setAiExplanation(null);
    setQueryResults(null);

    const currentQuery = sqlQuery.trim(); // Use the trimmed current query

    try {
      const response = await fetch(`${API_BASE_URL}/execute-sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: currentQuery }),
      });

      const data = await response.json();

      if (data.success) {
        setQueryResults(data.results);
        // Add query to history only if successful and not a duplicate of the last one
        if (queryHistory.length === 0 || queryHistory[0].query !== currentQuery) {
          setQueryHistory(prevHistory => {
            const newEntry = {
              id: Date.now(), // Simple unique ID
              query: currentQuery,
              timestamp: new Date().toLocaleString()
            };
            // Keep only the last 10 queries for brevity
            return [newEntry, ...prevHistory].slice(0, 10);
          });
        }
      } else {
        setQueryError(data.error);
        setAiExplanation(data.aiExplanation || "AI explanation not available.");
      }
    } catch (error) {
      setQueryError(`Network error or unexpected response: ${error.message}`);
      setAiExplanation("Could not reach backend for AI explanation.");
    } finally {
      setLoadingQuery(false);
    }
  };

  const resetDatabase = async () => {
    setLoadingQuery(true);
    setQueryError(null);
    setAiExplanation(null);
    setQueryResults(null);
    try {
      const response = await fetch(`${API_BASE_URL}/reset-db`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        console.log(data.message);
        setQueryResults({ message: data.message });
        await fetch(`${API_BASE_URL}/schema`).then(res => res.json()).then(d => {
          if(d.success) setSchema(d.schema);
        });
        setSqlQuery("SELECT * FROM Customers;");
      } else {
        setQueryError(data.error);
        setAiExplanation("Failed to reset database properly.");
      }
    } catch (error) {
      setQueryError(`Failed to reset database: ${error.message}`);
      setAiExplanation("Network error during database reset.");
    } finally {
      setLoadingQuery(false);
    }
  };

  const loadQueryFromHistory = (queryToLoad) => {
    setSqlQuery(queryToLoad);
    if (editorRef.current) {
        // Focus the editor and set cursor to end
        editorRef.current.focus();
        const lineCount = editorRef.current.getModel().getLineCount();
        const lastLineLength = editorRef.current.getModel().getLineLength(lineCount);
        editorRef.current.setPosition({ lineNumber: lineCount, column: lastLineLength + 1 });
    }
  };

  const clearHistory = () => {
    setQueryHistory([]);
    // Remove from localStorage as well
    localStorage.removeItem(QUERY_HISTORY_KEY);
  };


  return (
    <div className="flex flex-col p-6 min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-400 drop-shadow-lg mb-2">SQL Playground</h1>
        <p className="text-lg md:text-xl text-gray-300">Learn SQL in your browser with a Node.js backend & Monaco Editor.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 flex-grow">
        {/* Left Panel: Schema Viewer & Query History */}
        <section className="flex-1 bg-gray-800 rounded-xl shadow-xl p-6 flex flex-col">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">Database Schema</h2>
          {loadingSchema ? (
            <p className="text-gray-400">Loading schema...</p>
          ) : (
            <div className="bg-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto border border-gray-600 mb-6">
              {Object.keys(schema).length > 0 ? (
                Object.keys(schema).map(tableName => (
                  <div key={tableName} className="mb-4 last:mb-0">
                    <h4 className="text-xl font-semibold text-green-400 mb-2">{tableName}</h4>
                    <ul className="list-disc list-inside text-gray-300 ml-4">
                      {schema[tableName].map(col => (
                        <li key={`${tableName}-${col.name}`} className="mb-1 text-sm">
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

          {/* Query History Section */}
          <div className="mt-auto"> {/* Push to bottom */}
            <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center justify-between">
              Query History
              <button
                onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-sm font-semibold rounded-lg transition duration-200"
              >
                {isHistoryCollapsed ? 'Show' : 'Hide'}
              </button>
            </h2>
            {!isHistoryCollapsed && (
              <div className="bg-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto border border-gray-600">
                {queryHistory.length > 0 ? (
                  <>
                    <button
                      onClick={clearHistory}
                      className="w-full px-4 py-2 mb-3 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-lg transition duration-200"
                    >
                      Clear History
                    </button>
                    <ul className="space-y-3">
                      {queryHistory.map((entry) => (
                        <li
                          key={entry.id}
                          className="bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition duration-200"
                          onClick={() => loadQueryFromHistory(entry.query)}
                        >
                          <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap break-words">{entry.query}</p>
                          <p className="text-xs text-gray-400 mt-1">{entry.timestamp}</p>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-gray-400 text-center text-sm">No queries in history yet.</p>
                )}
              </div>
            )}
          </div>

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
              value={sqlQuery} // Make sure value is controlled by state
              onChange={(value) => setSqlQuery(value)}
              onMount={handleEditorDidMount}
              theme="vs-dark"
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

          <h2 className="text-2xl font-bold text-blue-300 mb-4">Query Results & AI Explanation</h2>
          <div className="flex-grow">
            <ResultDisplay results={queryResults} error={queryError} aiExplanation={aiExplanation} />
          </div>
        </section>
      </div> {/* End of main content flex container */}

      <footer className="mt-10 text-center text-gray-500 text-sm">
        <p>&copy; 2025 SQL Playground. Built with React, Node.js, Monaco Editor, and Tailwind CSS.</p>
      </footer>
    </div>
  );
}

export default App;
