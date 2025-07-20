// client/src/pages/CoursePage.jsx
// import React, { useState, useEffect } from 'react';
// import { User, Award, BookOpen, Code, Play, Check, Lock, Calendar, Target, TrendingUp, Database, Clock, Star, Trophy, Zap, ChevronRight, ChevronLeft } from 'lucide-react';
// import SQLEditor from '../components/SQLEditor';
// import Quiz from '../components/Quiz';
// import ProgressBar from '../components/ProgressBar';
// import { getCourseData, getCourseLessons, getUserProgress, updateUserProgress } from '../services/api';


// // Mock user ID (replace with actual authentication later)
// const MOCK_USER_ID = "user123";

// const CoursesPage = () => {
//   const [courseData, setCourseData] = useState(null);
//   const [lessons, setLessons] = useState([]);
//   const [userProgress, setUserProgress] = useState(null);
//   const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
//   const [showQuiz, setShowQuiz] = useState(false); // Controls when quiz appears
//   const [lessonCompletedStatus, setLessonCompletedStatus] = useState(false); // Tracks if current lesson is completed

//   // Initial data fetch
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const fetchedCourse = await getCourseData('sql-basics'); // Fetch course details
//         setCourseData(fetchedCourse);

//         const fetchedLessons = await getCourseLessons('sql-basics'); // Fetch all lessons
//         setLessons(fetchedLessons);

//         const fetchedProgress = await getUserProgress('sql-basics'); // Fetch user progress for mock user
//         setUserProgress(fetchedProgress);

//         // Set initial lesson index based on user progress (if any)
//         // Find the first uncompleted lesson
//         const lastCompletedLessonId = fetchedProgress.completedLessons.length > 0
//           ? Math.max(...fetchedProgress.completedLessons)
//           : 0;
//         const nextLessonIndex = fetchedLessons.findIndex(
//           lesson => lesson.id === lastCompletedLessonId + 1
//         );
//         setCurrentLessonIndex(nextLessonIndex !== -1 ? nextLessonIndex : 0);

//       } catch (error) {
//         console.error("Failed to fetch initial data:", error);
//         // Handle error: show error message to user, redirect, etc.
//       }
//     };
//     fetchData();
//   }, []);

//   const currentLesson = lessons[currentLessonIndex];
//   // Logic for isLessonUnlocked: A lesson is unlocked if it's the first lesson (id 1)
//   // or if the previous lesson is completed.
//   const isLessonUnlocked = userProgress && currentLesson ?
//                          (currentLesson.id === 1 || userProgress.completedLessons.includes(currentLesson.id - 1))
//                          : false;
//   const isLessonCompleted = userProgress && currentLesson ? userProgress.completedLessons.includes(currentLesson.id) : false;


//   const handleQueryExecuted = (isCorrectQuery, result) => {
//     if (isCorrectQuery) {
//       setShowQuiz(true); // Show quiz only if query was correct
//     } else {
//       setShowQuiz(false); // Hide quiz if query was incorrect
//     }
//   };

//   const handleQuizAnswer = async (correctAnswer, selectedOptionIndex) => {
//     if (correctAnswer && currentLesson && !lessonCompletedStatus) {
//       // Mark lesson as completed if quiz is correct and not already completed
//       setLessonCompletedStatus(true);

//       // Optimistically update frontend state
//       setUserProgress(prev => ({
//         ...prev,
//         completedLessons: [...prev.completedLessons, currentLesson.id],
//         totalXP: prev.totalXP + 30, // Assuming 30 XP per lesson
//         quizResults: {
//           ...prev.quizResults,
//           [currentLesson.id]: { score: 100, attempts: (prev.quizResults[currentLesson.id]?.attempts || 0) + 1 }
//         }
//       }));

//       // Update backend
//       try {
//         await updateUserProgress({
//           userId: MOCK_USER_ID, // Backend uses this mock ID
//           courseId: 'sql-basics',
//           lessonId: currentLesson.id,
//           xpGained: 30,
//           quizScore: 100,
//           quizAttempts: (userProgress.quizResults[currentLesson.id]?.attempts || 0) + 1
//         });
//         console.log("Progress updated on backend!");
//       } catch (error) {
//         console.error("Failed to update progress on backend:", error);
//         // Handle error (e.g., revert optimistic update, show error message)
//       }
//     }
//   };

//   const goToNextLesson = () => {
//     if (currentLessonIndex < lessons.length - 1) {
//       setCurrentLessonIndex(currentLessonIndex + 1);
//       setShowQuiz(false);
//       setLessonCompletedStatus(false);
//     }
//   };

//   const goToPreviousLesson = () => {
//     if (currentLessonIndex > 0) {
//       setCurrentLessonIndex(currentLessonIndex - 1);
//       setShowQuiz(false);
//       setLessonCompletedStatus(false);
//     }
//   };

