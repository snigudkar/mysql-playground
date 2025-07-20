// client/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Play, BookOpen, Trophy, Code, Users, Clock, Target, Zap, Brain, LogIn, User ,Puzzle} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { getUserSummary } from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, isAuthReady } = useAuth();

  const [stars, setStars] = useState([]);
  const [constellations, setConstellations] = useState([]);
  const [userSummary, setUserSummary] = useState(null);

  useEffect(() => {
    const fetchUserSummary = async () => {
      if (isAuthReady && isLoggedIn && user?.uid) {
        try {
          const summary = await getUserSummary(user.uid);
          setUserSummary(summary);
        } catch (error) {
          console.error("Failed to fetch user summary for homepage:", error);
          setUserSummary(null);
        }
      } else if (isAuthReady && !isLoggedIn) {
        setUserSummary(null);
      }
    };

    fetchUserSummary();
  }, [isAuthReady, isLoggedIn, user?.uid]);

  useEffect(() => {
    const generateStars = () => {
      const starArray = [];
      for (let i = 0; i < 150; i++) {
        starArray.push({
          id: i,
          x: Math.random() * 120 - 10,
          y: Math.random() * 120 - 10,
          size: Math.random() > 0.8 ? 'large' : Math.random() > 0.5 ? 'medium' : 'small',
          speed: Math.random() * 0.5 + 0.1,
          direction: Math.random() * 360,
          opacity: Math.random() * 0.8 + 0.2
        });
      }
      setStars(starArray);
    };

    const generateConstellations = () => {
      const constellationArray = [];
      for (let i = 0; i < 8; i++) {
        const centerX = Math.random() * 100;
        const centerY = Math.random() * 100;
        const constellation = {
          id: i,
          x: centerX,
          y: centerY,
          nodes: [],
          lines: [],
          speed: Math.random() * 0.3 + 0.1,
          direction: Math.random() * 360
        };

        for (let j = 0; j < 5 + Math.floor(Math.random() * 4); j++) {
          constellation.nodes.push({
            x: centerX + (Math.random() - 0.5) * 20,
            y: centerY + (Math.random() - 0.5) * 20,
            brightness: Math.random() * 0.8 + 0.2
          });
        }

        for (let j = 0; j < constellation.nodes.length - 1; j++) {
          if (Math.random() > 0.4) {
            constellation.lines.push([j, j + 1]);
          }
        }
        constellationArray.push(constellation);
      }
      setConstellations(constellationArray);
    };

    generateStars();
    generateConstellations();

    const animateBackground = () => {
      setStars(prevStars =>
        prevStars.map(star => {
          let newX = star.x + Math.cos(star.direction * Math.PI / 180) * star.speed;
          let newY = star.y + Math.sin(star.direction * Math.PI / 180) * star.speed;

          if (newX > 110) newX = -10;
          if (newX < -10) newX = 110;
          if (newY > 110) newY = -10;
          if (newY < -10) newY = 110;

          return { ...star, x: newX, y: newY };
        })
      );

      setConstellations(prevConstellations =>
        prevConstellations.map(constellation => {
          let newX = constellation.x + Math.cos(constellation.direction * Math.PI / 180) * constellation.speed;
          let newY = constellation.y + Math.sin(constellation.direction * Math.PI / 180) * constellation.speed;

          if (newX > 120) newX = -20;
          if (newX < -20) newX = 120;
          if (newY > 120) newY = -20;
          if (newY < -20) newY = 120;

          return {
            ...constellation,
            x: newX,
            y: newY,
            nodes: constellation.nodes.map(node => ({
              ...node,
              x: node.x - constellation.x + newX,
              y: node.y - constellation.y + newY
            }))
          };
        })
      );
    };

    const interval = setInterval(animateBackground, 100);
    return () => clearInterval(interval);
  }, []);

  const mainSections = [
    {
      id: 'playground',
      title: 'SQL Playground',
      subtitle: 'Practice & Experiment',
      description: 'Write, test, and debug SQL queries in our interactive environment',
      icon: <Code className="w-12 h-12" />,
      gradient: 'from-cyan-600 to-blue-700',
      hoverGradient: 'from-cyan-500 to-blue-600',
      path: '/playground' // This will now go to PlaygroundDashboardPage
    },
    {
      id: 'mystery-games',
      title: 'Mystery Games',
      subtitle: 'Solve Cases with SQL',
      description: 'Interactive mystery games that challenge your MySQL skills',
      icon: <Puzzle className="w-12 h-12" />, // You can change this to any icon you prefer
      gradient: 'from-purple-600 to-violet-700',
      hoverGradient: 'from-purple-500 to-violet-600',
      path: 'https://dbms-render.vercel.app/', // Replace with your actual URL
      external: true // Optional: Add this if you're handling external links differently
    },
    {
      id: 'courses',
      title: 'Mini Courses',
      subtitle: 'Comprehensive Learning Paths',
      description: 'Structured lessons to guide you from SQL basics to advanced topics',
      icon: <BookOpen className="w-12 h-12" />,
      gradient: 'from-purple-600 to-violet-700',
      hoverGradient: 'from-purple-500 to-violet-600',
      
      path: '/courses'
    },
    {
      id: 'resources',
      title: 'Learning Resources',
      subtitle: 'External References & Tools',
      description: 'Curated list of external tutorials, documentation, and useful tools',
      icon: <BookOpen className="w-12 h-12" />, // Changed icon from Link2 to BookOpen to match your code
      gradient: 'from-emerald-600 to-teal-700',
      hoverGradient: 'from-emerald-500 to-teal-600',
      path: '/resources'
    }
    
  ];

  

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Execution",
      description: "Execute queries instantly and see results as you learn"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Adaptive Learning",
      description: "AI-powered hints and challenges that match your skill level"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Gamified Progress",
      description: "Unlock achievements and track your SQL mastery journey"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white overflow-hidden relative">
      {/* Dynamic Animated Background */}
      <div className="fixed inset-0 z-0">
        {stars.map(star => (
          <div
            key={star.id}
            className={`absolute rounded-full bg-white transition-opacity duration-1000 ${
              star.size === 'large' ? 'w-1.5 h-1.5' :
              star.size === 'medium' ? 'w-1 h-1' : 'w-0.5 h-0.5'
            }`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size === 'large' ? '4px' : '2px'} rgba(255,255,255,0.5)`
            }}
          />
        ))}

        {constellations.map(constellation => (
          <svg
            key={constellation.id}
            className="absolute w-full h-full pointer-events-none"
            style={{
              left: `${constellation.x - 50}%`,
              top: `${constellation.y - 50}%`,
              width: '100px',
              height: '100px'
            }}
          >
            {constellation.lines.map((line, lineIndex) => {
              const node1 = constellation.nodes[line[0]];
              const node2 = constellation.nodes[line[1]];
              if (!node1 || !node2) return null;

              return (
                <line
                  key={lineIndex}
                  x1={node1.x - constellation.x + 50}
                  y1={node1.y - constellation.y + 50}
                  x2={node2.x - constellation.x + 50}
                  y2={node2.y - constellation.y + 50}
                  stroke="rgba(139, 92, 246, 0.4)"
                  strokeWidth="0.5"
                  className="animate-pulse"
                />
              );
            })}

            {constellation.nodes.map((node, nodeIndex) => (
              <circle
                key={nodeIndex}
                cx={node.x - constellation.x + 50}
                cy={node.y - constellation.y + 50}
                r="1.5"
                fill={`rgba(139, 92, 246, ${node.brightness})`}
                className="animate-pulse"
              />
            ))}
          </svg>
        ))}
      </div>

      {/* Main Content Area (relative z-10 for content over background) */}
      <div className="relative z-10">
        {/* Removed internal nav bar, App.jsx handles global nav */}

        {/* Hero Section */}
        <div className="text-center py-16 px-6">
          <div className="mb-8">
            <h1 className="text-8xl font-black mb-4 tracking-wider">
              <span className="text-white drop-shadow-2xl"> </span>
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                Query
              </span>
            </h1>
            <h2 className="text-7xl font-black italic bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-8">
              Quest
            </h2>
          </div>

          <div className="flex items-center justify-center space-x-6 mb-12">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-cyan-400 w-40"></div>
            <p className="text-xl text-purple-300 px-6 font-medium">
              Query the Data. Crack the Code. Master the Database.
            </p>
            <div className="h-px bg-gradient-to-r from-cyan-400 via-purple-400 to-transparent w-40"></div>
          </div>

          {/* User Stats Section (New) */}
          {isLoggedIn && userSummary ? (
            <div className="max-w-4xl mx-auto bg-gray-800/60 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30 shadow-lg mb-16">
              <h3 className="text-3xl font-bold text-white mb-6">Your Progress</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col items-center">
                  <Zap className="w-10 h-10 text-yellow-400 mb-2" />
                  <span className="text-3xl font-bold text-yellow-300">{userSummary.totalXP || 0}</span>
                  <span className="text-gray-400 text-sm">Total XP</span>
                </div>
                {/* <div className="flex flex-col items-center">
                  <Trophy className="w-10 h-10 text-orange-400 mb-2" />
                  <span className="text-3xl font-bold text-orange-300">{userSummary.streak || 0}</span>
                  <span className="text-gray-400 text-sm">Day Streak</span>
                </div> */}
                <div className="flex flex-col items-center">
                  <BookOpen className="w-10 h-10 text-green-400 mb-2" />
                  <span className="text-3xl font-bold text-green-300">{userSummary.completedLessons?.length || 0}</span>
                  <span className="text-gray-400 text-sm">Lessons Completed</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-lg text-gray-400 mb-16">
              Learn SQL interactively with hands-on practice, lessons, and quizzes.
            </div>
          )}

        </div>

      

      <div className="px-6 mb-20">
      <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {mainSections.map(section => (
          <div
            key={section.id}
            onClick={() => {
              if (section.external) {
                window.open(section.path, '_blank', 'noopener,noreferrer');
              } else {
                navigate(section.path);
              }
            }}
            className={`bg-gradient-to-br ${section.gradient}/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105 cursor-pointer group overflow-hidden relative`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${section.hoverGradient}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <div className="relative z-10">
              {/* <div className={`text-transparent bg-clip-text bg-gradient-to-r ${section.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {section.icon}
              </div> */}
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                {React.cloneElement(section.icon, { className: "w-12 h-12 text-white" })}
              </div>

              <h3 className="text-3xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors duration-300">
                {section.title}
              </h3>
              <p className="text-gray-400 mb-4 font-medium">{section.subtitle}</p>
              <p className="text-gray-300 mb-6 leading-relaxed">{section.description}</p>
              <button className={`w-full bg-gradient-to-r ${section.gradient} hover:${section.hoverGradient} py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl`}>
                Explore Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>


        

        {/* Features Section */}
        <div className="px-6 mb-20">
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md border border-slate-600/30 rounded-2xl hover:border-slate-500/50 transition-all duration-500 hover:transform hover:scale-105"
              >
                <div className="text-cyan-400 mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-4 text-cyan-300">{feature.title}</h4>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-12 border-t border-purple-500/20 backdrop-blur-md bg-black/30">
          <div className="mb-4">
            <p className="text-lg text-purple-300 font-medium mb-2">
              Unmask the queries. Recover the knowledge. Restore the mastery.
            </p>
            <p className="text-gray-400">
              © 2025 QueryQuest. Master SQL through interactive mysteries and real-world challenges.
            </p>
          </div>
          <div className="flex justify-center space-x-6 mt-6">
            <button className="text-gray-400 hover:text-purple-400 transition-colors">About</button>
            <button className="text-gray-400 hover:text-purple-400 transition-colors">Help</button>
            <button className="text-gray-400 hover:text-purple-400 transition-colors">Community</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;