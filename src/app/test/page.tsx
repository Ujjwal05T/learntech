'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Flag, ChevronLeft, ChevronRight } from 'lucide-react'

// Mock data matching your testModal schema
const dummyQuestions = [
  {
    _id: '1',
    question: 'What is the primary purpose of useState in React?',
    options: [
      'To manage component state',
      'To handle API calls',
      'To style components',
      'To route between pages'
    ],
    correctOption: 0,
    questionType: 'basic'
  },
  {
    _id: '2',
    question: 'Which hook is used for side effects in React?',
    options: [
      'useState',
      'useEffect',
      'useContext',
      'useReducer'
    ],
    correctOption: 1,
    questionType: 'intermediate'
  },
  {
    _id: '3',
    question: 'What is the virtual DOM in React?',
    options: [
      'A direct copy of the browser DOM',
      'A lightweight copy of the browser DOM',
      'A programming concept',
      'A JavaScript library'
    ],
    correctOption: 1,
    questionType: 'advanced'
  }
]

export default function TestPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())

  const currentQuestion = dummyQuestions[currentQuestionIndex]

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion._id]: optionIndex
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < dummyQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newFlags = new Set(prev)
      if (newFlags.has(questionId)) {
        newFlags.delete(questionId)
      } else {
        newFlags.add(questionId)
      }
      return newFlags
    })
  }

  const calculateScore = () => {
    let score = 0
    dummyQuestions.forEach(question => {
      if (selectedAnswers[question._id] === question.correctOption) {
        score++
      }
    })
    return score
  }

  return (
    <div className="min-h-screen bg-[#ffffff] text-black flex">
      {/* Sidebar */}
      <div className="w-64 bg-white/5 backdrop-blur-sm border-r border-white/10 p-4 flex flex-col">
        <h3 className="text-lg font-semibold mb-4 text-black-400">Questions</h3>
        <div className="grid grid-cols-4 gap-2">
          {dummyQuestions.map((question, index) => (
            <button
              key={question._id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center text-sm
                transition-colors relative
                ${currentQuestionIndex === index ? 'bg-blue-500 text-white' : 
                  selectedAnswers[question._id] !== undefined ? 'bg-green-500/20 text-green-600' : 
                  'bg-white/5 hover:bg-white/10'}
              `}
            >
              {index + 1}
              {flaggedQuestions.has(question._id) && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-6">
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white/5 rounded" /> Not Attempted
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500/20 rounded" /> Attempted
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded" /> Flagged
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {!showResults ? (
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Question Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <span className="text-xl font-semibold">Question {currentQuestionIndex + 1}</span>
                <span className="px-3 py-1 bg-blue-500/20 rounded-full text-sm text-blue-400">
                  {currentQuestion.questionType}
                </span>
              </div>
              <button
                onClick={() => toggleFlag(currentQuestion._id)}
                className={`p-2 rounded-lg transition-colors ${
                  flaggedQuestions.has(currentQuestion._id)
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <Flag className="w-5 h-5" />
              </button>
            </div>

            {/* Question */}
            <h2 className="text-2xl mb-8">{currentQuestion.question}</h2>

            {/* Options */}
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`w-full p-6 text-left rounded-l border-gray-100 transition-colors ${
                    selectedAnswers[currentQuestion._id] === index
                      ? 'bg-blue-500/20 border-blue-500'
                      : 'bg-white/5 hover:bg-white/10'
                  } border border-white/10`}
                >
                  <span className="text-lg">{option}</span>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {currentQuestionIndex === dummyQuestions.length - 1 ? 'Finish' : 'Next'} 
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 rounded-xl p-8 text-center backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold mb-4">Test Completed!</h2>
            <p className="text-xl mb-6">
              Your Score: {calculateScore()} out of {dummyQuestions.length}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 py-3 rounded-lg font-medium text-white"
            >
              Take Another Test
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}