//   // Show loading state until data is fetched
//   if (!courseData || !lessons.length || !userProgress) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
//         <Clock className="w-8 h-8 animate-spin text-blue-400" />
//         <span className="ml-3 text-lg">Loading course...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       {/* Header */}
//       <div className="bg-gray-800 border-b border-gray-700">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="p-2 bg-blue-600 rounded-lg">
//                 <Database className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-white">{courseData.title}</h1>
//                 <p className="text-gray-400">{courseData.description}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <Zap className="w-5 h-5 text-yellow-400" />
//                 <span className="text-yellow-400 font-semibold">{userProgress.totalXP} XP</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Trophy className="w-5 h-5 text-orange-400" />
//                 <span className="text-orange-400 font-semibold">{userProgress.streak} day streak</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Sidebar - Lesson Navigation */}
//           <div className="lg:col-span-1">
//             <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
//               <h2 className="text-lg font-semibold text-white mb-4">Course Progress</h2>
//               <ProgressBar
//                 current={userProgress.completedLessons.length}
//                 total={courseData.totalLessons}
//                 className="mb-4"
//               />
//               <p className="text-sm text-gray-400 mb-4">
//                 {userProgress.completedLessons.length} of {courseData.totalLessons} lessons completed
//               </p>

//               <div className="space-y-2">
//                 {lessons.map((lesson, index) => {
//                   const isCompleted = userProgress.completedLessons.includes(lesson.id);
//                   // Lesson is unlocked if it's the first one, or if the previous one is completed
//                   const isUnlocked = lesson.id === 1 || userProgress.completedLessons.includes(lesson.id - 1);
//                   const isCurrent = index === currentLessonIndex;

//                   return (
//                     <button
//                       key={lesson.id}
//                       onClick={() => isUnlocked && setCurrentLessonIndex(index)}
//                       disabled={!isUnlocked}
//                       className={`w-full p-3 rounded-lg text-left transition-colors ${
//                         isCurrent
//                           ? 'bg-blue-900/50 border border-blue-600 text-blue-300'
//                           : isCompleted
//                           ? 'bg-green-900/30 border border-green-700 text-green-300'
//                           : isUnlocked
//                           ? 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600'
//                           : 'bg-gray-700 border border-gray-600 text-gray-500 cursor-not-allowed'
//                       }`}
//                     >
//                       <div className="flex items-center gap-2">
//                         {isCompleted ? (
//                           <Check className="w-4 h-4 text-green-400" />
//                         ) : isUnlocked ? (
//                           <BookOpen className="w-4 h-4" />
//                         ) : (
//                           <Lock className="w-4 h-4" />
//                         )}
//                         <div className="flex-1">
//                           <div className="font-medium text-sm">{lesson.title}</div>
//                           <div className="text-xs opacity-75">{lesson.duration}</div>
//                         </div>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             <div className="bg-gray-800 rounded-lg border border-gray-700">
//               {/* Lesson Header */}
//               <div className="p-6 border-b border-gray-700">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-2xl font-bold text-white mb-2">{currentLesson.title}</h2>
//                     <div className="flex items-center gap-4 text-sm text-gray-400">
//                       <span>Lesson {currentLesson.id} of {courseData.totalLessons}</span>
//                       <span>•</span>
//                       <span>{currentLesson.duration}</span>
//                       {isLessonCompleted && (
//                         <>
//                           <span>•</span>
//                           <span className="flex items-center gap-1 text-green-400">
//                             <Check className="w-4 h-4" />
//                             Completed
//                           </span>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={goToPreviousLesson}
//                       disabled={currentLessonIndex === 0}
//                       className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       <ChevronLeft className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={goToNextLesson}
//                       disabled={currentLessonIndex === lessons.length - 1}
//                       className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       <ChevronRight className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Lesson Content */}
//               <div className="p-6">
//                 <div className="space-y-6">
//                   {/* Theory Section */}
//                   <div
//                     className="prose max-w-none" // Removed prose-invert as global dark mode handles it
//                     dangerouslySetInnerHTML={{ __html: currentLesson.content }}
//                   />

//                   {/* Practice Section */}
//                   <div>
//                     <h3 className="text-lg font-semibold text-white mb-4">Practice Exercise</h3>
//                     <SQLEditor
//                       initialQuery={currentLesson.practiceQuery}
//                       expectedResult={currentLesson.expectedResult}
//                       onQueryExecuted={handleQueryExecuted}
//                       lessonId={currentLesson.id} // Pass lessonId to editor
//                     />
//                   </div>

//                   {/* Quiz Section */}
//                   {showQuiz && ( // Only show quiz if SQL exercise was completed correctly
//                     <Quiz
//                       quiz={currentLesson.quiz}
//                       onAnswer={handleQuizAnswer}
//                       quizCompleted={isLessonCompleted} // Pass completion status
//                     />
//                   )}

