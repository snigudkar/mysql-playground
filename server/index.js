
// // server/index.js
// const express = require('express');
// const Database = require('better-sqlite3');
// const path = require('path');
// const fs = require('fs');
// require('dotenv').config(); // Load environment variables from .env file

// // Import Google Generative AI SDK
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const app = express();
// const PORT = process.env.PORT || 5000;
// const DB_FILE = process.env.DB_FILE || 'playground.db';

// // --- Gemini AI Setup ---
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// if (!GEMINI_API_KEY) {
//     console.error("GEMINI_API_KEY is not set in .env file. AI features will be disabled.");
// }
// const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
// // Use gemini-1.5-flash for faster responses
// const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;
// // -----------------------


// // Middleware to parse JSON request bodies
// app.use(express.json());

// // Enable CORS for frontend to access backend
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

// // Path to the database file
// const dbPath = path.join(__dirname, DB_FILE);
// let db; // Variable to hold the database connection

// // Function to initialize the database with schema and data
// const initializeDatabase = () => {
//     try {
//         if (fs.existsSync(dbPath)) {
//             fs.unlinkSync(dbPath);
//             console.log(`Deleted existing database file: ${DB_FILE}`);
//         }

//         db = new Database(dbPath);
//         console.log(`Database connected at ${DB_FILE}`);

//         const schemaPath = path.join(__dirname, 'db', 'schema.sql');
//         const schema = fs.readFileSync(schemaPath, 'utf8');
//         db.exec(schema);
//         console.log('Database schema and data initialized successfully.');

//         console.log('\n--- Initial Database State ---');
//         const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").all();
//         console.log('Tables:', tables.map(t => t.name).join(', '));

//         tables.forEach(table => {
//             try {
//                 const rows = db.prepare(`SELECT * FROM ${table.name} LIMIT 3;`).all();
//                 console.log(`\nTable: ${table.name} (first 3 rows)`);
//                 if (rows.length > 0) {
//                     console.table(rows);
//                 } else {
//                     console.log('  (No data)');
//                 }
//             } catch (err) {
//                 console.error(`Error fetching data for table ${table.name}:`, err.message);
//             }
//         });
//         console.log('-----------------------------\n');

//     } catch (err) {
//         console.error('Error initializing database:', err.message);
//         process.exit(1);
//     }
// };

// // Global variable to store schema details for AI context
// let currentSchemaDetails = {};
// const fetchSchemaDetails = () => {
//     try {
//         const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").all();
//         const schemaDetails = {};
//         tables.forEach(table => {
//             const columns = db.prepare(`PRAGMA table_info('${table.name}')`).all();
//             schemaDetails[table.name] = columns.map(col => ({
//                 name: col.name,
//                 type: col.type,
//                 notnull: col.notnull,
//                 pk: col.pk
//             }));
//         });
//         currentSchemaDetails = schemaDetails; // Store for AI use
//     } catch (error) {
//         console.error("Error fetching schema details for AI context:", error.message);
//     }
// }


// // Initialize the database and fetch schema details on server start
// initializeDatabase();
// fetchSchemaDetails(); // Initial schema fetch

// // Endpoint to execute SQL queries
// app.post('/api/execute-sql', async (req, res) => {
//     const { query } = req.body;

//     if (!query) {
//         return res.status(400).json({ error: 'SQL query is required.' });
//     }

//     try {
//         let result;
//         const statement = db.prepare(query);

//         if (query.trim().toUpperCase().startsWith('SELECT')) {
//              result = statement.all();
//         } else {
//             result = statement.run();
//         }

//         res.json({
//             success: true,
//             results: result
//         });

//     } catch (error) {
//         let aiExplanation = null;
//         if (model) {
//             try {
//                 const prompt = `You are an expert SQL error debugger for SQLite databases.
//                 The user provided an SQL query and it resulted in an error.
//                 Your task is to explain the error message in simple terms for a beginner,
//                 and suggest common ways to fix it, referencing the provided schema where helpful.
//                 Focus on being concise and actionable.

//                 Database Schema (JSON):
//                 ${JSON.stringify(currentSchemaDetails, null, 2)}

//                 User's SQL Query:
//                 ${query}

//                 Raw Error Message:
//                 ${error.message}

//                 Please provide only the explanation and fix suggestions. Do not generate code directly unless demonstrating a fix.`;

//                 const result = await model.generateContent(prompt);
//                 const response = await result.response;
//                 aiExplanation = response.text();

//             } catch (aiError) {
//                 console.error("Error generating AI explanation:", aiError);
//                 aiExplanation = "Failed to get AI explanation: " + aiError.message;
//             }
//         } else {
//              aiExplanation = "AI features are disabled due to missing GEMINI_API_KEY.";
//         }


//         res.status(400).json({
//             success: false,
//             error: error.message,
//             aiExplanation: aiExplanation
//         });
//     }
// });

// // Endpoint to get database schema (table names and columns)
// app.get('/api/schema', (req, res) => {
//     try {
//         res.json({
//             success: true,
//             schema: currentSchemaDetails
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// });

// // Endpoint to reset the database
// app.post('/api/reset-db', async (req, res) => {
//     try {
//         if (db) {
//             db.close();
//             console.log('Database connection closed for reset.');
//         }
//         initializeDatabase(); // Re-initialize
//         fetchSchemaDetails(); // Re-fetch schema details after reset for AI context
//         res.json({
//             success: true,
//             message: "Database reset successfully."
//         });
//     } catch (error) {
//         console.error('Error during database reset:', error);
//         res.status(500).json({
//             success: false,
//             error: "Failed to reset database: " + error.message
//         });
//     }
// });


// // Start the server
// // IMPORTANT: Listen on 0.0.0.0 for Render deployment
// app.listen(PORT, '0.0.0.0', () => { // Changed here: added '0.0.0.0'
//     console.log(`Server running on http://0.0.0.0:${PORT}`); // Log updated for clarity
//     console.log(`Frontend will typically run on http://localhost:5173 (Vite default)`);
//     console.log(`Access your backend API at: http://0.0.0.0:${PORT}/api/schema`); // Added for clarity
// });
// server/index.js

// const express = require('express');
// const Database = require('better-sqlite3');
// const path = require('path');
// const fs = require('fs');
// require('dotenv').config(); // Load environment variables from .env file

