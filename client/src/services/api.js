// // // client/src/services/api.js
// // import axios from 'axios';

// // const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

// // const api = axios.create({
// //   baseURL: API_URL,
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });

// // // Functions for your main playground (if you have a separate playground page)
// // export const executePlaygroundSql = async (query) => {
// //   try {
// //     const response = await api.post('/execute-sql', { query });
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error executing playground SQL:', error);
// //     throw error;
// //   }
// // };

// // export const getPlaygroundSchema = async () => {
// //   try {
// //     const response = await api.get('/schema');
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error fetching playground schema:', error);
// //     throw error;
// //   }
// // };

// // export const resetPlaygroundDb = async () => {
// //   try {
// //     const response = await api.post('/reset-db');
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error resetting playground DB:', error);
// //     throw error;
// //   }
// // };


// // // NEW: Functions for Course Page (Lesson-specific)
// // export const getCourseData = async (courseId) => {
// //   try {
// //     const response = await api.get(`/courses/${courseId}`);
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error fetching course data:', error);
// //     throw error;
// //   }
// // };

// // export const getCourseLessons = async (courseId) => {
// //   try {
// //     const response = await api.get(`/courses/${courseId}/lessons`);
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error fetching course lessons:', error);
// //     throw error;
// //   }
// // };

// // export const getUserProgress = async (courseId) => { // userId is mocked on backend
// //   try {
// //     const response = await api.get(`/user-progress/${courseId}`);
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error fetching user progress:', error);
// //     throw error;
// //   }
// // };

// // export const updateUserProgress = async (progressData) => {
// //   try {
// //     const response = await api.post('/user-progress', progressData);
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error updating user progress:', error);
// //     throw error;
// //   }
// // };

// // // This is the call for the lesson's SQL editor (runs against sandbox)
// // export const runLessonSqlQuery = async (query, lessonId) => {
// //   try {
// //     const response = await api.post('/run-lesson-query', { query, lessonId }); // <--- NEW ENDPOINT
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error running SQL lesson query:', error);
// //     throw error;
// //   }
// // };

// // client/src/services/api.js
// // client/src/services/api.js
// import axios from 'axios';

// const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Functions for your main playground (if you have a separate playground page)
// export const executePlaygroundSql = async (query) => {
//   try {
//     const response = await api.post('/execute-sql', { query });
//     return response.data;
//   } catch (error) {
//     console.error('Error executing playground SQL:', error);
//     throw error;
//   }
// };

// export const getPlaygroundSchema = async () => {
//   try {
//     const response = await api.get('/schema');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching playground schema:', error);
//     throw error;
//   }
// };

// export const resetPlaygroundDb = async () => {
//   try {
//     const response = await api.post('/reset-db');
//     return response.data;
//   } catch (error) {
//     console.error('Error resetting playground DB:', error);
//     throw error;
//   }
// };


// // NEW: Functions for Course Page (Lesson-specific)
// export const getCourseData = async (courseId) => {
//   try {
//     const response = await api.get(`/courses/${courseId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching course data:', error);
//     throw error;
//   }
// };

// export const getCourseLessons = async (courseId) => {
//   try {
//     const response = await api.get(`/courses/${courseId}/lessons`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching course lessons:', error);
//     throw error;
//   }
// };

// export const getUserProgress = async (courseId) => { // userId is mocked on backend
//   try {
//     const response = await api.get(`/user-progress/${courseId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user progress:', error);
//     throw error;
//   }
// };

// export const updateUserProgress = async (progressData) => {
//   try {
//     const response = await api.post('/user-progress', progressData);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating user progress:', error);
//     throw error;
//   }
// };

// // This is the call for the lesson's SQL editor (runs against sandbox)
// export const runLessonSqlQuery = async (query, lessonId) => {
//   try {
//     const response = await api.post('/run-lesson-query', { query, lessonId }); // <--- NEW ENDPOINT
//     return response.data;
//   } catch (error) {
//     console.error('Error running SQL lesson query:', error);
//     throw error;
//   }
// };

// // --- ADD THIS NEW FUNCTION ---
// export const getUserSummary = async (userId) => {
//   try {
//     // The backend endpoint is /api/user/:userId/summary
//     const response = await api.get(`/user/${userId}/summary`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user summary:', error);
//     throw error;
//   }
// };

// // --- ADD THESE MOCK/PLACEHOLDER FUNCTIONS AS WELL, AS YOUR HOMEPAGE USES THEM ---
// export const getUserAchievements = async (userId) => {
//   try {
//     const response = await api.get(`/user/${userId}/achievements`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user achievements:', error);
//     throw error;
//   }
// };

// export const getUserRecentActivity = async (userId) => {
//   try {
//     const response = await api.get(`/user/${userId}/activity`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user activity:', error);
//     throw error;
//   }
// };

// export const getUserLearningGoals = async (userId) => {
//   try {
//     const response = await api.get(`/user/${userId}/goals`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user learning goals:', error);
//     throw error;
//   }
// };
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- MAIN PLAYGROUND FUNCTIONS ---
export const executePlaygroundSql = async (query) => {
  try {
    const response = await api.post('/execute-sql', { query });
    return response.data;
  } catch (error) {
    console.error('Error executing playground SQL:', error);
    throw error;
  }
};

export const getPlaygroundSchema = async () => {
  try {
    const response = await api.get('/schema');
    return response.data;
  } catch (error) {
    console.error('Error fetching playground schema:', error);
    throw error;
  }
};

export const resetPlaygroundDb = async () => {
  try {
    const response = await api.post('/reset-db');
    return response.data;
  } catch (error) {
    console.error('Error resetting playground DB:', error);
    throw error;
  }
};

// --- COURSE PAGE FUNCTIONS ---
export const getCourseData = async (courseId) => {
  try {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course data:', error);
    throw error;
  }
};

// ✅ UPDATED: Now accepts userId
export const getCourseLessons = async (courseId, userId) => {
  try {
    const response = await api.get(`/courses/${courseId}/lessons`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching course lessons:', error);
    throw error;
  }
};

// ✅ UPDATED: Now accepts userId
export const getUserProgress = async (courseId, userId) => {
  try {
    const response = await api.get(`/user-progress/${courseId}`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

export const updateUserProgress = async (progressData) => {
  try {
    const response = await api.post('/user-progress', progressData);
    return response.data;
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

export const runLessonSqlQuery = async (query, lessonId) => {
  try {
    const response = await api.post('/run-lesson-query', { query, lessonId }); // ✅ Only /run-lesson-query
    return response.data;
  } catch (error) {
    console.error('Error running SQL lesson query:', error);
    throw error;
  }
};


// --- USER PROFILE DATA ---
export const getUserSummary = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}/summary`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user summary:', error);
    throw error;
  }
};

export const getUserAchievements = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}/achievements`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    throw error;
  }
};

export const getUserRecentActivity = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}/activity`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user activity:', error);
    throw error;
  }
};

export const getUserLearningGoals = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}/goals`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user learning goals:', error);
    throw error;
  }
};
