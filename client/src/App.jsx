import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import ResultDisplay from './components/ResultDisplay';
// Importing Lucide React icons for consistent branding
import { Database, Play, BookOpen, Trophy, Code, Users, Target, Zap, Brain, RefreshCcw } from 'lucide-react';


// Backend server URL
const API_BASE_URL = 'http://localhost:5000/api';
// Local Storage Key (No longer used for query history, but kept for clarity if other local storage is added)
// const QUERY_HISTORY_KEY = 'sqlPlaygroundQueryHistory'; // Removed as query history is removed

function App() {
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM Customers;"); // Initial query
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [schema, setSchema] = useState({});
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [loadingQuery, setLoadingQuery] = useState(false);
  const editorRef = useRef(null);

  // State for query history and its visibility (REMOVED)
  // const [queryHistory, setQueryHistory] = useState([]);
  // const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(true);


  // --- Background Animation States and Logic (REMOVED) ---
  // const [stars, setStars] = useState([]); // Removed stars state
  // No useEffect for background animation anymore

  // --- Local Storage Hooks for Query History (REMOVED) ---
  // useEffect(() => { /* Removed */ }, []);
  // useEffect(() => { /* Removed */ }, []);
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

    const currentQuery = sqlQuery.trim();

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
        // Logic for adding query to history removed
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

  // loadQueryFromHistory function removed
  // const loadQueryFromHistory = (queryToLoad) => { /* Removed */ };

  // clearHistory function removed
  // const clearHistory = () => { /* Removed */ };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white overflow-hidden relative font-sans">
      {/* Dynamic Animated Background (REMOVED: Stars and Constellations) */}
      {/* The entire fixed inset-0 div for background animations is removed */}

      {/* Main Content Wrapper */}
      <div className="relative z-10 p-6 flex flex-col items-center min-h-screen">
        {/* Header */}
        <header className="text-center mb-8 w-full max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-400 drop-shadow-lg mb-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            SQL Playground
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Write, test, and debug SQL queries with AI assistance.
          </p>
        </header>

        {/* Main Sections - Layout adjusted to fit */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-7xl flex-grow">
          {/* Left Panel: Schema Viewer */}
          <section className="flex-1 bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col border border-white/10">
            <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-purple-300" />
              Practice Schema
            </h2>
            {loadingSchema ? (
              <p className="text-gray-400">Loading schema...</p>
            ) : (
              <div className="bg-gray-700/50 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-600/50 mb-6 shadow-inner"> {/* Increased max-h */}
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

            {/* Reset Database Button (Moved up from mt-auto div, now directly at the end of section) */}
            <div className="mt-auto text-center"> {/* Kept mt-auto for alignment, but removed query history content */}
              <button
                onClick={resetDatabase}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                disabled={loadingQuery}
              >
                <RefreshCcw className="w-5 h-5 mr-2" />
                {loadingQuery ? 'Resetting...' : 'Reset Database'}
              </button>
            </div>
          </section>

          {/* Right Panel: SQL Editor & Results */}
          <section className="flex-1 bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-300 flex items-center">
                <Code className="w-6 h-6 mr-2 text-purple-300" />
                SQL Editor
              </h2>
              <button
                onClick={executeSqlQuery}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                disabled={loadingQuery}
              >
                <Play className="w-5 h-5 mr-2" />
                {loadingQuery ? 'Executing...' : 'Execute Query'}
              </button>
            </div>

            <div className="h-64 md:h-80 lg:h-96 mb-6 border border-gray-600 rounded-lg overflow-hidden shadow-inner">
              <Editor
                height="100%"
                defaultLanguage="sql"
                defaultValue={sqlQuery}
                value={sqlQuery}
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
                  // Custom editor background to match the overall theme if vs-dark is too stark
                  // 'editor.background': '#282c34',
                }}
              />
            </div>

            <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-cyan-300" />
              Query Results & AI Explanation
            </h2>
            <div className="flex-grow">
              <ResultDisplay results={queryResults} error={queryError} aiExplanation={aiExplanation} />
            </div>
          </section>
        </div>

        {/* Footer (REMOVED) */}
        {/* The entire footer element is removed */}
      </div> {/* End of main content wrapper */}
    </div>
  );
}

export default App;