// // Import Google Generative AI SDK
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const app = express();
// // Render automatically sets process.env.PORT. We should use it.
// const PORT = process.env.PORT || 5000;

// const DB_FILE = process.env.DB_FILE || 'playground.db';


// // --- Gemini AI Setup ---
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// if (!GEMINI_API_KEY) {
//     console.error("GEMINI_API_KEY is not set in .env file. AI features will be disabled.");
// }
// const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
// const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;
// // -----------------------


// app.use(express.json());

// app.use((req, res, next) => {
//     // In development, allow localhost. In production, replace with your frontend's deployed URL.
//     // For now, keeping '*' to maximize compatibility during development, but be aware of security implications.
//     res.setHeader('Access-Control-Allow-Origin', '*'); // Or 'http://localhost:5173' for local dev
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Added PUT, DELETE for completeness
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Added Authorization header for future use
//     // Handle preflight OPTIONS requests
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(204); // No Content
//     }
//     next();
// });


// // Path to the database file
// const dbPath = path.join(__dirname, DB_FILE);
// let db; // Variable to hold the database connection

// // Function to initialize the database with schema and data
// const initializeDatabase = () => {
//     try {
//         if (fs.existsSync(dbPath)) {
//             fs.unlinkSync(dbPath);
//             console.log(`Deleted existing database file: ${DB_FILE}`);
//         }

//         db = new Database(dbPath);
//         console.log(`Database connected at ${DB_FILE}`);

//         const schemaPath = path.join(__dirname, 'db', 'schema.sql');
//         const schema = fs.readFileSync(schemaPath, 'utf8');
//         db.exec(schema);
//         console.log('Database schema and data initialized successfully.');

//         console.log('\n--- Initial Database State ---');
//         const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").all();
//         console.log('Tables:', tables.map(t => t.name).join(', '));

//         tables.forEach(table => {
//             try {
//                 const rows = db.prepare(`SELECT * FROM ${table.name} LIMIT 3;`).all();
//                 console.log(`\nTable: ${table.name} (first 3 rows)`);
//                 if (rows.length > 0) {
//                     console.table(rows);
//                 } else {
//                     console.log('  (No data)');
//                 }
//             } catch (err) {
//                 console.error(`Error fetching data for table ${table.name}:`, err.message);
//             }
//         });
//         console.log('-----------------------------\n');

//     } catch (err) {
//         console.error('Error initializing database:', err.message);
//     }
// };

// let currentSchemaDetails = {};
// const fetchSchemaDetails = () => {
//     try {
//         const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").all();
//         const schemaDetails = {};
//         tables.forEach(table => {
//             const columns = db.prepare(`PRAGMA table_info('${table.name}')`).all();
//             schemaDetails[table.name] = columns.map(col => ({
//                 name: col.name,
//                 type: col.type,
//                 notnull: col.notnull,
//                 pk: col.pk
//             }));
//         });
//         currentSchemaDetails = schemaDetails;
//     } catch (error) {
//         console.error("Error fetching schema details for AI context:", error.message);
//     }
// }

// initializeDatabase();
// fetchSchemaDetails();

// app.post('/api/execute-sql', async (req, res) => {
//     const { query } = req.body;

//     if (!query) {
//         return res.status(400).json({ error: 'SQL query is required.' });
//     }

//     try {
//         let result;
//         const statement = db.prepare(query);

//         if (query.trim().toUpperCase().startsWith('SELECT')) {
//              result = statement.all();
//         } else {
//             result = statement.run();
//         }

//         res.json({
//             success: true,
//             results: result
//         });

//     } catch (error) {
//         let aiExplanation = null;
//         if (model) {
//             try {
//                 const prompt = `You are an expert SQL error debugger for SQLite databases.
//                 The user provided an SQL query and it resulted in an error.
//                 Your task is to explain the error message in simple terms for a beginner,
//                 and suggest common ways to fix it, referencing the provided schema where helpful.
//                 Focus on being concise and actionable.

//                 Database Schema (JSON):
//                 ${JSON.stringify(currentSchemaDetails, null, 2)}

//                 User's SQL Query:
//                 ${query}

//                 Raw Error Message:
//                 ${error.message}

//                 Please provide only the explanation and fix suggestions. Do not generate code directly unless demonstrating a fix.`;

//                 const result = await model.generateContent(prompt);
//                 const response = await result.response;
//                 aiExplanation = response.text();

//             } catch (aiError) {
//                 console.error("Error generating AI explanation:", aiError);
//                 aiExplanation = "Failed to get AI explanation: " + aiError.message;
//             }
//         } else {
//              aiExplanation = "AI features are disabled due to missing GEMINI_API_KEY.";
//         }


//         res.status(400).json({
//             success: false,
//             error: error.message,
//             aiExplanation: aiExplanation
//         });
//     }
// });

// app.get('/api/schema', (req, res) => {
//     try {
//         res.json({
//             success: true,
//             schema: currentSchemaDetails
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// });

// app.post('/api/reset-db', async (req, res) => {
//     try {
//         if (db) {
//             db.close();
//             console.log('Database connection closed for reset.');
//         }
//         initializeDatabase();
//         fetchSchemaDetails();
//         res.json({
//             success: true,
//             message: "Database reset successfully."
//         });
//     } catch (error) {
//         console.error('Error during database reset:', error);
//         res.status(500).json({
//             success: false,
//             error: "Failed to reset database: " + error.message
//         });
//     }
// });


// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server running on http://0.0.0.0:${PORT}`);
//     console.log(`Frontend will typically run on http://localhost:5173 (Vite default)`);
//     console.log(`Access your backend API at: http://0.0.0.0:${PORT}/api/schema`);
// });

// server/index.js

// const express = require('express');
// const Database = require('better-sqlite3');
// const path = require('path');
// const fs = require('fs');
// require('dotenv').config();

// // Import Google Generative AI SDK
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// // NEW: Import the sandbox executor
// const { executeSandboxQuery } = require('./sql_sandbox/executor');

// // NEW: Import your new routes
// const courseRoutes = require('./routes/courses');
// const userProgressRoutes = require('./routes/userProgress');


// const app = express();
// const PORT = process.env.PORT || 5000;