//                   {/* Lesson Completion */}
//                   {lessonCompletedStatus && ( // Use internal state for immediate feedback
//                     <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
//                       <div className="flex items-center gap-2">
//                         <Trophy className="w-5 h-5 text-yellow-400" />
//                         <span className="text-green-300 font-semibold">
//                           Lesson Completed! You earned 30 XP
//                         </span>
//                       </div>
//                       {currentLessonIndex < lessons.length - 1 && (
//                         <button
//                           onClick={goToNextLesson}
//                           className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                         >
//                           Next Lesson
//                         </button>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CoursesPage;
// import React, { useState, useEffect } from 'react';
// import { User, Award, BookOpen, Code, Play, Check, Lock, Calendar, Target, TrendingUp, Database, Clock, Star, Trophy, Zap, ChevronRight, ChevronLeft } from 'lucide-react';
// import SQLEditor from '../components/SQLEditor';
// import Quiz from '../components/Quiz';
// import ProgressBar from '../components/ProgressBar';
// import { getCourseData, getCourseLessons, getUserProgress, updateUserProgress } from '../services/api';

// const MOCK_USER_ID = "user123";

// const CoursesPage = () => {
//   const [courseData, setCourseData] = useState(null);
//   const [lessons, setLessons] = useState([]);
//   const [userProgress, setUserProgress] = useState(null);
//   const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
//   const [showQuiz, setShowQuiz] = useState(false);
//   const [lessonCompletedStatus, setLessonCompletedStatus] = useState(false);
//   const [isQueryCorrect, setIsQueryCorrect] = useState(false); // NEW

//   useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const fetchedCourse = await getCourseData('sql-basics');
//       setCourseData(fetchedCourse);

//       const fetchedLessons = await getCourseLessons('sql-basics');
//       setLessons(fetchedLessons);

//       const fetchedProgress = await getUserProgress('sql-basics');
//       setUserProgress(fetchedProgress);

//       // Find the first lesson that is not yet completed
//       const firstIncompleteIndex = fetchedLessons.findIndex(
//         lesson => !fetchedProgress.completedLessons.includes(lesson.id)
//       );

//       // If all are completed, show the last lesson
//       setCurrentLessonIndex(
//         firstIncompleteIndex !== -1 ? firstIncompleteIndex : fetchedLessons.length - 1
//       );
//     } catch (error) {
//       console.error("Failed to fetch initial data:", error);
//     }
//   };
//   fetchData();
// }, []);

//   const currentLesson = lessons[currentLessonIndex];
//   const isLessonUnlocked = userProgress && currentLesson ?
//     (currentLesson.id === 1 || userProgress.completedLessons.includes(currentLesson.id - 1))
//     : false;
//   const isLessonCompleted = userProgress && currentLesson ? userProgress.completedLessons.includes(currentLesson.id) : false;

//   const handleQueryExecuted = (isCorrectQuery, result) => {
//     setIsQueryCorrect(isCorrectQuery);
//     setShowQuiz(isCorrectQuery);
//   };

//   const handleQuizAnswer = async (correctAnswer, selectedOptionIndex) => {
//     if (correctAnswer && isQueryCorrect && currentLesson && !lessonCompletedStatus) {
//       setLessonCompletedStatus(true);

//       setUserProgress(prev => ({
//         ...prev,
//         completedLessons: [...prev.completedLessons, currentLesson.id],
//         totalXP: prev.totalXP + 30,
//         quizResults: {
//           ...prev.quizResults,
//           [currentLesson.id]: { score: 100, attempts: (prev.quizResults[currentLesson.id]?.attempts || 0) + 1 }
//         }
//       }));

//       try {
//         await updateUserProgress({
//           userId: MOCK_USER_ID,
//           courseId: 'sql-basics',
//           lessonId: currentLesson.id,
//           xpGained: 30,
//           quizScore: 100,
//           quizAttempts: (userProgress.quizResults[currentLesson.id]?.attempts || 0) + 1
//         });
//         console.log("Progress updated on backend!");
//       } catch (error) {
//         console.error("Failed to update progress on backend:", error);
//       }
//     }
//   };

//   const goToNextLesson = () => {
//     if (currentLessonIndex < lessons.length - 1) {
//       setCurrentLessonIndex(currentLessonIndex + 1);
//       setShowQuiz(false);
//       setLessonCompletedStatus(false);
//       setIsQueryCorrect(false);
//     }
//   };

//   const goToPreviousLesson = () => {
//     if (currentLessonIndex > 0) {
//       setCurrentLessonIndex(currentLessonIndex - 1);
//       setShowQuiz(false);
//       setLessonCompletedStatus(false);
//       setIsQueryCorrect(false);
//     }
//   };

