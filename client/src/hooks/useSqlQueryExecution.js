// client/src/hooks/useSqlQueryExecution.js
import { useState } from 'react';

// IMPORTANT: Update this URL to your deployed Render backend URL
//const API_BASE_URL = 'http://localhost:5000/api'; // Example: 'https://your-backend-name.onrender.com/api'
const API_BASE_URL = 'https://mysql-playground.onrender.com/api';

/**
 * Custom hook to handle SQL query execution and database reset.
 * @param {object} options
 * @param {string} options.sqlQuery The current SQL query string.
 * @param {Function} options.setSqlQuery Function to update the SQL query string.
 * @param {object} options.dbSchema The current database schema for AI context.
 * @param {Function} options.addQueryToHistory Function to add a query to history on success.
 * @param {Function} options.fetchSchema Function to re-fetch schema after database reset.
 * @returns {{queryResults: object|null, queryError: string|null, aiExplanation: string|null, loadingQuery: boolean, executeSqlQuery: Function, resetDatabase: Function}}
 */
const useSqlQueryExecution = ({ sqlQuery, setSqlQuery, dbSchema, addQueryToHistory, fetchSchema }) => {
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [loadingQuery, setLoadingQuery] = useState(false);

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
        addQueryToHistory(currentQuery); // Add to history on success
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
        await fetchSchema(); // Re-fetch schema after reset
        setSqlQuery("SELECT * FROM Customers;"); // Reset editor query
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

  return {
    queryResults,
    queryError,
    aiExplanation,
    loadingQuery,
    executeSqlQuery,
    resetDatabase,
  };
};

export default useSqlQueryExecution;