// // --- Database Paths ---
// // For the main playground (the one your original PlaygroundPage uses)
// const PLAYGROUND_DB_FILE = process.env.DB_FILE || 'playground.db';
// const playgroundDbPath = path.join(__dirname, PLAYGROUND_DB_FILE);

// // For the persistent application data (courses, lessons, user progress)
// const APP_DB_FILE = process.env.APP_DATABASE_FILE || 'app.db';
// const appDbPath = path.join(__dirname, APP_DB_FILE);

// // --- Gemini AI Setup ---
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// if (!GEMINI_API_KEY) {
//     console.warn("GEMINI_API_KEY is not set in .env file. AI features will be disabled.");
// }
// const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
// const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;
// // -----------------------

// app.use(express.json());

// // CORS Middleware
// app.use((req, res, next) => {
//     // In development, allow localhost. In production, replace with your frontend's deployed URL.
//     res.setHeader('Access-Control-Allow-Origin', '*'); // Or 'http://localhost:5173' for local dev
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(204);
//     }
//     next();
// });

// // --- Database Connections ---
// let playgroundDb; // For your existing playground
// let appDb;      // For persistent course/user data

// // Function to initialize the playground database (your original setup)
// const initializePlaygroundDatabase = () => {
//     try {
//         if (fs.existsSync(playgroundDbPath)) {
//             fs.unlinkSync(playgroundDbPath); // Delete existing playground.db
//             console.log(`Deleted existing playground database file: ${PLAYGROUND_DB_FILE}`);
//         }
//         playgroundDb = new Database(playgroundDbPath);
//         console.log(`Playground Database connected at ${PLAYGROUND_DB_FILE}`);

//         const schemaPath = path.join(__dirname, 'db', 'schema.sql'); // Your existing schema.sql
//         const schema = fs.readFileSync(schemaPath, 'utf8');
//         playgroundDb.exec(schema);
//         console.log('Playground database schema and data initialized successfully.');

//         // Fetch schema details for AI context (for the main playground DB)
//         fetchPlaygroundSchemaDetails();

//     } catch (err) {
//         console.error('Error initializing playground database:', err.message);
//     }
// };

// // Function to initialize the app database (new for courses, lessons, progress)
// const initializeAppDatabase = () => {
//     try {
//         appDb = new Database(appDbPath);
//         console.log(`Application Database connected at ${APP_DB_FILE}`);

//         const appSchemaPath = path.join(__dirname, 'db', 'app_schema.sql');
//         const appSchema = fs.readFileSync(appSchemaPath, 'utf8');
//         appDb.exec(appSchema); // Execute app_schema.sql
//         console.log('Application database tables checked/created and seeded.');

//     } catch (err) {
//         console.error('Error initializing application database:', err.message);
//     }
// };

// let currentSchemaDetails = {}; // For playground AI context
// const fetchPlaygroundSchemaDetails = () => {
//     try {
//         const tables = playgroundDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").all();
//         const schemaDetails = {};
//         tables.forEach(table => {
//             const columns = playgroundDb.prepare(`PRAGMA table_info('${table.name}')`).all();
//             schemaDetails[table.name] = columns.map(col => ({
//                 name: col.name,
//                 type: col.type,
//                 notnull: col.notnull,
//                 pk: col.pk
//             }));
//         });
//         currentSchemaDetails = schemaDetails;
//     } catch (error) {
//         console.error("Error fetching playground schema details for AI context:", error.message);
//     }
// };

// // Initialize both databases on server start
// initializePlaygroundDatabase();
// initializeAppDatabase();


// // --- Existing /api/execute-sql endpoint (for your PlaygroundPage.jsx) ---
// // This endpoint still operates on the persistent 'playground.db' for the main playground feature.
// app.post('/api/execute-sql', async (req, res) => {
//     const { query } = req.body;

//     if (!query) {
//         return res.status(400).json({ error: 'SQL query is required.' });
//     }

//     try {
//         let result;
//         const statement = playgroundDb.prepare(query); // Use playgroundDb

//         if (query.trim().toUpperCase().startsWith('SELECT')) {
//              result = statement.all();
//         } else {
//             result = statement.run();
//         }

//         res.json({
//             success: true,
//             results: result
//         });

//     } catch (error) {
//         let aiExplanation = null;
//         if (model) {
//             try {
//                 const prompt = `You are an expert SQL error debugger for SQLite databases.
//                 The user provided an SQL query and it resulted in an error.
//                 Your task is to explain the error message in simple terms for a beginner,
//                 and suggest common ways to fix it, referencing the provided schema where helpful.
//                 Focus on being concise and actionable.

//                 Database Schema (JSON):
//                 ${JSON.stringify(currentSchemaDetails, null, 2)}

//                 User's SQL Query:
//                 ${query}

//                 Raw Error Message:
//                 ${error.message}

//                 Please provide only the explanation and fix suggestions. Do not generate code directly unless demonstrating a fix.`;

//                 const result = await model.generateContent(prompt);
//                 const response = await result.response;
//                 aiExplanation = response.text();

//             } catch (aiError) {
//                 console.error("Error generating AI explanation:", aiError);
//                 aiExplanation = "Failed to get AI explanation: " + aiError.message;
//             }
//         } else {
//              aiExplanation = "AI features are disabled due to missing GEMINI_API_KEY.";
//         }

//         res.status(400).json({
//             success: false,
//             error: error.message,
//             aiExplanation: aiExplanation
//         });
//     }
// });

// // --- NEW: /api/run-lesson-query endpoint (for the lesson-specific sandbox) ---
// app.post('/api/run-lesson-query', async (req, res) => {
//     const { query, lessonId } = req.body;
//     // In a real app, you'd verify user auth here (req.user.id)
//     if (!query || !lessonId) {
//       return res.status(400).json({ error: 'Query and lessonId are required.' });
//     }

//     try {
//       // This calls the secure sandbox executor
//       const { result, error } = executeSandboxQuery(query, lessonId);
//       if (error) {
//         return res.status(400).json({ error });
//       }
//       res.json({ result });
//     } catch (err) {
//       console.error('Error running SQL sandbox query:', err);
//       res.status(500).json({ error: 'Internal server error during sandbox query execution.' });
//     }
// });


// // --- Existing /api/schema endpoint (for your PlaygroundPage.jsx) ---
// app.get('/api/schema', (req, res) => {
//     try {
//         res.json({
//             success: true,
//             schema: currentSchemaDetails
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// });

