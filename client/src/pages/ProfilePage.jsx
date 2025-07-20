// // client/src/pages/ProfilePage.jsx
// import React, { useState } from 'react';
// import { User, Award, BookOpen, Code, Play, Check, Lock, Calendar, Target, TrendingUp, Database, Clock, Star, Sun, Moon } from 'lucide-react';

// const ProfilePage = () => {
//   // Removed useTheme and darkMode state, hardcoding dark theme
//   const user = useState({
//     name: "Alex Johnson",
//     email: "alex@example.com",
//     joinDate: "2024-01-15",
//     streak: 7,
//     totalQueries: 127,
//     coursesCompleted: 3,
//     totalCourses: 5,
//     achievements: [
//       { id: 1, name: "First Query", description: "Executed your first SQL query", icon: "🎯", earnedAt: "2024-01-16" },
//       { id: 2, name: "Week Warrior", description: "7 days learning streak", icon: "🔥", earnedAt: "2024-01-22" },
//       { id: 3, name: "Join Master", description: "Completed all JOIN lessons", icon: "🔗", earnedAt: "2024-01-28" },
//       { id: 4, name: "Query Expert", description: "Executed 100+ queries", icon: "⚡", earnedAt: "2024-02-01" },
//     ],
//     recentActivity: [
//       { action: "Completed 'Advanced JOINs' lesson", time: "2 hours ago" },
//       { action: "Executed 8 queries in playground", time: "1 day ago" },
//       { action: "Earned 'Week Warrior' badge", time: "3 days ago" },
//       { action: "Started 'SQL Basics' course", time: "1 week ago" },
//     ],
//     learningGoals: {
//       weeklyLessons: { current: 5, target: 7 },
//       monthlyQueries: { current: 45, target: 60 }
//     }
//   })[0]; // Use [0] to get the state value directly

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       {/* Header */}
//       <div className="shadow-sm border-b border-gray-700 bg-gray-800">
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <div className="flex items-center gap-4">
//             <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//               <User className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-white">{user.name}</h1>
//               <p className="text-gray-400">{user.email}</p>
//               <p className="text-sm text-gray-500">
//                 Member since {new Date(user.joinDate).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Stats & Goals */}
//           <div className="lg:col-span-1 space-y-6">
//             {/* Quick Stats */}
//             <div className="rounded-lg shadow p-6 bg-gray-800">
//               <h2 className="text-lg font-semibold mb-4 text-white">Quick Stats</h2>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-blue-500">{user.streak}</div>
//                   <div className="text-sm text-gray-400">Day Streak</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-green-500">{user.totalQueries}</div>
//                   <div className="text-sm text-gray-400">Total Queries</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-purple-500">{user.coursesCompleted}</div>
//                   <div className="text-sm text-gray-400">Courses Done</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-orange-500">{user.achievements.length}</div>
//                   <div className="text-sm text-gray-400">Achievements</div>
//                 </div>
//               </div>
//             </div>

//             {/* Learning Goals */}
//             <div className="rounded-lg shadow p-6 bg-gray-800">
//               <h2 className="text-lg font-semibold mb-4 text-white">Learning Goals</h2>
//               <div className="space-y-4">
//                 <div>
//                   <div className="flex justify-between text-sm mb-2 text-gray-300">
//                     <span>Weekly Lessons</span>
//                     <span>{user.learningGoals.weeklyLessons.current}/{user.learningGoals.weeklyLessons.target}</span>
//                   </div>
//                   <div className="w-full rounded-full h-2 bg-gray-700">
//                     <div
//                       className="bg-blue-500 h-2 rounded-full transition-all duration-300"
//                       style={{ width: `${(user.learningGoals.weeklyLessons.current / user.learningGoals.weeklyLessons.target) * 100}%` }}
//                     ></div>
//                   </div>
//                 </div>
//                 <div>
//                   <div className="flex justify-between text-sm mb-2 text-gray-300">
//                     <span>Monthly Queries</span>
//                     <span>{user.learningGoals.monthlyQueries.current}/{user.learningGoals.monthlyQueries.target}</span>
//                   </div>
//                   <div className="w-full rounded-full h-2 bg-gray-700">
//                     <div
//                       className="bg-green-500 h-2 rounded-full transition-all duration-300"
//                       style={{ width: `${(user.learningGoals.monthlyQueries.current / user.learningGoals.monthlyQueries.target) * 100}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Achievements & Activity */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Achievements */}
//             <div className="rounded-lg shadow p-6 bg-gray-800">
//               <h2 className="text-lg font-semibold mb-4 text-white">Achievements</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {user.achievements.map(achievement => (
//                   <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-700">
//                     <div className="text-2xl">{achievement.icon}</div>
//                     <div className="flex-1">
//                       <div className="font-medium text-white">{achievement.name}</div>
//                       <div className="text-sm text-gray-400">{achievement.description}</div>
//                       <div className="text-xs mt-1 text-gray-500">
//                         Earned {new Date(achievement.earnedAt).toLocaleDateString()}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Recent Activity */}
//             <div className="rounded-lg shadow p-6 bg-gray-800">
//               <h2 className="text-lg font-semibold mb-4 text-white">Recent Activity</h2>
//               <div className="space-y-3">
//                 {user.recentActivity.map((activity, index) => (
//                   <div key={index} className="flex items-center gap-3 p-3 border-l-4 border-blue-500 bg-blue-900/20">
//                     <div className="flex-1">
//                       <div className="text-sm text-gray-300">{activity.action}</div>
//                       <div className="text-xs text-gray-500">{activity.time}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

