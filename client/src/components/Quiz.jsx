// client/src/components/Quiz.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect
import { Check, AlertCircle } from 'lucide-react';

const Quiz = ({ quiz, onAnswer, quizCompleted }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // If quiz is already completed for this lesson (from parent state), show result immediately
    if (quizCompleted) {
      setSelectedAnswer(quiz.correctAnswer); // Show correct answer if completed
      setIsCorrect(true);
      setShowResult(true);
    } else {
      // Reset quiz state when quiz prop changes (e.g., navigating to a new lesson)
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    }
  }, [quiz, quizCompleted]); // Depend on quiz object and quizCompleted status

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === quiz.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    onAnswer(correct, selectedAnswer); // Notify parent
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Quiz</h3>
      <p className="text-gray-300 mb-4">{quiz.question}</p>

      <div className="space-y-2 mb-4">
        {quiz.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showResult && setSelectedAnswer(index)}
            disabled={showResult || quizCompleted} // Disable if quiz completed
            className={`w-full p-3 text-left rounded-lg border transition-colors ${
              showResult
                ? index === quiz.correctAnswer
                  ? 'bg-green-900/50 border-green-600 text-green-300'
                  : index === selectedAnswer && !isCorrect
                  ? 'bg-red-900/50 border-red-600 text-red-300'
                  : 'bg-gray-700 border-gray-600 text-gray-300'
                : selectedAnswer === index
                ? 'bg-blue-900/50 border-blue-600 text-blue-300'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {!showResult || quizCompleted ? ( // Render submit button if not shown result or if quiz already completed
        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null || quizCompleted}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Submit Answer
        </button>
      ) : (
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">
              {isCorrect ? 'Correct! Well done!' : 'Incorrect. Try again!'}
            </span>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;