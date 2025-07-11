// server/routes/courses.js
// const express = require('express');
// const Database = require('better-sqlite3');
// const path = require('path');
// const router = express.Router();

// const appDbPath = path.join(__dirname, '..', process.env.APP_DATABASE_FILE || 'app.db');
// const appDb = new Database(appDbPath); // Connect to the persistent app DB

// // Helper to convert DB rows to a consistent format
// const formatLesson = (row) => ({
//   id: row.id,
//   title: row.title,
//   duration: row.duration,
//   content: row.content,
//   practiceQuery: row.practiceQuery,
//   expectedResult: JSON.parse(row.expectedResult),
//   quiz: {
//     question: row.quizQuestion,
//     options: JSON.parse(row.quizOptions),
//     correctAnswer: row.quizCorrectAnswer
//   }
// });

// // Get all courses (simplified, will only return 'sql-basics' currently)
// router.get('/courses', (req, res) => {
//   try {
//     const row = appDb.prepare("SELECT * FROM courses WHERE id = 'sql-basics'").get();
//     if (!row) {
//       return res.status(404).json({ message: 'Course not found' });
//     }
//     res.json({
//       id: row.id,
//       title: row.title,
//       description: row.description,
//       totalLessons: row.totalLessons,
//       estimatedTime: row.estimatedTime,
//       difficulty: row.difficulty
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get all lessons for a specific course
// router.get('/courses/:courseId/lessons', (req, res) => {
//   const { courseId } = req.params;
//   try {
//     const rows = appDb.prepare("SELECT * FROM lessons WHERE course_id = ? ORDER BY id ASC").all(courseId);
//     res.json(rows.map(formatLesson));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get a single lesson by ID
// router.get('/lessons/:lessonId', (req, res) => {
//   const { lessonId } = req.params;
//   try {
//     const row = appDb.prepare("SELECT * FROM lessons WHERE id = ?").get(lessonId);
//     if (!row) {
//       return res.status(404).json({ message: 'Lesson not found' });
//     }
//     res.json(formatLesson(row));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
// server/routes/courses.js
// const express = require('express');
// const path = require('path'); // Keep if needed for path.join for other purposes

// Remove these lines:
// const Database = require('better-sqlite3');
// const appDbPath = path.join(__dirname, '..', process.env.APP_DATABASE_FILE || 'app.db');
// const appDb = new Database(appDbPath); // THIS LINE IS THE PROBLEM HERE

// Helper to convert DB rows to a consistent format (can stay here)
// const formatLesson = (row) => ({
//     id: row.id,
//     title: row.title,
//     duration: row.duration,
//     content: row.content,
//     practiceQuery: row.practiceQuery,
//     expectedResult: JSON.parse(row.expectedResult),
//     quiz: {
//         question: row.quizQuestion,
//         options: JSON.parse(row.quizOptions),
//         correctAnswer: row.quizCorrectAnswer
//     }
// });

// // Export a function that accepts appDb
// module.exports = (appDb) => { // <--- Router is now created inside this function
//     const router = express.Router();

//     // Get all courses (simplified, will only return 'sql-basics' currently)
//     router.get('/courses', (req, res) => {
//         try {
//             const row = appDb.prepare("SELECT * FROM courses WHERE id = 'sql-basics'").get();
//             if (!row) {
//                 return res.status(404).json({ message: 'Course not found' });
//             }
//             res.json({
//                 id: row.id,
//                 title: row.title,
//                 description: row.description,
//                 totalLessons: row.totalLessons,
//                 estimatedTime: row.estimatedTime,
//                 difficulty: row.difficulty
//             });
//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
//     });

//     // Get all lessons for a specific course
//     router.get('/courses/:courseId/lessons', (req, res) => {
//         const { courseId } = req.params;
//         try {
//             const rows = appDb.prepare("SELECT * FROM lessons WHERE course_id = ? ORDER BY id ASC").all(courseId);
//             res.json(rows.map(formatLesson));
//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
//     });

//     // Get a single lesson by ID
//     router.get('/lessons/:lessonId', (req, res) => {
//         const { lessonId } = req.params;
//         try {
//             const row = appDb.prepare("SELECT * FROM lessons WHERE id = ?").get(lessonId);
//             if (!row) {
//                 return res.status(404).json({ message: 'Lesson not found' });
//             }
//             res.json(formatLesson(row));
//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
//     });

//     return router; // <--- Return the router instance
// };
// server/routes/courses.js
// const express = require('express');
// const path = require('path'); // Keep if needed for path.join for other purposes

// module.exports = (appDb) => {
//     const router = express.Router();

//     // Helper to convert DB rows to a consistent format
//     const formatLesson = (row) => ({
//         id: row.id,
//         title: row.title,
//         duration: row.duration,
//         content: row.content,
//         practiceQuery: row.practiceQuery,
//         expectedResult: JSON.parse(row.expectedResult),
//         quiz: {
//             question: row.quizQuestion,
//             options: JSON.parse(row.quizOptions),
//             correctAnswer: row.quizCorrectAnswer
//         }
//     });

