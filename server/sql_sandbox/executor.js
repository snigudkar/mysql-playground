// // server/sql_sandbox/executor.js
// const Database = require('better-sqlite3');
// const { getLessonSchemaAndData } = require('./schemaData');

// function executeSandboxQuery(userQuery, lessonId) {
//   // 1. Create a new, in-memory database for each query
//   // This is crucial for security - users cannot affect your main app.db
//   const sandboxDb = new Database(':memory:');

//   // Use a try-finally block to ensure the sandbox DB is closed
//   try {
//     // 2. Get the schema and data for the specific lesson's practice exercise
//     const { schema, data } = getLessonSchemaAndData(lessonId);

//     if (!schema || !data) {
//       return { error: 'No practice data found for this lesson.' };
//     }

//     // 3. Create tables in the in-memory database
//     sandboxDb.exec(schema);

//     // 4. Insert data into the in-memory database
//     // This assumes 'data' is an array of [tableName, columnsArray, valuesArray]
//     const insertStmt = sandboxDb.prepare(`INSERT INTO ${data[0]} (${data[1].join(', ')}) VALUES (${data[1].map(() => '?').join(', ')})`);
//     data[2].forEach(row => {
//       insertStmt.run(row);
//     });

//     // 5. Execute the user's query
//     // IMPORTANT: Use .all for SELECT, .run for DML (INSERT, UPDATE, DELETE)
//     const queryType = userQuery.trim().toUpperCase().startsWith('SELECT') ? 'all' : 'run';

//     const statement = sandboxDb.prepare(userQuery);
//     let result;
//     if (queryType === 'all') {
//       result = statement.all();
//     } else {
//       result = statement.run();
//     }

//     // Filter out internal SQLite columns like 'rowid' if any
//     const cleanResult = Array.isArray(result) ? result.map(row => {
//         const cleaned = {};
//         for (const key in row) {
//             if (!key.startsWith('sqlite_')) {
//                 cleaned[key] = row[key];
//             }
//         }
//         return cleaned;
//     }) : result;

//     return { result: cleanResult };

//   } catch (err) {
//     // Return actual SQL error messages to the user for learning
//     return { error: `SQL Error: ${err.message}` };
//   } finally {
//     sandboxDb.close(); // Close the in-memory DB immediately after use
//   }
// }

// module.exports = { executeSandboxQuery };
const Database = require('better-sqlite3');
const { getLessonSchemaAndData } = require('./schemaData'); // This import is crucial

/**
 * Executes a user-provided SQL query against a temporary, in-memory SQLite database.
 * This ensures queries are isolated and cannot affect the main application database.
 *
 * @param {string} userQuery The SQL query provided by the user.
 * @param {number} lessonId The ID of the current lesson, used to fetch specific schema and data.
 * @returns {{result?: any, error?: string}} An object containing either the query result or an error message.
 */
function executeSandboxQuery(userQuery, lessonId) {
    // 1. Create a new, in-memory database for each query
    // This is crucial for security - users cannot affect your main app.db
    const sandboxDb = new Database(':memory:');

    // Use a try-finally block to ensure the sandbox DB is closed
    try {
        // 2. Get the schema and data for the specific lesson's practice exercise
        const { schema, data } = getLessonSchemaAndData(lessonId); // This function call should now work

        if (!schema || !data) {
            return { error: 'No practice data found for this lesson, or schema/data is incomplete.' };
        }

        // 3. Create tables in the in-memory database
        sandboxDb.exec(schema);

        // 4. Insert data into the in-memory database
        if (!Array.isArray(data) || data.length < 3 || !Array.isArray(data[1]) || !Array.isArray(data[2])) {
            return { error: 'Invalid data format for sandbox initialization.' };
        }

        const tableName = data[0];
        const columns = data[1];
        const values = data[2];

        if (columns.length === 0 || values.length === 0) {
            // No data to insert, or schema is just for table creation
            // This might be valid for some lessons, so don't error out, just skip insert.
        } else {
            const placeholders = columns.map(() => '?').join(', ');
            const insertStmt = sandboxDb.prepare(`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`);
            values.forEach(row => {
                insertStmt.run(row);
            });
        }

        // 5. Execute the user's query
        const queryType = userQuery.trim().toUpperCase().startsWith('SELECT') ? 'all' : 'run';

        const statement = sandboxDb.prepare(userQuery);
        let result;
        if (queryType === 'all') {
            result = statement.all();
        } else {
            result = statement.run();
        }

        // Filter out internal SQLite columns like 'rowid' if any
        const cleanResult = Array.isArray(result) ? result.map(row => {
            const cleaned = {};
            for (const key in row) {
                if (!key.startsWith('sqlite_')) {
                    cleaned[key] = row[key];
                }
            }
            return cleaned;
        }) : result;

        return { result: cleanResult };

    } catch (err) {
        // Return actual SQL error messages to the user for learning
        return { error: `SQL Error: ${err.message}` };
    } finally {
        sandboxDb.close(); // Close the in-memory DB immediately after use
    }
}

module.exports = { executeSandboxQuery };