// // --- Existing /api/reset-db endpoint (for your PlaygroundPage.jsx) ---
// app.post('/api/reset-db', async (req, res) => {
//     try {
//         if (playgroundDb) {
//             playgroundDb.close();
//             console.log('Playground database connection closed for reset.');
//         }
//         initializePlaygroundDatabase(); // Re-initialize only the playground DB
//         res.json({
//             success: true,
//             message: "Playground database reset successfully."
//         });
//     } catch (error) {
//         console.error('Error during playground database reset:', error);
//         res.status(500).json({
//             success: false,
//             error: "Failed to reset playground database: " + error.message
//         });
//     }
// });

// // --- NEW: Integrate Course and User Progress Routes ---
// app.use('/api', courseRoutes); // Mount /api/courses and /api/lessons
// app.use('/api', userProgressRoutes); // Mount /api/user-progress


// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server running on http://0.0.0.0:${PORT}`);
//     console.log(`Frontend will typically run on http://localhost:5173 (Vite default)`);
//     console.log(`Access your backend API for playground at: http://0.0.0.0:${PORT}/api/schema`);
//     console.log(`Access your backend API for courses at: http://0.0.0.0:${PORT}/api/courses`);
// });

// server/index.js
// const express = require('express');
// const Database = require('better-sqlite3');
// const path = require('path');
// const fs = require('fs');
// require('dotenv').config();

// // Import Google Generative AI SDK
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// // NEW: Import the sandbox executor (assuming it exists and is correct)
// const { executeSandboxQuery } = require('./sql_sandbox/executor');

// // NEW: Import your new routes as functions (they now export functions)
// const createCourseRoutes = require('./routes/courses'); // Renamed variable to reflect it's a function
// const createUserProgressRoutes = require('./routes/userProgress'); // Renamed variable to reflect it's a function


// const app = express();
// const PORT = process.env.PORT || 5000;

// // --- Database Paths ---
// const PLAYGROUND_DB_FILE = process.env.DB_FILE || 'playground.db';
// const playgroundDbPath = path.join(__dirname, PLAYGROUND_DB_FILE);

// const APP_DB_FILE = process.env.APP_DATABASE_FILE || 'app.db';
// const appDbPath = path.join(__dirname, APP_DB_FILE);

// // --- Gemini AI Setup ---
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// if (!GEMINI_API_KEY) {
//     console.warn("GEMINI_API_KEY is not set in .env file. AI features will be disabled.");
// }
// const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
// const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;
// // -----------------------

// app.use(express.json());

// // CORS Middleware
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(204);
//     }
//     next();
// });

// // --- Database Connections ---
// let playgroundDb;
// let appDb;

// const initializePlaygroundDatabase = () => {
//     try {
//         if (fs.existsSync(playgroundDbPath)) {
//             fs.unlinkSync(playgroundDbPath);
//             console.log(`Deleted existing playground database file: ${PLAYGROUND_DB_FILE}`);
//         }
//         playgroundDb = new Database(playgroundDbPath);
//         console.log(`Playground Database connected at ${PLAYGROUND_DB_FILE}`);

//         const schemaPath = path.join(__dirname, 'db', 'schema.sql');
//         const schema = fs.readFileSync(schemaPath, 'utf8');
//         playgroundDb.exec(schema);
//         console.log('Playground database schema and data initialized successfully.');

//         fetchPlaygroundSchemaDetails();

//     } catch (err) {
//         console.error('Error initializing playground database:', err.message);
//         // Consider process.exit(1) here if playground DB is critical for server start
//     }
// };

// const initializeAppDatabase = () => {
//     try {
//         // Ensure app.db is not deleted on every server restart unless explicitly desired
//         if (fs.existsSync(appDbPath)) {
//             fs.unlinkSync(appDbPath); // Only uncomment if you want to wipe app.db on every restart
//         console.log(`Deleted existing application database file: ${APP_DB_FILE}`);
//         // }
//         appDb = new Database(appDbPath);
//         console.log(`Application Database connected at ${APP_DB_FILE}`);

//         const appSchemaPath = path.join(__dirname, 'db', 'app_schema.sql');
//         const appSchema = fs.readFileSync(appSchemaPath, 'utf8');
//         appDb.exec(appSchema);
//         console.log('Application database tables checked/created and seeded.');

//     } catch (err) {
//         console.error('Error initializing application database:', err.message);
//         process.exit(1); // Exit if app DB cannot be initialized, as it's critical for courses/user data
//     }
// }};

// let currentSchemaDetails = {};
// const fetchPlaygroundSchemaDetails = () => {
//     try {
//         const tables = playgroundDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").all();
//         const schemaDetails = {};
//         tables.forEach(table => {
//             const columns = playgroundDb.prepare(`PRAGMA table_info('${table.name}')`).all();
//             schemaDetails[table.name] = columns.map(col => ({
//                 name: col.name,
//                 type: col.type,
//                 notnull: col.notnull,
//                 pk: col.pk
//             }));
//         });
//         currentSchemaDetails = schemaDetails;
//     } catch (error) {
//         console.error("Error fetching playground schema details for AI context:", error.message);
//     }
// };

// // Initialize both databases on server start
// initializeAppDatabase(); // Initialize appDb FIRST, as other routes might depend on it
// initializePlaygroundDatabase();


// // --- Existing /api/execute-sql endpoint ---
// app.post('/api/execute-sql', async (req, res) => {
//     const { query } = req.body;

//     if (!query) {
//         return res.status(400).json({ error: 'SQL query is required.' });
//     }

//     try {
//         let result;
//         const statement = playgroundDb.prepare(query);

//         if (query.trim().toUpperCase().startsWith('SELECT')) {
//             result = statement.all();
//         } else {
//             result = statement.run();
//         }

//         res.json({
//             success: true,
//             results: result
//         });

//     } catch (error) {
//         let aiExplanation = null;
//         if (model) {
//             try {
//                 const prompt = `You are an expert SQL error debugger for SQLite databases.
//                 The user provided an SQL query and it resulted in an error.
//                 Your task is to explain the error message in simple terms for a beginner,
//                 and suggest common ways to fix it, referencing the provided schema where helpful.
//                 Focus on being concise and actionable.