//     // Existing: Get all courses (simplified, will only return 'sql-basics' currently)
//     // This route handles GET /api/courses
//     router.get('/courses', (req, res) => {
//         try {
//             // For now, still returning only 'sql-basics' as a single item in an array
//             const row = appDb.prepare("SELECT * FROM courses WHERE id = 'sql-basics'").get();
//             if (!row) {
//                 return res.status(404).json({ message: 'No courses found' });
//             }
//             // Return as an array, as a "get all courses" endpoint typically would
//             res.json([{
//                 id: row.id,
//                 title: row.title,
//                 description: row.description,
//                 totalLessons: row.totalLessons,
//                 estimatedTime: row.estimatedTime,
//                 difficulty: row.difficulty
//             }]);
//         } catch (err) {
//             console.error('Error fetching all courses:', err.message);
//             res.status(500).json({ error: err.message });
//         }
//     });

//     // NEW ROUTE: Get a single course by ID
//     // This route handles GET /api/courses/:courseId
//     router.get('/courses/:courseId', (req, res) => {
//         const { courseId } = req.params;
//         try {
//             const row = appDb.prepare("SELECT * FROM courses WHERE id = ?").get(courseId);
//             if (!row) {
//                 return res.status(404).json({ message: 'Course not found' });
//             }
//             res.json({
//                 id: row.id,
//                 title: row.title,
//                 description: row.description,
//                 totalLessons: row.totalLessons,
//                 estimatedTime: row.estimatedTime,
//                 difficulty: row.difficulty
//             });
//         } catch (err) {
//             console.error(`Error fetching course ${courseId}:`, err.message);
//             res.status(500).json({ error: err.message });
//         }
//     });


//     // Existing: Get all lessons for a specific course
//     // This route handles GET /api/courses/:courseId/lessons
//     router.get('/courses/:courseId/lessons', (req, res) => {
//         const { courseId } = req.params;
//         try {
//             const rows = appDb.prepare("SELECT * FROM lessons WHERE course_id = ? ORDER BY id ASC").all(courseId);
//             res.json(rows.map(formatLesson));
//         } catch (err) {
//             console.error(`Error fetching lessons for course ${courseId}:`, err.message);
//             res.status(500).json({ error: err.message });
//         }
//     });

//     // Existing: Get a single lesson by ID
//     // This route handles GET /api/lessons/:lessonId
//     router.get('/lessons/:lessonId', (req, res) => {
//         const { lessonId } = req.params;
//         try {
//             const row = appDb.prepare("SELECT * FROM lessons WHERE id = ?").get(lessonId);
//             if (!row) {
//                 return res.status(404).json({ message: 'Lesson not found' });
//             }
//             res.json(formatLesson(row));
//         } catch (err) {
//             console.error(`Error fetching lesson ${lessonId}:`, err.message);
//             res.status(500).json({ error: err.message });
//         }
//     });

//     return router;
// };
// const express = require('express');

// module.exports = (appDb) => {
//     const router = express.Router();

//     // Format lesson rows consistently
//     const formatLesson = (row) => ({
//         id: row.id,
//         title: row.title,
//         duration: row.duration,
//         content: row.content,
//         practiceQuery: row.practiceQuery,
//         expectedResult: JSON.parse(row.expectedResult),
//         quiz: {
//             question: row.quizQuestion,
//             options: JSON.parse(row.quizOptions),
//             correctAnswer: row.quizCorrectAnswer
//         }
//     });

//     // Get all courses
//     router.get('/courses', (req, res) => {
//         try {
//             const row = appDb.prepare("SELECT * FROM courses WHERE id = 'sql-basics'").get();
//             if (!row) {
//                 return res.status(404).json({ message: 'No courses found' });
//             }

//             res.json([{
//                 id: row.id,
//                 title: row.title,
//                 description: row.description,
//                 totalLessons: row.totalLessons,
//                 estimatedTime: row.estimatedTime,
//                 difficulty: row.difficulty
//             }]);
//         } catch (err) {
//             console.error('Error fetching all courses:', err.message);
//             res.status(500).json({ error: err.message });
//         }
//     });

//     // Get a specific course by ID
//     router.get('/courses/:courseId', (req, res) => {
//         const { courseId } = req.params;
//         try {
//             const row = appDb.prepare("SELECT * FROM courses WHERE id = ?").get(courseId);
//             if (!row) {
//                 return res.status(404).json({ message: 'Course not found' });
//             }
//             res.json({
//                 id: row.id,
//                 title: row.title,
//                 description: row.description,
//                 totalLessons: row.totalLessons,
//                 estimatedTime: row.estimatedTime,
//                 difficulty: row.difficulty
//             });
//         } catch (err) {
//             console.error(`Error fetching course ${courseId}:`, err.message);
//             res.status(500).json({ error: err.message });
//         }
//     });

