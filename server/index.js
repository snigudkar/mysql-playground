const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file

// Import Google Generative AI SDK
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = process.env.DB_FILE || 'playground.db';

// --- Gemini AI Setup ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in .env file. AI features will be disabled.");
}
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
// Use gemini-1.5-flash for faster responses
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;
// -----------------------


// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for frontend to access backend
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Path to the database file
const dbPath = path.join(__dirname, DB_FILE);
let db; // Variable to hold the database connection

// Function to initialize the database with schema and data
const initializeDatabase = () => {
    try {
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
            console.log(`Deleted existing database file: ${DB_FILE}`);
        }

        db = new Database(dbPath);
        console.log(`Database connected at ${DB_FILE}`);

        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema);
        console.log('Database schema and data initialized successfully.');

        console.log('\n--- Initial Database State ---');
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").all();
        console.log('Tables:', tables.map(t => t.name).join(', '));

        tables.forEach(table => {
            try {
                const rows = db.prepare(`SELECT * FROM ${table.name} LIMIT 3;`).all();
                console.log(`\nTable: ${table.name} (first 3 rows)`);
                if (rows.length > 0) {
                    console.table(rows);
                } else {
                    console.log('  (No data)');
                }
            } catch (err) {
                console.error(`Error fetching data for table ${table.name}:`, err.message);
            }
        });
        console.log('-----------------------------\n');

    } catch (err) {
        console.error('Error initializing database:', err.message);
        process.exit(1);
    }
};

// Global variable to store schema details for AI context
let currentSchemaDetails = {};
const fetchSchemaDetails = () => {
    try {
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").all();
        const schemaDetails = {};
        tables.forEach(table => {
            const columns = db.prepare(`PRAGMA table_info('${table.name}')`).all();
            schemaDetails[table.name] = columns.map(col => ({
                name: col.name,
                type: col.type,
                notnull: col.notnull,
                pk: col.pk
            }));
        });
        currentSchemaDetails = schemaDetails; // Store for AI use
    } catch (error) {
        console.error("Error fetching schema details for AI context:", error.message);
    }
}


// Initialize the database and fetch schema details on server start
initializeDatabase();
fetchSchemaDetails(); // Initial schema fetch

// Endpoint to execute SQL queries
app.post('/api/execute-sql', async (req, res) => { // Added 'async' keyword here
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'SQL query is required.' });
    }

    try {
        let result;
        const statement = db.prepare(query);

        if (query.trim().toUpperCase().startsWith('SELECT')) {
             result = statement.all();
        } else {
            result = statement.run();
        }

        res.json({
            success: true,
            results: result
        });

    } catch (error) {
        let aiExplanation = null;
        if (model) { // Only try to call AI if model is initialized
            try {
                const prompt = `You are an expert SQL error debugger for SQLite databases.
                The user provided an SQL query and it resulted in an error.
                Your task is to explain the error message in simple terms for a beginner,
                and suggest common ways to fix it, referencing the provided schema where helpful.
                Focus on being concise and actionable.

                Database Schema (JSON):
                ${JSON.stringify(currentSchemaDetails, null, 2)}

                User's SQL Query:
                ${query}

                Raw Error Message:
                ${error.message}

                Please provide only the explanation and fix suggestions. Do not generate code directly unless demonstrating a fix.`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                aiExplanation = response.text();

            } catch (aiError) {
                console.error("Error generating AI explanation:", aiError);
                aiExplanation = "Failed to get AI explanation: " + aiError.message;
            }
        } else {
             aiExplanation = "AI features are disabled due to missing GEMINI_API_KEY.";
        }


        res.status(400).json({
            success: false,
            error: error.message,
            aiExplanation: aiExplanation // Send AI explanation
        });
    }
});

// Endpoint to get database schema (table names and columns)
// This endpoint is already functional, no changes needed for AI.
app.get('/api/schema', (req, res) => {
    try {
        res.json({
            success: true,
            schema: currentSchemaDetails // Return the cached schema details
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Endpoint to reset the database
app.post('/api/reset-db', async (req, res) => { // Added 'async'
    try {
        if (db) {
            db.close();
            console.log('Database connection closed for reset.');
        }
        initializeDatabase(); // Re-initialize
        fetchSchemaDetails(); // Re-fetch schema details after reset for AI context
        res.json({
            success: true,
            message: "Database reset successfully."
        });
    } catch (error) {
        console.error('Error during database reset:', error);
        res.status(500).json({
            success: false,
            error: "Failed to reset database: " + error.message
        });
    }
});


// Start the server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
//     console.log(`Frontend will typically run on http://localhost:5173 (Vite default)`);
// });
app.listen(PORT, '0.0.0.0', () => { // Changed here: added '0.0.0.0'
    console.log(`Server running on http://0.0.0.0:${PORT}`); // Log updated for clarity
    console.log(`Frontend will typically run on http://localhost:5173 (Vite default)`);
    console.log(`Access your backend API at: http://0.0.0.0:${PORT}/api/schema`); // Added for clarity
});
