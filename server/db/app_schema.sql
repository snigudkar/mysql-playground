

CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  totalLessons INTEGER,
  estimatedTime TEXT,
  difficulty TEXT
);

CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY,
  course_id TEXT,
  title TEXT NOT NULL,
  duration TEXT,
  content TEXT,
  practiceQuery TEXT,
  expectedResult TEXT, -- Stored as JSON string
  quizQuestion TEXT,
  quizOptions TEXT, -- Stored as JSON string
  quizCorrectAnswer INTEGER,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS user_progress (
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id INTEGER NOT NULL,
  completed_at TEXT,
  xp_gained INTEGER,
  quiz_score INTEGER,
  quiz_attempts INTEGER,
  PRIMARY KEY (user_id, course_id, lesson_id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Initial Course Data (if not already present)
INSERT OR IGNORE INTO courses (id, title, description, totalLessons, estimatedTime, difficulty)
VALUES ('sql-basics', 'SQL Basics', 'Learn the fundamentals of SQL from scratch', 5, '2 hours', 'Beginner');

-- Initial Lessons Data (ensure these match your react frontend's expectations for now)
INSERT OR IGNORE INTO lessons (id, course_id, title, duration, content, practiceQuery, expectedResult, quizQuestion, quizOptions, quizCorrectAnswer) VALUES
(1, 'sql-basics', 'Introduction to SQL', '15 min', '<h3 class="text-xl font-bold text-white mb-4">What is SQL?</h3><p class="text-gray-300 mb-4">SQL (Structured Query Language) is a programming language designed for managing and manipulating relational databases. It allows you to:</p><ul class="text-gray-300 space-y-2 mb-6"><li>• Retrieve data from databases</li><li>• Insert, update, and delete records</li><li>• Create and modify database structure</li><li>• Control access to data</li></ul><p class="text-gray-300 mb-4">Let''s start with the most basic SQL command - SELECT. The SELECT statement is used to retrieve data from a database table.</p><div class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4"><h4 class="text-green-400 font-semibold mb-2">Basic SELECT Syntax:</h4><code class="text-blue-400">SELECT column1, column2 FROM table_name;</code></div>', 'SELECT * FROM employees;', '[{"id":1,"name":"John Doe","department":"Engineering","salary":70000},{"id":2,"name":"Jane Smith","department":"Marketing","salary":65000}]', 'What does SQL stand for?', '["Structured Query Language","Simple Query Language","Standard Query Language","System Query Language"]', 0),
(2, 'sql-basics', 'SELECT Statement', '20 min', '<h3 class="text-xl font-bold text-white mb-4">The SELECT Statement</h3><p class="text-gray-300 mb-4">The SELECT statement is used to select data from a database. The basic syntax is:</p><div class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4"><code class="text-blue-400">SELECT column1, column2 FROM table_name;</code></div><p class="text-gray-300 mb-4">You can also select all columns using the asterisk (*) wildcard:</p><div class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4"><code class="text-blue-400">SELECT * FROM table_name;</code></div><p class="text-gray-300 mb-4">Try the example below to see specific columns from our employee database:</p>', 'SELECT name, department FROM employees;', '[{"name":"John Doe","department":"Engineering"},{"name":"Jane Smith","department":"Marketing"}]', 'Which symbol is used to select all columns in a SELECT statement?', '["#","*","&","%"]', 1),
(3, 'sql-basics', 'WHERE Clause', '25 min', '<h3 class="text-xl font-bold text-white mb-4">Filtering with WHERE</h3><p class="text-gray-300 mb-4">The WHERE clause is used to filter records based on specific conditions. It allows you to retrieve only the data that meets certain criteria.</p><div class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4"><code class="text-blue-400">SELECT * FROM table_name WHERE condition;</code></div><p class="text-gray-300 mb-4">Common operators include:</p><ul class="text-gray-300 space-y-2 mb-6"><li>• = (equal to)</li><li>• > (greater than)</li><li>• < (less than)</li><li>• >= (greater than or equal to)</li><li>• <= (less than or equal to)</li><li>• != or <> (not equal to)</li></ul>', 'SELECT * FROM employees WHERE salary > 65000;', '[{"id":1,"name":"John Doe","department":"Engineering","salary":70000}]', 'Which operator is used to filter records that are NOT equal to a value?', '["=","!", "!=", "<="]', 2),
(4, 'sql-basics', 'ORDER BY Clause', '20 min', '<h3 class="text-xl font-bold text-white mb-4">Sorting Results with ORDER BY</h3><p class="text-gray-300 mb-4">The ORDER BY clause is used to sort the result set by one or more columns. By default, it sorts in ascending order (ASC).</p><div class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4"><code class="text-blue-400">SELECT * FROM table_name ORDER BY column_name;</code></div><p class="text-300 mb-4">You can also sort in descending order using DESC:</p><div class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4"><code class="text-blue-400">SELECT * FROM table_name ORDER BY column_name DESC;</code></div><p class="text-gray-300 mb-4">Try sorting employees by salary in descending order:</p>', 'SELECT * FROM employees ORDER BY salary DESC;', '[{"id":1,"name":"John Doe","department":"Engineering","salary":70000},{"id":2,"name":"Jane Smith","department":"Marketing","salary":65000}]', 'What keyword is used to sort results in descending order?', '["DOWN","DESC","DESCENDING","REVERSE"]', 1),
(5, 'sql-basics', 'COUNT and GROUP BY', '30 min', '<h3 class="text-xl font-bold text-white mb-4">Aggregation Functions</h3><p class="text-gray-300 mb-4">SQL provides several built-in functions to perform calculations on data:</p><ul class="text-gray-300 space-y-2 mb-6"><li>• COUNT() - counts the number of rows</li><li>• SUM() - calculates the sum of values</li><li>• AVG() - calculates the average value</li><li>• MAX() - finds the maximum value</li><li>• MIN() - finds the minimum value</li></ul><div class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4"><code class="text-blue-400">SELECT COUNT(*) FROM employees;</code></div><p class="text-gray-300 mb-4">GROUP BY is used to group rows that have the same values in specified columns:</p><div class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4"><code class="text-blue-400">SELECT department, COUNT(*) FROM employees GROUP BY department;</code></div>', 'SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department;', '[{"department":"Engineering","employee_count":1},{"department":"Marketing","employee_count":1}]', 'Which function is used to count the number of rows?', '["SUM()","COUNT()","TOTAL()","NUM()"]', 1);

-- Initial User Progress (for a mock user, adjust 'user123' as needed)
INSERT OR IGNORE INTO user_progress (user_id, course_id, lesson_id, completed_at, xp_gained, quiz_score, quiz_attempts) VALUES
('user123', 'sql-basics', 1, DATETIME('now'), 30, 100, 1),
('user123', 'sql-basics', 2, DATETIME('now'), 30, 100, 1);
-- INSERT OR IGNORE INTO lessons (
--   id, course_id, title, duration, content, practiceQuery, expectedResult,
--   quizQuestion, quizOptions, quizCorrectAnswer
-- )
-- VALUES (
--   1, 'sql-basics', 'Intro', '10 min',
--   'Simple content', 'SELECT 1;', '[{"result":1}]',
--   'What is SQL?', '["A", "B", "C", "D"]', 0
-- );
