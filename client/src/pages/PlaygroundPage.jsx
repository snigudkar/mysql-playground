// // client/src/pages/PlaygroundPage.jsx
// import React, { useState, useRef } from 'react';
// import Editor from '@monaco-editor/react';
// import ResultDisplay from '../components/ResultDisplay';
// import SchemaViewer from '../components/SchemaViewer';
// import { Play, Code, Clock, ChevronDown, ChevronUp, RefreshCcw, Trophy } from 'lucide-react';

// // Import custom hooks
// import useDatabaseSchema from '../hooks/useDatabaseSchema';
// import useQueryHistory from '../hooks/useQueryHistory'; // We'll pass auth state to this
// import useSqlQueryExecution from '../hooks/useSqlQueryExecution';

// /**
//  * PlaygroundPage component containing the SQL Editor, Schema Viewer, and Results.
//  * @param {{userId: string|null, isAuthenticated: boolean, isAuthReady: boolean}} props Auth state from App.jsx
//  */
// const PlaygroundPage = ({ userId, isAuthenticated, isAuthReady }) => {
//   const [sqlQuery, setSqlQuery] = useState("SELECT * FROM Customers;");
//   const editorRef = useRef(null);

//   // Use custom hooks for modularity
//   const { schema, loadingSchema, fetchSchema } = useDatabaseSchema();
//   const {
//     queryHistory,
//     isHistoryCollapsed,
//     setIsHistoryCollapsed,
//     addQueryToHistory,
//     clearHistory,
//   } = useQueryHistory(userId, isAuthenticated, isAuthReady); // Pass auth state to useQueryHistory
//   const {
//     queryResults,
//     queryError,
//     aiExplanation,
//     loadingQuery,
//     executeSqlQuery,
//     resetDatabase,
//   } = useSqlQueryExecution({
//     sqlQuery,
//     setSqlQuery,
//     dbSchema: schema,
//     addQueryToHistory,
//     fetchSchema,
//   });

//   const handleEditorDidMount = (editor, monaco) => {
//     editorRef.current = editor;
//   };

//   const loadQueryFromHistory = (queryToLoad) => {
//     setSqlQuery(queryToLoad);
//     if (editorRef.current) {
//         editorRef.current.focus();
//         const lineCount = editorRef.current.getModel().getLineCount();
//         const lastLineLength = editorRef.current.getModel().getLineLength(lineCount);
//         editorRef.current.setPosition({ lineNumber: lineCount, column: lastLineLength + 1 });
//     }
//     setIsHistoryCollapsed(true);
//   };

//   return (
//     <div className="flex flex-col items-center flex-grow w-full">
//       <header className="text-center mb-8 w-full max-w-4xl">
//         <h1 className="text-5xl md:text-6xl font-extrabold text-blue-400 drop-shadow-lg mb-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
//           SQL Playground
//         </h1>
//         <p className="text-lg md:text-xl text-gray-300">
//           Write, test, and debug SQL queries with AI assistance.
//         </p>
//       </header>

//       <div className="flex flex-col md:flex-row gap-6 w-full max-w-7xl flex-grow">
//         {/* Left Panel: Schema Viewer & Query History */}
//         <div className="flex-1 flex flex-col gap-6">
//           <SchemaViewer schema={schema} loadingSchema={loadingSchema} />

