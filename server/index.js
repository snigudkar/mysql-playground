const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = process.env.DB_FILE || 'playground.db'; // SQLite database file name

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for frontend to access backend
app.use((req, res, next) => {
    // In a production environment, replace '*' with your actual frontend origin (e.g., 'http://localhost:5173')
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
        // If DB file exists, delete it for a clean start on each initialization
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
            console.log(`Deleted existing database file: ${DB_FILE}`);
        }

        // Open (or create) the SQLite database
        db = new Database(dbPath);
        console.log(`Database connected at ${DB_FILE}`);

        // Read and execute the schema.sql file
        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema);
        console.log('Database schema and data initialized successfully.');

        // For convenience, list tables and a few rows
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
        process.exit(1); // Exit if database initialization fails
    }
};

// Initialize the database when the server starts
initializeDatabase();

// Endpoint to execute SQL queries
app.post('/api/execute-sql', (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'SQL query is required.' });
    }

    try {
        let result;
        const statement = db.prepare(query);

        // Attempt to get results (for SELECT queries)
        // Check if the query is a SELECT, otherwise use .run() for DML/DDL
        if (query.trim().toUpperCase().startsWith('SELECT')) {
             result = statement.all();
        } else {
            // For INSERT, UPDATE, DELETE, CREATE TABLE, etc.
            result = statement.run();
        }

        res.json({
            success: true,
            results: result // This will be array of objects for SELECT, or { changes, lastInsertRowid } for DML
        });

    } catch (error) {
        // Catch SQL errors and send them back to the frontend
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Endpoint to get database schema (table names and columns)
app.get('/api/schema', (req, res) => {
    try {
        // Query to get table names
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").all();

        const schemaDetails = {};
        tables.forEach(table => {
            // Query to get column information for each table
            // PRAGMA table_info(table_name) returns column details
            const columns = db.prepare(`PRAGMA table_info('${table.name}')`).all();
            schemaDetails[table.name] = columns.map(col => ({
                name: col.name,
                type: col.type,
                notnull: col.notnull,
                pk: col.pk
            }));
        });

        res.json({
            success: true,
            schema: schemaDetails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Endpoint to reset the database
app.post('/api/reset-db', (req, res) => {
    try {
        // It's good practice to ensure the database is closed before deleting/re-initializing
        if (db) {
            db.close();
            console.log('Database connection closed for reset.');
        }
        initializeDatabase(); // Re-initialize
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
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Frontend will typically run on http://localhost:5173 (Vite default)`);
});