//                 Database Schema (JSON):
//                 ${JSON.stringify(currentSchemaDetails, null, 2)}

//                 User's SQL Query:
//                 ${query}

//                 Raw Error Message:
//                 ${error.message}

//                 Please provide only the explanation and fix suggestions. Do not generate code directly unless demonstrating a fix.`;

//                 const result = await model.generateContent(prompt);
//                 const response = await result.response;
//                 aiExplanation = response.text();

//             } catch (aiError) {
//                 console.error("Error generating AI explanation:", aiError);
//                 aiExplanation = "Failed to get AI explanation: " + aiError.message;
//             }
//         } else {
//             aiExplanation = "AI features are disabled due to missing GEMINI_API_KEY.";
//         }

//         res.status(400).json({
//             success: false,
//             error: error.message,
//             aiExplanation: aiExplanation
//         });
//     }
// });

// // --- NEW: /api/run-lesson-query endpoint ---
// app.post('/api/run-lesson-query', async (req, res) => {
//     const { query, lessonId } = req.body;
//     if (!query || !lessonId) {
//       return res.status(400).json({ error: 'Query and lessonId are required.' });
//     }

//     try {
//       const { result, error } = executeSandboxQuery(query, lessonId);
//       if (error) {
//         return res.status(400).json({ error });
//       }
//       res.json({ result });
//     } catch (err) {
//       console.error('Error running SQL sandbox query:', err);
//       res.status(500).json({ error: 'Internal server error during sandbox query execution.' });
//     }
// });


// // --- Existing /api/schema endpoint ---
// app.get('/api/schema', (req, res) => {
//     try {
//         res.json({
//             success: true,
//             schema: currentSchemaDetails
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// });

// // --- Existing /api/reset-db endpoint ---
// app.post('/api/reset-db', async (req, res) => {
//     try {
//         if (playgroundDb) {
//             playgroundDb.close();
//             console.log('Playground database connection closed for reset.');
//         }
//         initializePlaygroundDatabase();
//         res.json({
//             success: true,
//             message: "Playground database reset successfully."
//         });
//     } catch (error) {
//         console.error('Error during playground database reset:', error);
//         res.status(500).json({
//             success: false,
//             error: "Failed to reset playground database: " + error.message
//         });
//     }
// });

// // --- NEW: Integrate Course and User Progress Routes ---
// // Pass the appDb instance to the route functions
// app.use('/api', createCourseRoutes(appDb)); // Call the function to get the router
// app.use('/api', createUserProgressRoutes(appDb)); // Call the function to get the router


// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server running on http://0.0.0.0:${PORT}`);
//     console.log(`Frontend will typically run on http://localhost:5173 (Vite default)`);
//     console.log(`Access your backend API for playground at: http://0.0.0.0:${PORT}/api/schema`);
//     console.log(`Access your backend API for courses at: http://0.0.0.0:${PORT}/api/courses`);
// });
// const express = require('express');
// const userRoutes = require('./routes/user')(appDb);
// app.use('/api', userRoutes);
// const Database = require('better-sqlite3');
// const path = require('path');
// const fs = require('fs');
// require('dotenv').config();


// // Import Google Generative AI SDK
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// // NEW: Import the sandbox executor (assuming it exists and is correct)
// const { executeSandboxQuery } = require('./sql_sandbox/executor');
// console.log("🔍 Imported executeSandboxQuery:", typeof executeSandboxQuery);


// // NEW: Import your new routes as functions (they now export functions)
// const createCourseRoutes = require('./routes/courses'); // Renamed variable to reflect it's a function
// const createUserProgressRoutes = require('./routes/userProgress'); // Renamed variable to reflect it's a function


// const app = express();
// const PORT = process.env.PORT || 5000;

// // --- Database Paths ---
// const PLAYGROUND_DB_FILE = process.env.DB_FILE || 'playground.db';
// const playgroundDbPath = path.join(__dirname, PLAYGROUND_DB_FILE);

// const APP_DB_FILE = process.env.APP_DATABASE_FILE || 'app.db';
// const appDbPath = path.join(__dirname, APP_DB_FILE);

// // --- Gemini AI Setup ---
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// if (!GEMINI_API_KEY) {
//     console.warn("GEMINI_API_KEY is not set in .env file. AI features will be disabled.");
// }
// const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
// const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;
// // -----------------------

// app.use(express.json());

// // CORS Middleware
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(204);
//     }
//     next();
// });

// // --- Database Connections ---
// let playgroundDb;
// let appDb;

// const initializePlaygroundDatabase = () => {
//     try {
//         if (fs.existsSync(playgroundDbPath)) {
//             fs.unlinkSync(playgroundDbPath);
//             console.log(`Deleted existing playground database file: ${PLAYGROUND_DB_FILE}`);
//         }
//         playgroundDb = new Database(playgroundDbPath);
//         console.log(`Playground Database connected at ${PLAYGROUND_DB_FILE}`);

//         const schemaPath = path.join(__dirname, 'db', 'schema.sql');
//         const schema = fs.readFileSync(schemaPath, 'utf8');
//         playgroundDb.exec(schema);
//         console.log('Playground database schema and data initialized successfully.');

//         fetchPlaygroundSchemaDetails();

//     } catch (err) {
//         console.error('Error initializing playground database:', err.message);
//         // Consider process.exit(1) here if playground DB is critical for server start
//     }
// };

// const initializeAppDatabase = () => {
//     try {
//         // Ensure app.db is not deleted on every server restart unless explicitly desired
//         // This line was UNCOMMENTED for the one-time fix to recreate the database.
//         // It is now RE-COMMENTED to prevent data loss on future restarts.
//         if (fs.existsSync(appDbPath)) {
//             // fs.unlinkSync(appDbPath); // RE-COMMENTED THIS LINE
//             // console.log(`Deleted existing application database file: ${APP_DB_FILE}`); // RE-COMMENTED THIS LINE
//         } 

//         appDb = new Database(appDbPath);
//         console.log(`Application Database connected at ${APP_DB_FILE}`);

//         const appSchemaPath = path.join(__dirname, 'db', 'app_schema.sql');
//         const appSchema = fs.readFileSync(appSchemaPath, 'utf8');
//         appDb.exec(appSchema);
//         console.log('Application database tables checked/created and seeded.');