//           {/* Query History Section
//           <section className="bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col border border-white/10 mt-auto">
//             <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center justify-between">
//               <Clock className="w-6 h-6 mr-2 text-cyan-300" />
//               Query History
//               <button
//                 onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
//                 className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600/70 text-sm font-semibold rounded-lg transition-colors duration-300 border border-gray-600/50 hover:border-gray-500/70 shadow-md"
//               >
//                 {isHistoryCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
//               </button>
//             </h2>
//             {!isHistoryCollapsed && (
//               <div className="bg-gray-700/50 rounded-lg p-4 max-h-60 overflow-y-auto border border-gray-600/50 shadow-inner">
//                 {isAuthenticated && queryHistory.length > 0 ? ( // Only show history if authenticated
//                   <>
//                     <button
//                       onClick={clearHistory}
//                       className="w-full px-4 py-2 mb-3 bg-red-700/70 hover:bg-red-800 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.01] shadow-lg"
//                     >
//                       Clear History
//                     </button>
//                     <ul className="space-y-3">
//                       {queryHistory.map((entry) => (
//                         <li
//                           key={entry.id}
//                           className="bg-gray-800/70 p-3 rounded-lg cursor-pointer hover:bg-gray-600/80 transition-colors duration-200 border border-gray-700/50 shadow-sm"
//                           onClick={() => loadQueryFromHistory(entry.query)}
//                         >
//                           <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap break-words">{entry.query}</p>
//                           <p className="text-xs text-gray-400 mt-1">{entry.timestamp}</p>
//                         </li>
//                       ))}
//                     </ul>
//                   </>
//                 ) : (
//                   <p className="text-gray-400 text-center text-sm">
//                     {isAuthenticated ? 'No queries in history yet.' : 'Sign in to save and view your query history.'}
//                   </p>
//                 )}
//               </div>
//             )}
//           </section> */}

//           <div className="mt-6 text-center">
//             <button
//               onClick={resetDatabase}
//               className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
//               disabled={loadingQuery}
//             >
//               <RefreshCcw className="w-5 h-5 mr-2" />
//               {loadingQuery ? 'Resetting...' : 'Reset Database'}
//             </button>
//           </div>
//         </div>

//         {/* Right Panel: SQL Editor & Results */}
//         <section className="flex-1 bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col border border-white/10">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold text-blue-300 flex items-center">
//               <Code className="w-6 h-6 mr-2 text-purple-300" />
//               SQL Editor
//             </h2>
//             <button
//               onClick={executeSqlQuery}
//               className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
//               disabled={loadingQuery}
//             >
//               <Play className="w-5 h-5 mr-2" />
//               {loadingQuery ? 'Executing...' : 'Execute Query'}
//             </button>
//           </div>

//           <div className="flex-1 mb-6 border border-gray-600 rounded-lg overflow-hidden shadow-inner">
//             <Editor
//               height="100%"
//               defaultLanguage="sql"
//               defaultValue={sqlQuery}
//               value={sqlQuery}
//               onChange={(value) => setSqlQuery(value)}
//               onMount={handleEditorDidMount}
//               theme="vs-dark"
//               options={{
//                 minimap: { enabled: false },
//                 scrollBeyondLastLine: false,
//                 fontSize: 14,
//                 wordWrap: "on",
//                 overviewRulerLables: false,
//                 lineNumbersMinChars: 3,
//               }}
//             />
//           </div>

//           <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
//             <Trophy className="w-6 h-6 mr-2 text-cyan-300" />
//             Query Results & AI Explanation
//           </h2>
//           <div className="flex-grow">
//             <ResultDisplay results={queryResults} error={queryError} aiExplanation={aiExplanation} />
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default PlaygroundPage;
// client/src/pages/PlaygroundPage.jsx (This is the actual SQL editor page)
import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import ResultDisplay from '../components/ResultDisplay'; // Make sure this component exists
import SchemaViewer from '../components/SchemaViewer';   // Make sure this component exists
import { Play, Code, Clock, ChevronDown, ChevronUp, RefreshCcw, Trophy, Home } from 'lucide-react'; // Added Home icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Import custom hooks (ensure these files exist in client/src/hooks)
import useDatabaseSchema from '../hooks/useDatabaseSchema';
import useQueryHistory from '../hooks/useQueryHistory';
import useSqlQueryExecution from '../hooks/useSqlQueryExecution';

/**
 * PlaygroundPage component containing the SQL Editor, Schema Viewer, and Results.
 * @param {{userId: string|null, isAuthenticated: boolean, isAuthReady: boolean}} props Auth state from App.jsx
 */
