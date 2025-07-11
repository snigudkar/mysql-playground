// // server/routes/userProgress.js
// const express = require('express');
// const Database = require('better-sqlite3');
// const path = require('path');
// const router = express.Router();

// const appDbPath = path.join(__dirname, '..', process.env.APP_DATABASE_FILE || 'app.db');
// const appDb = new Database(appDbPath); // Connect to the persistent app DB

// // Mock user ID (replace with actual authentication later)
// const MOCK_USER_ID = "user123";

// // Get user progress for a specific course
// router.get('/user-progress/:courseId', (req, res) => {
//   const { courseId } = req.params;
//   const userId = MOCK_USER_ID; // In a real app, you'd get user_id from req.user (after auth middleware)

//   try {
//     const rows = appDb.prepare(
//       `SELECT lesson_id, completed_at, xp_gained, quiz_score, quiz_attempts
//        FROM user_progress
//        WHERE user_id = ? AND course_id = ?`
//     ).all(userId, courseId);

//     // Calculate total XP and completed lessons for the mock user
//     let totalXP = 0;
//     const completedLessons = [];
//     const quizResults = {};

//     rows.forEach(row => {
//       totalXP += row.xp_gained || 0;
//       completedLessons.push(row.lesson_id);
//       quizResults[row.lesson_id] = {
//         score: row.quiz_score,
//         attempts: row.quiz_attempts
//       };
//     });

//     res.json({
//       userId: userId,
//       courseId: courseId,
//       completedLessons: completedLessons,
//       totalXP: totalXP,
//       streak: 5, // Hardcoded for simplicity
//       quizResults: quizResults
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update user progress (e.g., after completing a lesson/quiz)
// router.post('/user-progress', (req, res) => {
//   const { courseId, lessonId, xpGained, quizScore, quizAttempts } = req.body;
//   const userId = MOCK_USER_ID; // In a real app, you'd get user_id from req.user (after auth middleware)
//   const completedAt = new Date().toISOString();

//   try {
//     const stmt = appDb.prepare(
//       `INSERT OR REPLACE INTO user_progress
//        (user_id, course_id, lesson_id, completed_at, xp_gained, quiz_score, quiz_attempts)
//        VALUES (?, ?, ?, ?, ?, ?, ?)`
//     );
//     const info = stmt.run(userId, courseId, lessonId, completedAt, xpGained, quizScore, quizAttempts);

//     res.status(200).json({ message: 'Progress updated successfully!', changes: info.changes });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
// server/routes/userProgress.js

// const express = require('express');
// const path = require('path'); // Still needed for path.join if you use it for other purposes in the routes

// // Remove these lines:
// // const Database = require('better-sqlite3');
// // const appDbPath = path.join(__dirname, '..', process.env.APP_DATABASE_FILE || 'app.db');
// // const appDb = new Database(appDbPath); // THIS LINE IS THE PROBLEM HERE

// // Mock user ID (can remain here, or be passed from middleware later)
// const MOCK_USER_ID = "user123";

// // Export a function that accepts appDb
// module.exports = (appDb) => { // <--- Router is now created inside this function
//     const router = express.Router();

//     // Helper to get user's current progress summary (moved inside the function to use appDb)
//     // This function was previously in index.js, but your latest userProgress.js has it
//     // I'll put it here, assuming it's meant to be used by the summary endpoint.
//     async function getUserSummaryData(userId, courseId) {
//         const rows = appDb.prepare(
//             `SELECT lesson_id, completed_at, xp_gained, quiz_score, quiz_attempts
//              FROM user_progress
//              WHERE user_id = ? AND course_id = ?`
//         ).all(userId, courseId);

//         let totalXP = 0;
//         const completedLessons = [];
//         const quizResults = {};

//         rows.forEach(row => {
//             totalXP += row.xp_gained || 0;
//             completedLessons.push(row.lesson_id);
//             quizResults[row.lesson_id] = {
//                 score: row.quiz_score,
//                 attempts: row.quiz_attempts
//             };
//         });