//   if (!courseData || !lessons.length || !userProgress) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
//         <Clock className="w-8 h-8 animate-spin text-blue-400" />
//         <span className="ml-3 text-lg">Loading course...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <div className="bg-gray-800 border-b border-gray-700">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="p-2 bg-blue-600 rounded-lg">
//                 <Database className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-white">{courseData.title}</h1>
//                 <p className="text-gray-400">{courseData.description}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <Zap className="w-5 h-5 text-yellow-400" />
//                 <span className="text-yellow-400 font-semibold">{userProgress.totalXP} XP</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Trophy className="w-5 h-5 text-orange-400" />
//                 <span className="text-orange-400 font-semibold">{userProgress.streak} day streak</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           <div className="lg:col-span-1">
//             <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
//               <h2 className="text-lg font-semibold text-white mb-4">Course Progress</h2>
//               <ProgressBar
//                 current={userProgress.completedLessons.length}
//                 total={courseData.totalLessons}
//                 className="mb-4"
//               />
//               <p className="text-sm text-gray-400 mb-4">
//                 {userProgress.completedLessons.length} of {courseData.totalLessons} lessons completed
//               </p>

//               <div className="space-y-2">
//                 {lessons.map((lesson, index) => {
//                   const isCompleted = userProgress.completedLessons.includes(lesson.id);
//                   const isUnlocked = lesson.id === 1 || userProgress.completedLessons.includes(lesson.id - 1);
//                   const isCurrent = index === currentLessonIndex;

//                   return (
//                     <button
//                       key={lesson.id}
//                       onClick={() => isUnlocked && setCurrentLessonIndex(index)}
//                       disabled={!isUnlocked}
//                       className={`w-full p-3 rounded-lg text-left transition-colors ${
//                         isCurrent
//                           ? 'bg-blue-900/50 border border-blue-600 text-blue-300'
//                           : isCompleted
//                           ? 'bg-green-900/30 border border-green-700 text-green-300'
//                           : isUnlocked
//                           ? 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600'
//                           : 'bg-gray-700 border border-gray-600 text-gray-500 cursor-not-allowed'
//                       }`}
//                     >
//                       <div className="flex items-center gap-2">
//                         {isCompleted ? (
//                           <Check className="w-4 h-4 text-green-400" />
//                         ) : isUnlocked ? (
//                           <BookOpen className="w-4 h-4" />
//                         ) : (
//                           <Lock className="w-4 h-4" />
//                         )}
//                         <div className="flex-1">
//                           <div className="font-medium text-sm">{lesson.title}</div>
//                           <div className="text-xs opacity-75">{lesson.duration}</div>
//                         </div>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-3">
//             <div className="bg-gray-800 rounded-lg border border-gray-700">
//               <div className="p-6 border-b border-gray-700">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-2xl font-bold text-white mb-2">{currentLesson.title}</h2>
//                     <div className="flex items-center gap-4 text-sm text-gray-400">
//                       <span>Lesson {currentLesson.id} of {courseData.totalLessons}</span>
//                       <span>•</span>
//                       <span>{currentLesson.duration}</span>
//                       {isLessonCompleted && (
//                         <>
//                           <span>•</span>
//                           <span className="flex items-center gap-1 text-green-400">
//                             <Check className="w-4 h-4" />
//                             Completed
//                           </span>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={goToPreviousLesson}
//                       disabled={currentLessonIndex === 0}
//                       className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       <ChevronLeft className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={goToNextLesson}
//                       disabled={currentLessonIndex === lessons.length - 1}
//                       className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       <ChevronRight className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <div className="space-y-6">
//                   <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentLesson.content }} />

//                   <div>
//                     <h3 className="text-lg font-semibold text-white mb-4">Practice Exercise</h3>
//                     <SQLEditor
//                       initialQuery={currentLesson.practiceQuery}
//                       expectedResult={currentLesson.expectedResult}
//                       onQueryExecuted={handleQueryExecuted}
//                       lessonId={currentLesson.id}
//                     />
//                   </div>

//                   {showQuiz && (
//                     <Quiz
//                       quiz={currentLesson.quiz}
//                       onAnswer={handleQuizAnswer}
//                       quizCompleted={isLessonCompleted}
//                     />
//                   )}

//                   {lessonCompletedStatus && (
//                     <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
//                       <div className="flex items-center gap-2">
//                         <Trophy className="w-5 h-5 text-yellow-400" />
//                         <span className="text-green-300 font-semibold">
//                           Lesson Completed! You earned 30 XP
//                         </span>
//                       </div>
//                       {currentLessonIndex < lessons.length - 1 && (
//                         <button
//                           onClick={goToNextLesson}
//                           className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                         >
//                           Next Lesson
//                         </button>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CoursesPage;

// import React, { useState, useEffect } from 'react';
// import { User, Award, BookOpen, Code, Play, Check, Lock, Calendar, Target, TrendingUp, Database, Clock, Star, Trophy, Zap, ChevronRight, ChevronLeft } from 'lucide-react';
// import SQLEditor from '../components/SQLEditor';
// import Quiz from '../components/Quiz';
// import ProgressBar from '../components/ProgressBar';
// import { getCourseData, getCourseLessons, getUserProgress, updateUserProgress } from '../services/api';
// import useAuth from '../hooks/useAuth'; 


