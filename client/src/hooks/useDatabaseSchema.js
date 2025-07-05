// client/src/hooks/useDatabaseSchema.js
import { useState, useEffect } from 'react';

// IMPORTANT: Update this URL to your deployed Render backend URL
//const API_BASE_URL = 'http://localhost:5000/api'; // Example: 'https://your-backend-name.onrender.com/api'
const API_BASE_URL = 'https://mysql-playground.onrender.com/api';
/**
 * Custom hook to fetch and manage the database schema.
 * @returns {{schema: object, loadingSchema: boolean, fetchSchema: Function}}
 */
const useDatabaseSchema = () => {
  const [schema, setSchema] = useState({});
  const [loadingSchema, setLoadingSchema] = useState(true);

  const fetchSchema = async () => {
    setLoadingSchema(true);
    try {
      const response = await fetch(`${API_BASE_URL}/schema`);
      const data = await response.json();
      if (data.success) {
        setSchema(data.schema);
      } else {
        console.error("Failed to fetch schema:", data.error);
        setSchema({}); // Clear schema on error
      }
    } catch (error) {
      console.error("Error fetching schema:", error);
      setSchema({}); // Clear schema on error
    } finally {
      setLoadingSchema(false);
    }
  };

  // Fetch schema on component mount
  useEffect(() => {
    fetchSchema();
  }, []); // Empty dependency array means this runs once on mount

  return { schema, loadingSchema, fetchSchema };
};

export default useDatabaseSchema;
