// const express = require('express');

// module.exports = (appDb) => {
//   const router = express.Router();

//   // 🟣 Get user profile by UID (customer_id)
//   router.get('/user-profile/:uid', (req, res) => {
//     console.log('🔥 /user-profile route hit');
//     const userId = req.params.uid;

//     try {
//       const stmt = appDb.prepare(`
//         SELECT customer_id, email, first_name, last_name, join_date, streak, last_active
//         FROM Customers
//         WHERE customer_id = ?
//       `);

//       const user = stmt.get(userId);

//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       res.json({
//         uid: user.customer_id,
//         email: user.email,
//         displayName: `${user.first_name} ${user.last_name}`,
//         joinDate: user.join_date,
//         streak: user.streak || 0,
//         lastActive: user.last_active
//       });

//     } catch (err) {
//       console.error('❌ Error fetching user profile:', err.message);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

//   return router;
// };
// const express = require('express');

// module.exports = (appDb) => {
//   const router = express.Router();

//   router.get('/user-profile/:uid', (req, res) => {
//     const userId = req.params.uid;

//     const stmt = appDb.prepare(`
//       SELECT customer_id, email, first_name, last_name, join_date, streak, last_active
//       FROM Customers
//       WHERE customer_id = ?
//     `);

//     const user = stmt.get(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const progressStmt = appDb.prepare(`
//       SELECT 
//         COUNT(DISTINCT course_id) AS coursesCompleted,
//         COUNT(*) AS totalQueries,
//         ROUND(julianday('now') - julianday(MIN(completed_at))) AS streak
//       FROM user_progress
//       WHERE user_id = ?
//     `);
//     const progress = progressStmt.get(userId);

//     res.json({
//       uid: user.customer_id,
//       email: user.email,
//       displayName: `${user.first_name} ${user.last_name}`,
//       joinDate: user.join_date,
//       streak: Math.floor(progress?.streak) || 0,
//       totalQueries: progress?.totalQueries || 0,
//       coursesCompleted: progress?.coursesCompleted || 0,
//       achievements: [] // Update later with real data
//     });
//   });

//   return router;
// };


// const express = require('express');

// module.exports = (appDb) => {
//   const router = express.Router();

//   router.get('/user-profile/:uid', (req, res) => {
//     const userId = req.params.uid;

//     try {
//       const stmt = appDb.prepare(`
//         SELECT customer_id, email, first_name, last_name, join_date
//         FROM Customers
//         WHERE customer_id = ?
//       `);

//       const user = stmt.get(userId);

//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       const progressStmt = appDb.prepare(`
//         SELECT 
//           COUNT(DISTINCT course_id) AS coursesCompleted,
//           COUNT(*) AS totalQueries,
//           ROUND(julianday('now') - julianday(MIN(completed_at))) AS streak
//         FROM user_progress
//         WHERE user_id = ?
//       `);

//       const progress = progressStmt.get(userId);

//       res.json({
//         uid: user.customer_id,
//         email: user.email,
//         displayName: `${user.first_name} ${user.last_name}`,
//         joinDate: user.join_date,
//         streak: Math.floor(progress?.streak) || 0,
//         totalQueries: progress?.totalQueries || 0,
//         coursesCompleted: progress?.coursesCompleted || 0,
//         achievements: [] // Future enhancement
//       });

//     } catch (err) {
//       console.error("❌ Error fetching user profile:", err.message);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });

//   return router;
// };
// const express = require('express');

// module.exports = (appDb) => {
//   const router = express.Router();

//   // ✅ Fetch user profile using EMAIL instead of UID
//   router.get('/user-profile/:email', (req, res) => {
//     const email = req.params.email;
//     console.log("📩 Fetching profile for email:", email);

//     try {
//       // Get user details from Customers table
//       const user = appDb.prepare(`
//         SELECT customer_id, email, first_name, last_name, join_date
//         FROM Customers
//         WHERE email = ?
//       `).get(email);

//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       // Fetch user progress using customer_id
//       const progress = appDb.prepare(`
//         SELECT 
//           COUNT(DISTINCT course_id) AS coursesCompleted,
//           COUNT(*) AS totalQueries,
//           ROUND(julianday('now') - julianday(MIN(completed_at))) AS streak
//         FROM user_progress
//         WHERE user_id = ?
//       `).get(user.customer_id);

//       // Return combined profile
//       res.json({
//         uid: user.customer_id,
//         email: user.email,
//         displayName: `${user.first_name} ${user.last_name}`,
//         joinDate: user.join_date,
//         streak: Math.floor(progress?.streak) || 0,
//         totalQueries: progress?.totalQueries || 0,
//         coursesCompleted: progress?.coursesCompleted || 0,
//         achievements: [] // Placeholder
//       });

//     } catch (err) {
//       console.error("❌ Error fetching user profile:", err.message);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

//   return router;
// };

const express = require('express');

module.exports = (appDb) => {
  const router = express.Router();

router.get('/user-profile/:uid', (req, res) => {
  const firebaseUid = req.params.uid;

  console.log("📩 Fetching profile for UID:", firebaseUid);

  let user = appDb.prepare(`
    SELECT customer_id, first_name, last_name, email, join_date
    FROM Customers
    WHERE firebase_uid = ?
  `).get(firebaseUid);

  if (!user) {
    const now = new Date().toISOString().split('T')[0];

    const insert = appDb.prepare(`
      INSERT INTO Customers (first_name, last_name, email, join_date, firebase_uid)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = insert.run("First", "Last", firebaseUid + "@unknown.com", now, firebaseUid);

    user = {
      customer_id: result.lastInsertRowid,
      first_name: "First",
      last_name: "Last",
      email: firebaseUid + "@unknown.com",
      join_date: now,
    };

    console.log("✅ Inserted user for UID:", firebaseUid);
  }

  const progress = appDb.prepare(`
    SELECT 
      COUNT(DISTINCT course_id) AS coursesCompleted,
      COUNT(*) AS totalQueries,
      ROUND(julianday('now') - julianday(MIN(completed_at))) AS streak
    FROM user_progress
    WHERE user_id = ?
  `).get(user.customer_id);

  res.json({
    uid: user.customer_id,
    email: user.email,
    displayName: `${user.first_name} ${user.last_name}`,
    joinDate: user.join_date,
    streak: Math.floor(progress?.streak) || 0,
    totalQueries: progress?.totalQueries || 0,
    coursesCompleted: progress?.coursesCompleted || 0,
    achievements: []
  });
});

  return router;
};