// const CoursesPage = () => {
//   //const { user } = useAuth();
//   const { user, isAuthReady } = useAuth();
//   const [courseData, setCourseData] = useState(null);
//   const [lessons, setLessons] = useState([]);
//   const [userProgress, setUserProgress] = useState(null);
//   const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
//   const [showQuiz, setShowQuiz] = useState(false);
//   const [lessonCompletedStatus, setLessonCompletedStatus] = useState(false);
//   const [isQueryCorrect, setIsQueryCorrect] = useState(false);

//   useEffect(() => {
//     if (!user) return;
//     const fetchData = async () => {
//       try {
//         const fetchedCourse = await getCourseData('sql-basics');
//         setCourseData(fetchedCourse);

//         //const fetchedLessons = await getCourseLessons('sql-basics');
//         const fetchedLessons = await getCourseLessons('sql-basics', user.uid);

//         setLessons(fetchedLessons);

//         //const fetchedProgress = await getUserProgress('sql-basics', user.uid);
//         const fetchedProgress = await getUserProgress('sql-basics', user.uid);

//         setUserProgress(fetchedProgress);

//         const lastCompletedLessonId = fetchedProgress.completedLessons.length > 0
//           ? Math.max(...fetchedProgress.completedLessons)
//           : 0;
//         const nextLessonIndex = fetchedLessons.findIndex(
//           lesson => lesson.id === lastCompletedLessonId + 1
//         );
//         setCurrentLessonIndex(nextLessonIndex !== -1 ? nextLessonIndex : 0);

//       } catch (error) {
//         console.error("Failed to fetch initial data:", error);
//       }
//     };
//     fetchData();
//   }, [user]);

//   const currentLesson = lessons[currentLessonIndex];
//   const isLessonUnlocked = userProgress && currentLesson ?
//     (currentLesson.id === 1 || userProgress.completedLessons.includes(currentLesson.id - 1))
//     : false;
//   const isLessonCompleted = userProgress && currentLesson ? userProgress.completedLessons.includes(currentLesson.id) : false;

//   const handleQueryExecuted = (isCorrectQuery, result) => {
//     setIsQueryCorrect(isCorrectQuery);
//     setShowQuiz(isCorrectQuery);
//   };

//   // const handleQuizAnswer = async (correctAnswer, selectedOptionIndex) => {
//   //   if (!user) return;
//   //   if (correctAnswer && isQueryCorrect && currentLesson && !lessonCompletedStatus) {
//   //     setLessonCompletedStatus(true);

//   //     setUserProgress(prev => ({
//   //       ...prev,
//   //       completedLessons: [...prev.completedLessons, currentLesson.id],
//   //       totalXP: prev.totalXP + 30,
//   //       quizResults: {
//   //         ...prev.quizResults,
//   //         [currentLesson.id]: { score: 100, attempts: (prev.quizResults[currentLesson.id]?.attempts || 0) + 1 }
//   //       }
//   //     }));

//   //     try {
//   //       await updateUserProgress({
//   //         userId: user.uid,
//   //         courseId: 'sql-basics',
//   //         lessonId: currentLesson.id,
//   //         xpGained: 30,
//   //         quizScore: 100,
//   //         quizAttempts: (userProgress.quizResults[currentLesson.id]?.attempts || 0) + 1
//   //       });
//   //       console.log("Progress updated on backend!");
//   //     } catch (error) {
//   //       console.error("Failed to update progress on backend:", error);
//   //     }
//   //   }
//   // };
//   const handleQuizAnswer = async (correctAnswer, selectedOptionIndex) => {
//   if (!user) return;
//   const currentLessonId = currentLesson.id;

//   if (correctAnswer && isQueryCorrect && !lessonCompletedStatus) {
//     setLessonCompletedStatus(true);

//     const attempts = userProgress.quizResults[currentLessonId]?.attempts || 0;

//     setUserProgress(prev => ({
//       ...prev,
//       completedLessons: [...prev.completedLessons, currentLessonId],
//       totalXP: (prev.totalXP || 0) + 30,
//       quizResults: {
//         ...prev.quizResults,
//         [currentLessonId]: {
//           score: 100,
//           attempts: attempts + 1
//         }
//       }
//     }));

//     try {
//       await updateUserProgress({
//         userId: user.uid,
//         courseId: 'sql-basics',
//         lessonId: currentLessonId,
//         xpGained: 30,
//         quizScore: 100,
//         quizAttempts: attempts + 1
//       });
//       console.log("Progress updated on backend!");
//     } catch (error) {
//       console.error("Failed to update progress on backend:", error);
//     }
//   }
// };


//   // const goToNextLesson = () => {
//   //   if (currentLessonIndex < lessons.length - 1) {
//   //     setCurrentLessonIndex(currentLessonIndex + 1);
//   //     setShowQuiz(false);
//   //     setLessonCompletedStatus(false);
//   //     setIsQueryCorrect(false);
//   //   }
//   // };
// const goToNextLesson = async () => {
//   const currentLesson = lessons[currentLessonIndex];