//         // Fetch total lessons for the course (if courses table is in app.db)
//         let totalCoursesLessons = 0;
//         try {
//             const courseInfo = appDb.prepare("SELECT totalLessons FROM courses WHERE id = ?").get(courseId);
//             totalCoursesLessons = courseInfo ? courseInfo.totalLessons : 0;
//         } catch (e) {
//             console.warn(`Could not fetch totalLessons for course ${courseId}:`, e.message);
//         }


//         return {
//             userId: userId,
//             courseId: courseId,
//             completedLessons: completedLessons,
//             totalXP: totalXP,
//             streak: 5, // Hardcoded for simplicity, implement streak logic later
//             quizResults: quizResults,
//             coursesCompleted: completedLessons.length > 0 ? 1 : 0, // Simplified: 1 if any lesson completed, 0 otherwise
//             totalCourses: 1, // Currently only 1 course ('sql-basics')
//             totalQueries: 0 // This would need to be tracked, for now mock
//         };
//     }


//     // NEW: Get user summary data for homepage/profile
//     router.get('/user/:userId/summary', async (req, res) => {
//       const userId = MOCK_USER_ID; // Using mock for now
//       const courseId = 'sql-basics'; // Assuming we're summarizing for this course

//       try {
//         const summary = await getUserSummaryData(userId, courseId);
//         res.json(summary);
//       } catch (err) {
//         console.error('Error fetching user summary:', err.message);
//         res.status(500).json({ error: err.message });
//       }
//     });

//     // NEW: Get user achievements (mocked for now)
//     router.get('/user/:userId/achievements', (req, res) => {
//       const userId = MOCK_USER_ID; // Using mock for now

//       const achievements = [
//         { id: 1, name: "First Query", description: "Executed your first SQL query", icon: "🎯", earnedAt: "2024-01-16" },
//         { id: 2, name: "Week Warrior", description: "7 days learning streak", icon: "🔥", earnedAt: "2024-01-22" },
//         { id: 3, name: "Join Master", description: "Completed all JOIN lessons", icon: "🔗", earnedAt: "2024-01-28" },
//         { id: 4, name: "Query Expert", description: "Executed 100+ queries", icon: "⚡", earnedAt: "2024-02-01" },
//       ];
//       res.json(achievements);
//     });

//     // NEW: Get user recent activity (mocked for now)
//     router.get('/user/:userId/activity', (req, res) => {
//       const userId = MOCK_USER_ID; // Using mock for now

//       const recentActivity = [
//         { action: "Completed 'Advanced JOINs' lesson", time: "2 hours ago" },
//         { action: "Executed 8 queries in playground", time: "1 day ago" },
//         { action: "Earned 'Week Warrior' badge", time: "3 days ago" },
//         { action: "Started 'SQL Basics' course", time: "1 week ago" },
//       ];
//       res.json(recentActivity);
//     });

//     // NEW: Get user learning goals (mocked for now)
//     router.get('/user/:userId/goals', (req, res) => {
//       const userId = MOCK_USER_ID; // Using mock for now

//       const learningGoals = {
//         weeklyLessons: { current: 5, target: 7 },
//         monthlyQueries: { current: 45, target: 60 }
//       };
//       res.json(learningGoals);
//     });

//     // Existing: Get user progress for a specific course
//     router.get('/user-progress/:courseId', async (req, res) => {
//       const { courseId } = req.params;
//       const userId = MOCK_USER_ID; // Using mock for now

//       try {
//         const progress = await getUserSummaryData(userId, courseId); // Re-use helper
//         res.json(progress);
//       } catch (err) {
//         console.error('Error fetching user progress:', err.message);
//         res.status(500).json({ error: err.message });
//       }
//     });

//     // Existing: Update user progress (e.g., after completing a lesson/quiz)
//     router.post('/user-progress', (req, res) => {
//       const { courseId, lessonId, xpGained, quizScore, quizAttempts } = req.body;
//       const userId = MOCK_USER_ID; // In a real app, you'd get user_id from req.user (after auth middleware)
//       const completedAt = new Date().toISOString();