//     // Get all lessons for a specific course + user's completion status
//     router.get('/courses/:courseId/lessons', (req, res) => {
//         const { courseId } = req.params;
//         const userId = req.query.userId; // Get userId from query param

//         try {
//             const lessons = appDb.prepare("SELECT * FROM lessons WHERE course_id = ? ORDER BY id ASC").all(courseId);

//             let completedLessonIds = [];

//             if (userId) {
//                 const completedRows = appDb.prepare(`
//                     SELECT lesson_id FROM user_progress WHERE user_id = ?
//                 `).all(userId);
//                 completedLessonIds = completedRows.map(row => row.lesson_id);
//             }

//             const formatted = lessons.map(lesson => {
//                 const formattedLesson = formatLesson(lesson);
//                 formattedLesson.completed = completedLessonIds.includes(lesson.id);
//                 return formattedLesson;
//             });

//             res.json(formatted);
//         } catch (err) {
//             console.error(`Error fetching lessons for course ${courseId}:`, err.message);
//             res.status(500).json({ error: err.message });
//         }
//     });

//     // Get a specific lesson by lesson ID
//     router.get('/lessons/:lessonId', (req, res) => {
//         const { lessonId } = req.params;
//         try {
//             const row = appDb.prepare("SELECT * FROM lessons WHERE id = ?").get(lessonId);
//             if (!row) {
//                 return res.status(404).json({ message: 'Lesson not found' });
//             }
//             res.json(formatLesson(row));
//         } catch (err) {
//             console.error(`Error fetching lesson ${lessonId}:`, err.message);
//             res.status(500).json({ error: err.message });
//         }
//     });

//     return router;
// };

const express = require('express');

module.exports = (appDb) => {
    const router = express.Router();

    const formatLesson = (row) => ({
        id: row.id,
        title: row.title,
        duration: row.duration,
        content: row.content,
        practiceQuery: row.practiceQuery,
        expectedResult: JSON.parse(row.expectedResult),
        quiz: {
            question: row.quizQuestion,
            options: JSON.parse(row.quizOptions),
            correctAnswer: row.quizCorrectAnswer
        }
    });

    router.get('/courses', (req, res) => {
        try {
            const row = appDb.prepare("SELECT * FROM courses WHERE id = 'sql-basics'").get();
            if (!row) {
                return res.status(404).json({ message: 'No courses found' });
            }
            res.json([{
                id: row.id,
                title: row.title,
                description: row.description,
                totalLessons: row.totalLessons,
                estimatedTime: row.estimatedTime,
                difficulty: row.difficulty
            }]);
        } catch (err) {
            console.error('Error fetching all courses:', err.message);
            res.status(500).json({ error: err.message });
        }
    });

    router.get('/courses/:courseId', (req, res) => {
        const { courseId } = req.params;
        try {
            const row = appDb.prepare("SELECT * FROM courses WHERE id = ?").get(courseId);
            if (!row) {
                return res.status(404).json({ message: 'Course not found' });
            }
            res.json({
                id: row.id,
                title: row.title,
                description: row.description,
                totalLessons: row.totalLessons,
                estimatedTime: row.estimatedTime,
                difficulty: row.difficulty
            });
        } catch (err) {
            console.error(`Error fetching course ${courseId}:`, err.message);
            res.status(500).json({ error: err.message });
        }
    });

    router.get('/courses/:courseId/lessons', (req, res) => {
        const { courseId } = req.params;
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId in query' });
        }

        try {
            const lessons = appDb.prepare("SELECT * FROM lessons WHERE course_id = ? ORDER BY id ASC").all(courseId);
            const completedRows = appDb.prepare("SELECT lesson_id FROM user_progress WHERE user_id = ?").all(userId);
            const completedLessonIds = completedRows.map(row => row.lesson_id);

            const formatted = lessons.map(lesson => {
                const formattedLesson = formatLesson(lesson);
                formattedLesson.completed = completedLessonIds.includes(lesson.id);
                return formattedLesson;
            });

            res.json(formatted);
        } catch (err) {
            console.error(`Error fetching lessons for course ${courseId}:`, err.message);
            res.status(500).json({ error: err.message });
        }
    });

    router.get('/lessons/:lessonId', (req, res) => {
        const { lessonId } = req.params;
        try {
            const row = appDb.prepare("SELECT * FROM lessons WHERE id = ?").get(lessonId);
            if (!row) {
                return res.status(404).json({ message: 'Lesson not found' });
            }
            res.json(formatLesson(row));
        } catch (err) {
            console.error(`Error fetching lesson ${lessonId}:`, err.message);
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