//   const isAlreadyCompleted = userProgress.completedLessons.includes(currentLesson.id);

//   // 1. Save to backend ONLY IF not already saved
//   if (!isAlreadyCompleted) {
//     try {
//       const attempts = userProgress.quizResults[currentLesson.id]?.attempts || 0;

//       await updateUserProgress({
//         userId: user.uid,
//         courseId: 'sql-basics',
//         lessonId: currentLesson.id,
//         xpGained: 30,
//         quizScore: 100,
//         quizAttempts: attempts + 1
//       });

//       console.log('Progress saved for lesson:', currentLesson.id);

//       // ✅ Update local state
//       setUserProgress(prev => ({
//         ...prev,
//         completedLessons: [...prev.completedLessons, currentLesson.id],
//         totalXP: (prev.totalXP || 0) + 30,
//         quizResults: {
//           ...prev.quizResults,
//           [currentLesson.id]: {
//             score: 100,
//             attempts: attempts + 1
//           }
//         }
//       }));

//     } catch (error) {
//       console.error('Error saving progress:', error);
//     }
//   }

//   // 2. Move to next lesson
//   if (currentLessonIndex < lessons.length - 1) {
//     setCurrentLessonIndex(currentLessonIndex + 1);
//     setShowQuiz(false);
//     setLessonCompletedStatus(false);
//     setIsQueryCorrect(false);
//   }
// };




//   const goToPreviousLesson = () => {
//     if (currentLessonIndex > 0) {
//       setCurrentLessonIndex(currentLessonIndex - 1);
//       setShowQuiz(false);
//       setLessonCompletedStatus(false);
//       setIsQueryCorrect(false);
//     }
//   };

//   if (!user || !courseData || !lessons.length || !userProgress) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
//         <Clock className="w-8 h-8 animate-spin text-blue-400" />
//         <span className="ml-3 text-lg">Loading course...</span>
//       </div>
//     );
//   }
//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <div className="bg-gray-800 border-b border-gray-700">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="p-2 bg-blue-600 rounded-lg">
//                 <Database className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-white">{courseData.title}</h1>
//                 <p className="text-gray-400">{courseData.description}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <Zap className="w-5 h-5 text-yellow-400" />
//                 <span className="text-yellow-400 font-semibold">{userProgress.totalXP} XP</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Trophy className="w-5 h-5 text-orange-400" />
//                 <span className="text-orange-400 font-semibold">{userProgress.streak} day streak</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           <div className="lg:col-span-1">
//             <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
//               <h2 className="text-lg font-semibold text-white mb-4">Course Progress</h2>
//               <ProgressBar
//                 current={userProgress.completedLessons.length}
                
//                 total={courseData.totalLessons}
//                 className="mb-4"
//               />
//               <p className="text-sm text-gray-400 mb-4">
//                 {userProgress.completedLessons.length} of {courseData.totalLessons} lessons completed
//               </p>

//               <div className="space-y-2">
//                 {lessons.map((lesson, index) => {
//                   const isCompleted = userProgress.completedLessons.includes(lesson.id);
//                   const isUnlocked = lesson.id === 1 || userProgress.completedLessons.includes(lesson.id - 1);
//                   const isCurrent = index === currentLessonIndex;

//                   return (
//                     <button
//                       key={lesson.id}
//                       onClick={() => isUnlocked && setCurrentLessonIndex(index)}
//                       disabled={!isUnlocked}
//                       className={`w-full p-3 rounded-lg text-left transition-colors ${
//                         isCurrent
//                           ? 'bg-blue-900/50 border border-blue-600 text-blue-300'
//                           : isCompleted
//                           ? 'bg-green-900/30 border border-green-700 text-green-300'
//                           : isUnlocked
//                           ? 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600'
//                           : 'bg-gray-700 border border-gray-600 text-gray-500 cursor-not-allowed'
//                       }`}
//                     >
//                       <div className="flex items-center gap-2">
//                         {isCompleted ? (
//                           <Check className="w-4 h-4 text-green-400" />
//                         ) : isUnlocked ? (
//                           <BookOpen className="w-4 h-4" />
//                         ) : (
//                           <Lock className="w-4 h-4" />
//                         )}
//                         <div className="flex-1">
//                           <div className="font-medium text-sm">{lesson.title}</div>
//                           <div className="text-xs opacity-75">{lesson.duration}</div>
//                         </div>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-3">
//             <div className="bg-gray-800 rounded-lg border border-gray-700">
//               <div className="p-6 border-b border-gray-700">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-2xl font-bold text-white mb-2">{currentLesson.title}</h2>
//                     <div className="flex items-center gap-4 text-sm text-gray-400">
//                       <span>Lesson {currentLesson.id} of {courseData.totalLessons}</span>
//                       <span>•</span>
//                       <span>{currentLesson.duration}</span>
//                       {isLessonCompleted && (
//                         <>
//                           <span>•</span>
//                           <span className="flex items-center gap-1 text-green-400">
//                             <Check className="w-4 h-4" />
//                             Completed
//                           </span>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={goToPreviousLesson}
//                       disabled={currentLessonIndex === 0}
//                       className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       <ChevronLeft className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={goToNextLesson}
//                       disabled={currentLessonIndex === lessons.length - 1}
//                       className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       <ChevronRight className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <div className="space-y-6">
//                   <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentLesson.content }} />