//       try {
//         const stmt = appDb.prepare(
//           `INSERT OR REPLACE INTO user_progress
//            (user_id, course_id, lesson_id, completed_at, xp_gained, quiz_score, quiz_attempts)
//            VALUES (?, ?, ?, ?, ?, ?, ?)`
//         );
//         const info = stmt.run(userId, courseId, lessonId, completedAt, xpGained, quizScore, quizAttempts);

//         res.status(200).json({ message: 'Progress updated successfully!', changes: info.changes });
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
//     });

//     return router; // <--- Return the router instance
// };
// // server/routes/userProgress.js (ABSOLUTE BARE MINIMUM FOR DEBUGGING)
// // const express = require('express'); // This must be here

// // module.exports = (appDb) => {
// //     const router = express.Router();

// //     // A single, simple test route that does NOT interact with the database
// //     router.get('/test-minimal-user-progress', (req, res) => {
// //         res.send('Minimal User Progress Router Test OK!');
// //     });

// //     console.log('User Progress Router successfully created and returning router.'); // Add this for confirmation
// //     return router; // This MUST be the last line executed in the function
// // };
const express = require('express');

module.exports = (appDb) => {
    const router = express.Router();

    router.get('/user-progress/:courseId', (req, res) => {
        const { courseId } = req.params;
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId in query' });
        }

        try {
            const rows = appDb.prepare(
                `SELECT lesson_id, completed_at, xp_gained, quiz_score, quiz_attempts
                 FROM user_progress
                 WHERE user_id = ? AND course_id = ?`
            ).all(userId, courseId);

            const progress = {
                completedLessons: rows.map(r => r.lesson_id),
                totalXP: rows.reduce((acc, r) => acc + (r.xp_gained || 0), 0),
                quizResults: Object.fromEntries(rows.map(r => [r.lesson_id, { score: r.quiz_score, attempts: r.quiz_attempts }]))
            };

            res.json(progress);
        } catch (err) {
            console.error('Error fetching user progress:', err.message);
            res.status(500).json({ error: err.message });
        }
    });

    // router.post('/user-progress', (req, res) => {
    //     const { courseId, lessonId, xpGained, quizScore, quizAttempts, userId } = req.body;

    //     if (!userId) {
    //         return res.status(400).json({ error: 'Missing userId in request body' });
    //     }

    //     const completedAt = new Date().toISOString();

    //     try {
    //         const stmt = appDb.prepare(
    //             `INSERT OR REPLACE INTO user_progress
    //              (user_id, course_id, lesson_id, completed_at, xp_gained, quiz_score, quiz_attempts)
    //              VALUES (?, ?, ?, ?, ?, ?, ?)`
    //         );
    //         const info = stmt.run(userId, courseId, lessonId, completedAt, xpGained, quizScore, quizAttempts);
    //         res.status(200).json({ message: 'Progress updated successfully!', changes: info.changes });
    //     } catch (err) {
    //         res.status(500).json({ error: err.message });
    //     }
    // });
router.post('/user-progress', (req, res) => {
  console.log('🧾 Received Body:', req.body);  // ✅ Print incoming data

  const { courseId, lessonId, xpGained, quizScore, quizAttempts, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId in request body' });
  }

  const completedAt = new Date().toISOString();

  try {
    const stmt = appDb.prepare(
      `INSERT OR REPLACE INTO user_progress
       (user_id, course_id, lesson_id, completed_at, xp_gained, quiz_score, quiz_attempts)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );

    const info = stmt.run(userId, courseId, lessonId, completedAt, xpGained, quizScore, quizAttempts);

    res.status(200).json({ message: 'Progress updated successfully!', changes: info.changes });
  } catch (err) {
    console.error('🔥 INSERT FAILED:', err.message);  // ✅ See DB failure reason
    res.status(500).json({ error: err.message });
  }
});

    return router;
};