//     } catch (err) {
//         console.error('Error initializing application database:', err.message);
//         process.exit(1); // Exit if app DB cannot be initialized, as it's critical for courses/user data
//     }
// };


// let currentSchemaDetails = {};
// const fetchPlaygroundSchemaDetails = () => {
//     try {
//         const tables = playgroundDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").all();
//         const schemaDetails = {};
//         tables.forEach(table => {
//             const columns = playgroundDb.prepare(`PRAGMA table_info('${table.name}')`).all();
//             schemaDetails[table.name] = columns.map(col => ({
//                 name: col.name,
//                 type: col.type,
//                 notnull: col.notnull,
//                 pk: col.pk
//             }));
//         });
//         currentSchemaDetails = schemaDetails;
//     } catch (error) {
//         console.error("Error fetching playground schema details for AI context:", error.message);
//     }
// };

// // Initialize both databases on server start
// initializeAppDatabase(); // Initialize appDb FIRST, as other routes might depend on it
// initializePlaygroundDatabase();


// // --- Existing /api/execute-sql endpoint ---
// app.post('/api/execute-sql', async (req, res) => {
//     const { query } = req.body;

//     if (!query) {
//         return res.status(400).json({ error: 'SQL query is required.' });
//     }

//     try {
//         let result;
//         const statement = playgroundDb.prepare(query);

//         if (query.trim().toUpperCase().startsWith('SELECT')) {
//             result = statement.all();
//         } else {
//             result = statement.run();
//         }

//         res.json({
//             success: true,
//             results: result
//         });

//     } catch (error) {
//         let aiExplanation = null;
//         if (model) {
//             try {
//                 const prompt = `You are an expert SQL error debugger for SQLite databases.
//                 The user provided an SQL query and it resulted in an error.
//                 Your task is to explain the error message in simple terms for a beginner,
//                 and suggest common ways to fix it, referencing the provided schema where helpful.
//                 Focus on being concise and actionable.

//                 Database Schema (JSON):
//                 ${JSON.stringify(currentSchemaDetails, null, 2)}

//                 User's SQL Query:
//                 ${query}

//                 Raw Error Message:
//                 ${error.message}

//                 Please provide only the explanation and fix suggestions. Do not generate code directly unless demonstrating a fix.`;

//                 const result = await model.generateContent(prompt);
//                 const response = await result.response;
//                 aiExplanation = response.text();

//             } catch (aiError) {
//                 console.error("Error generating AI explanation:", aiError);
//                 aiExplanation = "Failed to get AI explanation: " + aiError.message;
//             }
//         } else {
//             aiExplanation = "AI features are disabled due to missing GEMINI_API_KEY.";
//         }

//         res.status(400).json({
//             success: false,
//             error: error.message,
//             aiExplanation: aiExplanation
//         });
//     }
// });

// // --- NEW: /api/run-lesson-query endpoint ---
// app.post('/api/run-lesson-query', async (req, res) => {
//   const { query, lessonId } = req.body;
//   console.log("📥 Received query:", query);
//   console.log("📘 Lesson ID:", lessonId);

//   if (!query || !lessonId) {
//     return res.status(400).json({ error: 'Query and lessonId are required.' });
//   }

//   try {
//     const { result, error } = executeSandboxQuery(query, lessonId);  // ✅ This now works
//     if (error) {
//       return res.status(400).json({ error });
//     }
//     res.json({ result });
//   } catch (err) {
//     console.error('Error running SQL sandbox query:', err);
//     res.status(500).json({ error: 'Internal server error during sandbox query execution.' });
//   }
// });


// // --- Existing /api/schema endpoint ---
// app.get('/api/schema', (req, res) => {
//     try {
//         res.json({
//             success: true,
//             schema: currentSchemaDetails
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// });

// // --- Existing /api/reset-db endpoint ---
// app.post('/api/reset-db', async (req, res) => {
//     try {
//         if (playgroundDb) {
//             playgroundDb.close();
//             console.log('Playground database connection closed for reset.');
//         }
//         initializePlaygroundDatabase();
//         res.json({
//             success: true,
//             message: "Playground database reset successfully."
//         });
//     } catch (error) {
//         console.error('Error during playground database reset:', error);
//         res.status(500).json({
//             success: false,
//             error: "Failed to reset playground database: " + error.message
//         });
//     }
// });

// // --- NEW: Integrate Course and User Progress Routes ---
// // // --- NEW: User Profile Endpoint ---
// // app.get('/api/user-profile/:uid', (req, res) => {
// //   const uid = req.params.uid;

// //   try {
// //     const progress = appDb.prepare(`
// //       SELECT 
// //   COUNT(DISTINCT course_id) AS coursesCompleted,
// //   COUNT(*) AS totalQueries,
// //   ROUND(julianday('now') - julianday(MIN(completed_at))) AS streak
// // FROM user_progress
// // WHERE user_id = ?

// //     `).get(uid);

// //     res.json({
// //       joinDate: "2024-01-01", // Replace with real join date if available
// //       streak: Math.floor(progress?.streak) || 0,
// //       totalQueries: progress?.totalQueries || 0,
// //       coursesCompleted: progress?.coursesCompleted || 0,
// //       achievements: [] // optional
// //     });

// //   } catch (error) {
// //     console.error("Error fetching user profile:", error.message);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });


// // Pass the appDb instance to the route functions
// app.use('/api', createCourseRoutes(appDb)); // Call the function to get the router
// app.use('/api', createUserProgressRoutes(appDb)); // Call the function to get the router


// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server running on http://0.0.0.0:${PORT}`);
//     console.log(`Frontend will typically run on http://localhost:5173 (Vite default)`);
//     console.log(`Access your backend API for playground at: http://0.0.0.0:${PORT}/api/schema`);
//     console.log(`Access your backend API for courses at: http://0.0.0.0:${PORT}/api/courses`);
// });

// const express = require('express');
// const Database = require('better-sqlite3');
// const path = require('path');
// const fs = require('fs');
// require('dotenv').config();

// // Import Google Generative AI SDK
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// // Import the sandbox executor
// const { executeSandboxQuery } = require('./sql_sandbox/executor');
// console.log("🔍 Imported executeSandboxQuery:", typeof executeSandboxQuery);