//                   <div>
//                     <h3 className="text-lg font-semibold text-white mb-4">Practice Exercise</h3>
//                     <SQLEditor
//                       initialQuery={currentLesson.practiceQuery}
//                       expectedResult={currentLesson.expectedResult}
//                       onQueryExecuted={handleQueryExecuted}
//                       lessonId={currentLesson.id}
//                     />
//                   </div>

//                   {showQuiz && (
//                     <Quiz
//                       quiz={currentLesson.quiz}
//                       onAnswer={handleQuizAnswer}
//                       quizCompleted={isLessonCompleted}
//                     />
//                   )}

//                   {lessonCompletedStatus && (
//                     <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
//                       <div className="flex items-center gap-2">
//                         <Trophy className="w-5 h-5 text-yellow-400" />
//                         <span className="text-green-300 font-semibold">
//                           Lesson Completed! You earned 30 XP
//                         </span>
//                       </div>
//                       {currentLessonIndex < lessons.length - 1 && (
//                         <button
//                           onClick={goToNextLesson}
//                           className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                         >
//                           Next Lesson
//                         </button>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CoursesPage;
import React, { useState, useEffect } from 'react';
import {
  BookOpen, Check, Lock, Clock, Trophy, Zap,
  ChevronLeft, ChevronRight, Database
} from 'lucide-react';
import SQLEditor from '../components/SQLEditor';
import Quiz from '../components/Quiz';
import ProgressBar from '../components/ProgressBar';
import { getCourseData, getCourseLessons, getUserProgress, updateUserProgress } from '../services/api';
import useAuth from '../hooks/useAuth';

const CoursesPage = () => {
  const { user, isAuthReady } = useAuth();
  const [courseData, setCourseData] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [lessonCompletedStatus, setLessonCompletedStatus] = useState(false);
  const [isQueryCorrect, setIsQueryCorrect] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);

  const currentLesson = lessons[currentLessonIndex];

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const fetchedCourse = await getCourseData('sql-basics');
        const fetchedLessons = await getCourseLessons('sql-basics', user.uid);
        const fetchedProgress = await getUserProgress('sql-basics', user.uid);

        setCourseData(fetchedCourse);
        setLessons(fetchedLessons);
        setUserProgress(fetchedProgress);

        const lastCompletedLessonId = fetchedProgress.completedLessons.length > 0
          ? Math.max(...fetchedProgress.completedLessons)
          : 0;
        const nextLessonIndex = fetchedLessons.findIndex(
          lesson => lesson.id === lastCompletedLessonId + 1
        );
        setCurrentLessonIndex(nextLessonIndex !== -1 ? nextLessonIndex : 0);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (currentLesson && userProgress) {
      const completed = userProgress.completedLessons.includes(currentLesson.id);
      setLessonCompletedStatus(completed);
    }
  }, [currentLesson, userProgress]);

  const isLessonUnlocked = userProgress && currentLesson
    ? currentLesson.id === 1 || userProgress.completedLessons.includes(currentLesson.id - 1)
    : false;

  const handleQueryExecuted = (isCorrectQuery) => {
    setIsQueryCorrect(isCorrectQuery);
    setShowQuiz(isCorrectQuery);
  };

  const handleQuizAnswer = async (correctAnswer) => {
    if (!user || !correctAnswer || !isQueryCorrect || lessonCompletedStatus) return;

    const currentLessonId = currentLesson.id;
    const alreadyCompleted = userProgress.completedLessons.includes(currentLessonId);
    const attempts = userProgress.quizResults[currentLessonId]?.attempts || 0;

    if (!alreadyCompleted) {
      try {
        await updateUserProgress({
          userId: user.uid,
          courseId: 'sql-basics',
          lessonId: currentLessonId,
          xpGained: 30,
          quizScore: 100,
          quizAttempts: attempts + 1
        });

        setUserProgress(prev => ({
          ...prev,
          completedLessons: [...new Set([...prev.completedLessons, currentLessonId])],
          totalXP: (prev.totalXP || 0) + 30,
          quizResults: {
            ...prev.quizResults,
            [currentLessonId]: {
              score: 100,
              attempts: attempts + 1
            }
          }
        }));
        setLessonCompletedStatus(true);
        console.log("Progress updated on backend!");
      } catch (error) {
        console.error("Failed to update progress on backend:", error);
      }
    }
  };

  const goToNextLesson = async () => {
    if (nextDisabled || currentLessonIndex >= lessons.length - 1) return;
    setNextDisabled(true);

    const currentLessonId = currentLesson.id;
    const isAlreadyCompleted = userProgress.completedLessons.includes(currentLessonId);
    const attempts = userProgress.quizResults[currentLessonId]?.attempts || 0;

    if (!isAlreadyCompleted) {
      try {
        await updateUserProgress({
          userId: user.uid,
          courseId: 'sql-basics',
          lessonId: currentLessonId,
          xpGained: 30,
          quizScore: 100,
          quizAttempts: attempts + 1
        });

        setUserProgress(prev => ({
          ...prev,
          completedLessons: [...new Set([...prev.completedLessons, currentLessonId])],
          totalXP: (prev.totalXP || 0) + 30,
          quizResults: {
            ...prev.quizResults,
            [currentLessonId]: {
              score: 100,
              attempts: attempts + 1
            }
          }
        }));
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }

    setCurrentLessonIndex(prev => prev + 1);
    setShowQuiz(false);
    setLessonCompletedStatus(false);
    setIsQueryCorrect(false);

    setTimeout(() => setNextDisabled(false), 500);
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setShowQuiz(false);
      setLessonCompletedStatus(false);
      setIsQueryCorrect(false);
    }
  };

  if (!isAuthReady) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <Clock className="w-8 h-8 animate-spin text-blue-400" />
      <span className="ml-3 text-lg">Loading course...</span>
    </div>
  );
}

