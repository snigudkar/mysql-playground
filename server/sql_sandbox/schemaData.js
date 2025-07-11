// // server/sql_sandbox/schemaData.js

// const mockSchemasAndData = {
//   1: { // Data for Lesson 1: Introduction to SQL
//     schema: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);`,
//     data: [
//       'employees', // Table name
//       ['id', 'name', 'department', 'salary'], // Columns
//       [
//         [1, "John Doe", "Engineering", 70000],
//         [2, "Jane Smith", "Marketing", 65000]
//       ]
//     ]
//   },
//   2: { // Data for Lesson 2: SELECT Statement
//     schema: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);`,
//     data: [
//       'employees',
//       ['id', 'name', 'department', 'salary'],
//       [
//         [1, "John Doe", "Engineering", 70000],
//         [2, "Jane Smith", "Marketing", 65000]
//       ]
//     ]
//   },
//   3: { // Data for Lesson 3: WHERE Clause
//     schema: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);`,
//     data: [
//       'employees',
//       ['id', 'name', 'department', 'salary'],
//       [
//         [1, "John Doe", "Engineering", 70000],
//         [2, "Jane Smith", "Marketing", 65000],
//         [3, "Alice Brown", "HR", 60000]
//       ]
//     ]
//   },
//   4: { // Data for Lesson 4: ORDER BY Clause
//     schema: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);`,
//     data: [
//       'employees',
//       ['id', 'name', 'department', 'salary'],
//       [
//         [1, "John Doe", "Engineering", 70000],
//         [2, "Jane Smith", "Marketing", 65000],
//         [3, "Alice Brown", "HR", 60000]
//       ]
//     ]
//   },
//   5: { // Data for Lesson 5: COUNT and GROUP BY
//     schema: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);`,
//     data: [
//       'employees',
//       ['id', 'name', 'department', 'salary'],
//       [
//         [1, "John Doe", "Engineering", 70000],
//         [2, "Jane Smith", "Marketing", 65000],
//         [3, "Alice Brown", "HR", 60000],
//         [4, "Bob Johnson", "Engineering", 72000],
//         [5, "Charlie Green", "Marketing", 68000]
//       ]
//     ]
//   },
// };

// function getLessonSchemaAndData(lessonId) {
//   return mockSchemasAndData[lessonId];
// }

// module.exports = { getLessonSchemaAndData };
// server/sql_sandbox/schemaData.js

// const mockSchemasAndData = {
//     1: { // Data for Lesson 1: Introduction to SQL
//         schema: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);`,
//         data: [
//             'employees', // Table name
//             ['id', 'name', 'department', 'salary'], // Columns
//             [
//                 [1, "John Doe", "Engineering", 70000],
//                 [2, "Jane Smith", "Marketing", 65000]
//             ]
//         ]
//     },
//     2: { // Data for Lesson 2: SELECT Statement
//         schema: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);`,
//         data: [
//             'employees',
//             ['id', 'name', 'department', 'salary'],
//             [
//                 [1, "John Doe", "Engineering", 70000],
//                 [2, "Jane Smith", "Marketing", 65000]
//             ]
//         ]
//     },
//     3: { // Data for Lesson 3: WHERE Clause
//         schema: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);`,
//         data: [
//             'employees',
//             ['id', 'name', 'department', 'salary'],
//             [
//                 [1, "John Doe", "Engineering", 70000],
//                 [2, "Jane Smith", "Marketing", 65000],
//                 [3, "Alice Brown", "HR", 60000]
//             ]
//         ]
//     },
//     4: { // Data for Lesson 4: ORDER BY Clause
//         schema: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);`,
//         data: [
//             'employees',
//             ['id', 'name', 'department', 'salary'],
//             [
//                 [1, "John Doe", "Engineering", 70000],
//                 [2, "Jane Smith", "Marketing", 65000],
//                 [3, "Alice Brown", "HR", 60000]
//             ]
//         ]
//     },
//     5: { // Data for Lesson 5: COUNT and GROUP BY
//         schema: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);`,
//         data: [
//             'employees',
//             ['id', 'name', 'department', 'salary'],
//             [
//                 [1, "John Doe", "Engineering", 70000],
//                 [2, "Jane Smith", "Marketing", 65000],
//                 [3, "Alice Brown", "HR", 60000],
//                 [4, "Bob Johnson", "Engineering", 72000],
//                 [5, "Charlie Green", "Marketing", 68000]
//             ]
//         ]
//     },
// };

// function getLessonSchemaAndData(lessonId) {
//     return mockSchemasAndData[lessonId];
// }

// module.exports = { getLessonSchemaAndData };
const mockSchemasAndData = {
    1: {
        schema: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);`,
        data: [
            'employees',
            ['id', 'name', 'department', 'salary'],
            [
                [1, "John Doe", "Engineering", 70000],
                [2, "Jane Smith", "Marketing", 65000]
            ]
        ],
        expectedResult: [ // Assuming a simple SELECT * for Lesson 1
            { id: 1, name: "John Doe", department: "Engineering", salary: 70000 },
            { id: 2, name: "Jane Smith", department: "Marketing", salary: 65000 }
        ]
    },
    2: {
        schema: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);`,
        data: [
            'employees',
            ['id', 'name', 'department', 'salary'],
            [
                [1, "John Doe", "Engineering", 70000],
                [2, "Jane Smith", "Marketing", 65000]
            ]
        ],
        expectedResult: [ // For SELECT name FROM employees
            { name: "John Doe" },
            { name: "Jane Smith" }
        ]
    },
    3: {
        schema: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);`,
        data: [
            'employees',
            ['id', 'name', 'department', 'salary'],
            [
                [1, "John Doe", "Engineering", 70000],
                [2, "Jane Smith", "Marketing", 65000],
                [3, "Alice Brown", "HR", 60000]
            ]
        ],
        expectedResult: [ // For SELECT * FROM employees WHERE salary > 65000
            { id: 1, name: "John Doe", department: "Engineering", salary: 70000 }
        ]
    },
    4: {
        schema: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);`,
        data: [
            'employees',
            ['id', 'name', 'department', 'salary'],
            [
                [1, "John Doe", "Engineering", 70000],
                [2, "Jane Smith", "Marketing", 65000],
                [3, "Alice Brown", "HR", 60000]
            ]
        ],
        expectedResult: [ // For SELECT * FROM employees ORDER BY salary ASC
            { id: 3, name: "Alice Brown", department: "HR", salary: 60000 },
            { id: 2, name: "Jane Smith", department: "Marketing", salary: 65000 },
            { id: 1, name: "John Doe", department: "Engineering", salary: 70000 }
        ]
    },
    5: {
        schema: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);`,
        data: [
            'employees',
            ['id', 'name', 'department', 'salary'],
            [
                [1, "John Doe", "Engineering", 70000],
                [2, "Jane Smith", "Marketing", 65000],
                [3, "Alice Brown", "HR", 60000],
                [4, "Bob Johnson", "Engineering", 72000],
                [5, "Charlie Green", "Marketing", 68000]
            ]
        ],
        expectedResult: [ // For SELECT department, COUNT(*) as count FROM employees GROUP BY department
            { department: "Engineering", count: 2 },
            { department: "Marketing", count: 2 },
            { department: "HR", count: 1 }
        ]
    },
};

function getLessonSchemaAndData(lessonId) {
    const lesson = mockSchemasAndData[lessonId];
    return {
        schema: lesson.schema,
        data: lesson.data,
        expectedResult: lesson.expectedResult || null
    };
}

module.exports = { getLessonSchemaAndData };