//shreyas changes

// import React, { useEffect, useState } from 'react';
// import { User } from 'lucide-react';
// import useAuth from '../hooks/useAuth';

// const ProfilePage = () => {
//   const { user, isLoggedIn, isAuthReady } = useAuth();
//   const [profileData, setProfileData] = useState(null);

//   // useEffect(() => {
//   //   if (isAuthReady && user?.uid) {
//   //     // fetch(`http://localhost:5000/api/user-profile/${user.uid}`)
//   //     fetch(`http://localhost:5000/api/user-profile/${user.uid}`)
//   //       .then((res) => res.json())
//   //       .then((data) => setProfileData(data))
//   //       .catch((err) => console.error("Error fetching user profile:", err));
//   //   }
//   // }, [isAuthReady, user]);
//   useEffect(() => {
//   if (isAuthReady && user?.email) {
//     fetch(`http://localhost:5000/api/user-profile/${user.email}`)
//       .then((res) => res.json())
//       .then((data) => setProfileData(data))
//       .catch((err) => console.error("Error fetching user profile:", err));
//   }
// }, [isAuthReady, user]);


//   if (!isAuthReady) return <div className="text-white">Checking login...</div>;
//   if (!isLoggedIn) return <div className="text-white">Please log in to view your profile.</div>;
//   if (!profileData) return <div className="text-white">Loading profile data...</div>;

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <div className="shadow-sm border-b border-gray-700 bg-gray-800">
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <div className="flex items-center gap-4">
//             <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//               <User className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-white">{user.displayName || "User"}</h1>
//               <p className="text-gray-400">{user.email}</p>
//               <p className="text-sm text-gray-500">
//                 Member since {new Date(profileData.joinDate).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Stats */}
//           <div className="lg:col-span-1 space-y-6">
//             <div className="rounded-lg shadow p-6 bg-gray-800">
//               <h2 className="text-lg font-semibold mb-4 text-white">Quick Stats</h2>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-blue-500">{profileData.streak}</div>
//                   <div className="text-sm text-gray-400">Day Streak</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-green-500">{profileData.totalQueries}</div>
//                   <div className="text-sm text-gray-400">Total Queries</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-purple-500">{profileData.coursesCompleted}</div>
//                   <div className="text-sm text-gray-400">Courses Done</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-orange-500">{profileData.achievements?.length || 0}</div>
//                   <div className="text-sm text-gray-400">Achievements</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Achievements */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="rounded-lg shadow p-6 bg-gray-800">
//               <h2 className="text-lg font-semibold mb-4 text-white">Achievements</h2>
//               {profileData.achievements?.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {profileData.achievements.map((achievement) => (
//                     <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-700">
//                       <div className="text-2xl">{achievement.icon}</div>
//                       <div className="flex-1">
//                         <div className="font-medium text-white">{achievement.name}</div>
//                         <div className="text-sm text-gray-400">{achievement.description}</div>
//                         <div className="text-xs mt-1 text-gray-500">
//                           Earned {new Date(achievement.earnedAt).toLocaleDateString()}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-400">No achievements yet.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;



// import React from 'react';
// import { User } from 'lucide-react';
// import useAuth from '../hooks/useAuth';

// const ProfilePage = () => {
//   const { user, isLoggedIn, isAuthReady } = useAuth();

//   if (!isAuthReady) return <div className="text-white text-center mt-10">Checking login...</div>;
//   if (!isLoggedIn) return <div className="text-white text-center mt-10">Please log in to view your profile.</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
//       <div className="bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-blue-500/20 transition duration-500 transform hover:scale-105 animate-fade-in-up w-full max-w-md text-center">

//         <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//           <User className="w-10 h-10 text-white" />
//         </div>

//         <h1 className="text-xl font-semibold text-white mb-1">Logged in as</h1>
//         <p className="text-gray-300 break-all">{user.email}</p>

//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


import React, { useEffect, useState } from 'react';
import { User, Zap } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { getUserProgress } from '../services/api';

const ProfilePage = () => {
  const { user, isLoggedIn, isAuthReady } = useAuth();
  const [xp, setXp] = useState(null);

  useEffect(() => {
    const fetchXP = async () => {
      if (isAuthReady && isLoggedIn && user?.uid) {
        try {
          const progress = await getUserProgress('sql-basics', user.uid);
          setXp(progress.totalXP || 0);
        } catch (error) {
          console.error('Error fetching XP:', error);
        }
      }
    };

    fetchXP();
  }, [isAuthReady, isLoggedIn, user]);

  if (!isAuthReady) {
    return (
      <div className="text-white text-center mt-10">
        Checking login...
      </div>
    );
  }

  if (isAuthReady && !isLoggedIn) {
    return (
      <div className="text-white text-center mt-10">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-blue-500/20 transition duration-500 transform hover:scale-105 animate-fade-in-up w-full max-w-md text-center">

        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-xl font-semibold text-white mb-1">Logged in as</h1>
        <p className="text-gray-300 break-all mb-4">{user.email}</p>

        {xp !== null && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">{xp} XP earned</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