if (!user) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <Lock className="w-8 h-8 text-red-500 mr-3" />
      <span className="text-lg">Please log in to view courses.</span>
    </div>
  );
}

if (!courseData || !lessons.length || !userProgress) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <Clock className="w-8 h-8 animate-spin text-blue-400" />
      <span className="ml-3 text-lg">Loading course...</span>
    </div>
  );
}


  const isCourseCompleted =
    currentLessonIndex === lessons.length - 1 && lessonCompletedStatus;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{courseData.title}</h1>
              <p className="text-gray-400">{courseData.description}</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">{userProgress.totalXP} XP</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-400" />
              <span className="text-orange-400 font-semibold">{userProgress.streak} day streak</span>
            </div> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Course Progress</h2>
            <ProgressBar
              current={userProgress.completedLessons.length}
              total={courseData.totalLessons}
              className="mb-4"
            />
            <p className="text-sm text-gray-400 mb-4">
              {userProgress.completedLessons.length} of {courseData.totalLessons} lessons completed
            </p>

            <div className="space-y-2">
              {lessons.map((lesson, index) => {
                const isCompleted = userProgress.completedLessons.includes(lesson.id);
                const isUnlocked = lesson.id === 1 || userProgress.completedLessons.includes(lesson.id - 1);
                const isCurrent = index === currentLessonIndex;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => isUnlocked && setCurrentLessonIndex(index)}
                    disabled={!isUnlocked}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      isCurrent
                        ? 'bg-blue-900/50 border border-blue-600 text-blue-300'
                        : isCompleted
                        ? 'bg-green-900/30 border border-green-700 text-green-300'
                        : isUnlocked
                        ? 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-700 border border-gray-600 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : isUnlocked ? (
                        <BookOpen className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-sm">{lesson.title}</div>
                        <div className="text-xs opacity-75">{lesson.duration}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            {isCourseCompleted ? (
              <div className="p-10 text-center">
                <Trophy className="w-10 h-10 mx-auto text-yellow-400 mb-4" />
                <h2 className="text-3xl font-bold">🎉 Course Completed!</h2>
                <p className="mt-2 text-gray-300">You've finished all lessons in this course. Great job!</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                    <div className="text-sm text-gray-400 flex gap-4">
                      <span>Lesson {currentLesson.id} of {courseData.totalLessons}</span>
                      <span>•</span>
                      <span>{currentLesson.duration}</span>
                      {lessonCompletedStatus && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-green-400">
                            <Check className="w-4 h-4" />
                            Completed
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={goToPreviousLesson} disabled={currentLessonIndex === 0} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={goToNextLesson} disabled={currentLessonIndex === lessons.length - 1 || nextDisabled} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                  <SQLEditor
                    initialQuery={currentLesson.practiceQuery}
                    expectedResult={currentLesson.expectedResult}
                    onQueryExecuted={handleQueryExecuted}
                    lessonId={currentLesson.id}
                  />
                  {showQuiz && (
                    <Quiz
                      quiz={currentLesson.quiz}
                      onAnswer={handleQuizAnswer}
                      quizCompleted={lessonCompletedStatus}
                    />
                  )}
                  {lessonCompletedStatus && (
                    <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-green-300 font-semibold">Lesson Completed! You earned 30 XP</span>
                      </div>
                      {currentLessonIndex < lessons.length - 1 && (
                        <button
                          onClick={goToNextLesson}
                          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Next Lesson
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