// // Import your new routes
// const createCourseRoutes = require('./routes/courses');
// const createUserProgressRoutes = require('./routes/userProgress');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // --- Database Paths ---
// const PLAYGROUND_DB_FILE = process.env.DB_FILE || 'playground.db';
// const playgroundDbPath = path.join(__dirname, PLAYGROUND_DB_FILE);

// const APP_DB_FILE = process.env.APP_DATABASE_FILE || 'app.db';
// const appDbPath = path.join(__dirname, APP_DB_FILE);

// // --- Gemini AI Setup ---
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// if (!GEMINI_API_KEY) {
//     console.warn("GEMINI_API_KEY is not set in .env file. AI features will be disabled.");
// }
// const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
// const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

// // Middleware
// app.use(express.json());
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     if (req.method === 'OPTIONS') return res.sendStatus(204);
//     next();
// });

// // --- Database Connections ---
// let playgroundDb;
// let appDb;

// const initializePlaygroundDatabase = () => {
//     try {
//         if (fs.existsSync(playgroundDbPath)) {
//             fs.unlinkSync(playgroundDbPath);
//             console.log(`Deleted existing playground database file: ${PLAYGROUND_DB_FILE}`);
//         }
//         playgroundDb = new Database(playgroundDbPath);
//         console.log(`Playground Database connected at ${PLAYGROUND_DB_FILE}`);

//         const schemaPath = path.join(__dirname, 'db', 'schema.sql');
//         const schema = fs.readFileSync(schemaPath, 'utf8');
//         playgroundDb.exec(schema);
//         console.log('Playground database schema and data initialized successfully.');

//         fetchPlaygroundSchemaDetails();

//     } catch (err) {
//         console.error('Error initializing playground database:', err.message);
//     }
// };

// const initializeAppDatabase = () => {
//     try {
//         appDb = new Database(appDbPath);
//         console.log(`Application Database connected at ${APP_DB_FILE}`);

//         const appSchemaPath = path.join(__dirname, 'db', 'app_schema.sql');
//         const appSchema = fs.readFileSync(appSchemaPath, 'utf8');
//         appDb.exec(appSchema);
//         console.log('Application database tables checked/created and seeded.');

//     } catch (err) {
//         console.error('Error initializing application database:', err.message);
//         process.exit(1);
//     }
// };

// let currentSchemaDetails = {};
// const fetchPlaygroundSchemaDetails = () => {
//     try {
//         const tables = playgroundDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").all();
//         const schemaDetails = {};
//         tables.forEach(table => {
//             const columns = playgroundDb.prepare(`PRAGMA table_info('${table.name}')`).all();
//             schemaDetails[table.name] = columns.map(col => ({
//                 name: col.name,
//                 type: col.type,
//                 notnull: col.notnull,
//                 pk: col.pk
//             }));
//         });
//         currentSchemaDetails = schemaDetails;
//     } catch (error) {
//         console.error("Error fetching playground schema details for AI context:", error.message);
//     }
// };

// // Initialize DBs
// initializeAppDatabase();        // appDb initialized
// initializePlaygroundDatabase(); // playgroundDb initialized

// // ✅ Now it's safe to load user routes
// const userRoutes = require('./routes/user')(appDb);
// app.use('/api', userRoutes);

// // Other routes using appDb
// app.use('/api', createCourseRoutes(appDb));
// app.use('/api', createUserProgressRoutes(appDb));

// // --- Execute SQL Endpoint ---
// app.post('/api/execute-sql', async (req, res) => {
//     const { query } = req.body;

//     if (!query) return res.status(400).json({ error: 'SQL query is required.' });

//     try {
//         const statement = playgroundDb.prepare(query);
//         const result = query.trim().toUpperCase().startsWith('SELECT')
//             ? statement.all()
//             : statement.run();

//         res.json({ success: true, results: result });
//     } catch (error) {
//         let aiExplanation = null;
//         if (model) {
//             try {
//                 const prompt = `You are an expert SQL error debugger.
//                 The user provided an SQL query and it resulted in an error.
//                 Your task is to explain the error message in simple terms for a beginner,
//                 and suggest common ways to fix it.

//                 Database Schema (JSON):
//                 ${JSON.stringify(currentSchemaDetails, null, 2)}

//                 User's SQL Query:
//                 ${query}

//                 Error Message:
//                 ${error.message}`;

//                 const result = await model.generateContent(prompt);
//                 aiExplanation = (await result.response).text();
//             } catch (aiError) {
//                 console.error("Error generating AI explanation:", aiError);
//                 aiExplanation = "AI error: " + aiError.message;
//             }
//         } else {
//             aiExplanation = "AI features disabled (GEMINI_API_KEY missing)";
//         }

//         res.status(400).json({ success: false, error: error.message, aiExplanation });
//     }
// });

// // --- Run Lesson Query ---
// app.post('/api/run-lesson-query', async (req, res) => {
//     const { query, lessonId } = req.body;
//     if (!query || !lessonId) return res.status(400).json({ error: 'Query and lessonId required.' });

//     try {
//         const { result, error } = executeSandboxQuery(query, lessonId);
//         if (error) return res.status(400).json({ error });
//         res.json({ result });
//     } catch (err) {
//         console.error('Sandbox query error:', err);
//         res.status(500).json({ error: 'Internal server error during sandbox query execution.' });
//     }
// });

// // --- Get Playground Schema ---
// app.get('/api/schema', (req, res) => {
//     res.json({ success: true, schema: currentSchemaDetails });
// });

// // --- Reset DB Endpoint ---
// app.post('/api/reset-db', async (req, res) => {
//     try {
//         if (playgroundDb) {
//             playgroundDb.close();
//             console.log('Playground DB closed for reset.');
//         }
//         initializePlaygroundDatabase();
//         res.json({ success: true, message: "Playground DB reset successful." });
//     } catch (error) {
//         console.error('Reset DB error:', error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// // --- ✅ User Profile Endpoint ---
// app.get('/api/user-profile/:uid', (req, res) => {
//     const uid = req.params.uid;
//     console.log("🔍 Fetching user profile for UID:", uid);

//     try {
//         const progress = appDb.prepare(`
//             SELECT 
//                 COUNT(DISTINCT course_id) AS coursesCompleted,
//                 COUNT(*) AS totalQueries,
//                 ROUND(julianday('now') - julianday(MIN(completed_at))) AS streak
//             FROM user_progress
//             WHERE user_id = ?
//         `).get(uid);