const PlaygroundPage = ({ userId, isAuthenticated, isAuthReady }) => {
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM Customers;");
  const editorRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Use custom hooks for modularity
  const { schema, loadingSchema, fetchSchema } = useDatabaseSchema();
  const {
    queryHistory,
    isHistoryCollapsed,
    setIsHistoryCollapsed,
    addQueryToHistory,
    clearHistory,
  } = useQueryHistory(userId, isAuthenticated, isAuthReady); // Pass auth state to useQueryHistory
  const {
    queryResults,
    queryError,
    aiExplanation,
    loadingQuery,
    executeSqlQuery,
    resetDatabase,
  } = useSqlQueryExecution({
    sqlQuery,
    setSqlQuery,
    dbSchema: schema,
    addQueryToHistory,
    fetchSchema,
  });

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const loadQueryFromHistory = (queryToLoad) => {
    setSqlQuery(queryToLoad);
    if (editorRef.current) {
        editorRef.current.focus();
        const lineCount = editorRef.current.getModel().getLineCount();
        const lastLineLength = editorRef.current.getModel().getLineLength(lineCount);
        editorRef.current.setPosition({ lineNumber: lineCount, column: lastLineLength + 1 });
    }
    setIsHistoryCollapsed(true);
  };

  return (
    <div className="flex flex-col items-center flex-grow w-full min-h-screen pt-20 bg-gray-900 text-white">
 {/* Added pt-20 for fixed nav */}
      <header className="text-center mb-8 w-full max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-400 drop-shadow-lg mb-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
          SQL Playground
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          Write, test, and debug SQL queries with AI assistance.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-7xl flex-grow">
        {/* Left Panel: Schema Viewer & Query History */}
        <div className="flex-1 flex flex-col gap-6">
          <SchemaViewer schema={schema} loadingSchema={loadingSchema} />

          {/* Query History Section (Uncommented and fixed for display) */}
          <section className="bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col border border-white/10 mt-auto">
            <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center justify-between">
              <Clock className="w-6 h-6 mr-2 text-cyan-300" />
              Query History
              <button
                onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
                className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600/70 text-sm font-semibold rounded-lg transition-colors duration-300 border border-gray-600/50 hover:border-gray-500/70 shadow-md"
              >
                {isHistoryCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </h2>
            {!isHistoryCollapsed && (
              <div className="bg-gray-700/50 rounded-lg p-4 max-h-60 overflow-y-auto border border-gray-600/50 shadow-inner">
                {isAuthenticated && queryHistory.length > 0 ? (
                  <>
                    <button
                      onClick={clearHistory}
                      className="w-full px-4 py-2 mb-3 bg-red-700/70 hover:bg-red-800 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.01] shadow-lg"
                    >
                      Clear History
                    </button>
                    <ul className="space-y-3">
                      {queryHistory.map((entry) => (
                        <li
                          key={entry.id}
                          className="bg-gray-800/70 p-3 rounded-lg cursor-pointer hover:bg-gray-600/80 transition-colors duration-200 border border-gray-700/50 shadow-sm"
                          onClick={() => loadQueryFromHistory(entry.query)}
                        >
                          <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap break-words">{entry.query}</p>
                          <p className="text-xs text-gray-400 mt-1">{entry.timestamp}</p>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-gray-400 text-center text-sm">
                    {isAuthenticated ? 'No queries in history yet.' : 'Sign in to save and view your query history.'}
                  </p>
                )}
              </div>
            )}
          </section>

          <div className="mt-6 text-center">
            <button
              onClick={resetDatabase}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              disabled={loadingQuery}
            >
              <RefreshCcw className="w-5 h-5 mr-2" />
              {loadingQuery ? 'Resetting...' : 'Reset Database'}
            </button>
          </div>
        </div>

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

          <div className="flex-1 mb-6 border border-gray-600 rounded-lg overflow-hidden shadow-inner">
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

      {/* Back to Dashboard Button */}
      <div className="mt-12">
        <button
          onClick={() => navigate('/playground')}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-500/20 hover:to-gray-600/20 text-gray-300 font-semibold rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
        >
          <Home className="w-5 h-5 mr-2" /> Back to Playground Dashboard
        </button>
      </div>
    </div>
  );
};

export default PlaygroundPage;