//         res.json({
//             joinDate: "2024-01-01", // Replace with actual data if needed
//             streak: Math.floor(progress?.streak) || 0,
//             totalQueries: progress?.totalQueries || 0,
//             coursesCompleted: progress?.coursesCompleted || 0,
//             achievements: [] // optional placeholder
//         });

//     } catch (error) {
//         console.error("❌ Error fetching user profile:", error.message);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// // --- Start Server ---
// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
//     console.log(`💻 Frontend typically runs on http://localhost:5173`);
//     console.log(`📂 API playground: http://0.0.0.0:${PORT}/api/schema`);
// });
const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import Google Generative AI SDK
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Import the sandbox executor
const { executeSandboxQuery } = require('./sql_sandbox/executor');
console.log("🔍 Imported executeSandboxQuery:", typeof executeSandboxQuery);

// Import your new routes
const createCourseRoutes = require('./routes/courses');
const createUserProgressRoutes = require('./routes/userProgress');
const createUserRoutes = require('./routes/user'); // ✅ Import user routes

const app = express();
const PORT = process.env.PORT || 5000;

// --- Database Paths ---
const PLAYGROUND_DB_FILE = process.env.DB_FILE || 'playground.db';
const playgroundDbPath = path.join(__dirname, PLAYGROUND_DB_FILE);

const APP_DB_FILE = process.env.APP_DATABASE_FILE || 'app.db';
const appDbPath = path.join(__dirname, APP_DB_FILE);

// --- Gemini AI Setup ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set in .env file. AI features will be disabled.");
}
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

// --- Database Connections ---
let playgroundDb;
let appDb;

const initializePlaygroundDatabase = () => {
    try {
        if (fs.existsSync(playgroundDbPath)) {
            fs.unlinkSync(playgroundDbPath);
            console.log(`Deleted existing playground database file: ${PLAYGROUND_DB_FILE}`);
        }
        playgroundDb = new Database(playgroundDbPath);
        console.log(`Playground Database connected at ${PLAYGROUND_DB_FILE}`);

        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        playgroundDb.exec(schema);
        console.log('Playground database schema and data initialized successfully.');

        fetchPlaygroundSchemaDetails();

    } catch (err) {
        console.error('Error initializing playground database:', err.message);
    }
};

const initializeAppDatabase = () => {
    try {
        appDb = new Database(appDbPath);
        console.log(`Application Database connected at ${APP_DB_FILE}`);

        const appSchemaPath = path.join(__dirname, 'db', 'app_schema.sql');
        const appSchema = fs.readFileSync(appSchemaPath, 'utf8');
        appDb.exec(appSchema);
        console.log('Application database tables checked/created and seeded.');

    } catch (err) {
        console.error('Error initializing application database:', err.message);
        process.exit(1);
    }
};

let currentSchemaDetails = {};
const fetchPlaygroundSchemaDetails = () => {
    try {
        const tables = playgroundDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").all();
        const schemaDetails = {};
        tables.forEach(table => {
            const columns = playgroundDb.prepare(`PRAGMA table_info('${table.name}')`).all();
            schemaDetails[table.name] = columns.map(col => ({
                name: col.name,
                type: col.type,
                notnull: col.notnull,
                pk: col.pk
            }));
        });
        currentSchemaDetails = schemaDetails;
    } catch (error) {
        console.error("Error fetching playground schema details for AI context:", error.message);
    }
};

// Initialize DBs
initializeAppDatabase();
initializePlaygroundDatabase();

// ✅ Load modularized route handlers
app.use('/api', createUserRoutes(appDb));         // user profile endpoint
app.use('/api', createCourseRoutes(appDb));       // courses
app.use('/api', createUserProgressRoutes(appDb)); // progress

// --- Execute SQL Endpoint ---
app.post('/api/execute-sql', async (req, res) => {
    const { query } = req.body;

    if (!query) return res.status(400).json({ error: 'SQL query is required.' });

    try {
        const statement = playgroundDb.prepare(query);
        const result = query.trim().toUpperCase().startsWith('SELECT')
            ? statement.all()
            : statement.run();

        res.json({ success: true, results: result });
    } catch (error) {
        let aiExplanation = null;
        if (model) {
            try {
                const prompt = `You are an expert SQL error debugger.
                The user provided an SQL query and it resulted in an error.
                Your task is to explain the error message in simple terms for a beginner,
                and suggest common ways to fix it.

                Database Schema (JSON):
                ${JSON.stringify(currentSchemaDetails, null, 2)}

                User's SQL Query:
                ${query}

                Error Message:
                ${error.message}`;

                const result = await model.generateContent(prompt);
                aiExplanation = (await result.response).text();
            } catch (aiError) {
                console.error("Error generating AI explanation:", aiError);
                aiExplanation = "AI error: " + aiError.message;
            }
        } else {
            aiExplanation = "AI features disabled (GEMINI_API_KEY missing)";
        }

        res.status(400).json({ success: false, error: error.message, aiExplanation });
    }
});

// --- Run Lesson Query ---
app.post('/api/run-lesson-query', async (req, res) => {
    const { query, lessonId } = req.body;
    if (!query || !lessonId) return res.status(400).json({ error: 'Query and lessonId required.' });

    try {
        const { result, error } = executeSandboxQuery(query, lessonId);
        if (error) return res.status(400).json({ error });
        res.json({ result });
    } catch (err) {
        console.error('Sandbox query error:', err);
        res.status(500).json({ error: 'Internal server error during sandbox query execution.' });
    }
});

// --- Get Playground Schema ---
app.get('/api/schema', (req, res) => {
    res.json({ success: true, schema: currentSchemaDetails });
});

// --- Reset DB Endpoint ---
app.post('/api/reset-db', async (req, res) => {
    try {
        if (playgroundDb) {
            playgroundDb.close();
            console.log('Playground DB closed for reset.');
        }
        initializePlaygroundDatabase();
        res.json({ success: true, message: "Playground DB reset successful." });
    } catch (error) {
        console.error('Reset DB error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- Catch-All for 404s ---
app.use((req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

// --- Start Server ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
    console.log(`💻 Frontend typically runs on http://localhost:5173`);
    console.log(`📂 API playground: http://0.0.0.0:${PORT}/api/schema`);
});
