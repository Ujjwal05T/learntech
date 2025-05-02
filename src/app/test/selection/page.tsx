
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Flag, ChevronLeft, ChevronRight } from 'lucide-react'
// import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { 
  alphabetSeries, 
  series, 
  analogy, 
  codingDecoding,
  arithmaicReasoning
} from '@/data/questionsData'

const questionsByType = {
  alphabet: alphabetSeries,
  number: series,
  logical: analogy,
  verbal: codingDecoding,
  arithmeticReasoning: arithmaicReasoning,
  random: [...alphabetSeries, ...series, ...analogy, ...codingDecoding, ...arithmaicReasoning]
}

// interface Question {
//   question: string
//   options: string[]
//   correctAnswer: number
//   type: string
// }

export default function TestPage() {
  const params = useParams()
  // const router = useRouter()

  const topicId = params.topic as string
  
  // Get questions based on topic
  const [questions] = useState(() => {
    const baseQuestions = questionsByType[topicId as keyof typeof questionsByType] || []
    if (topicId === 'random') {
      // Shuffle only once when component mounts
      return [...baseQuestions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10)
    }
    return baseQuestions
  })

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({}) // Changed from string to number
  const [showResults, setShowResults] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set()) // Changed from string to number

  const currentQuestion = questions[currentQuestionIndex]

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
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

  const toggleFlag = (questionIndex: number) => {
    setFlaggedQuestions(prev => {
      const newFlags = new Set(prev)
      if (newFlags.has(questionIndex)) {
        newFlags.delete(questionIndex)
      } else {
        newFlags.add(questionIndex)
      }
      return newFlags
    })
  }

  const calculateScore = () => {
    let score = 0
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score++
      }
    })
    return score
  }

  if (!currentQuestion) {
    return null // Add safety check for undefined currentQuestion
  }

  return (
    <div className="min-h-screen bg-[#ffffff] text-black flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 flex flex-col">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Questions</h3>
        <div className="grid grid-cols-4 gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center text-sm
                transition-colors relative
                ${currentQuestionIndex === index ? 'bg-blue-500 text-white' : 
                  selectedAnswers[index] !== undefined ? 'bg-green-500/20 text-green-600' : 
                  'bg-gray-100 hover:bg-gray-200'}
              `}
            >
              {index + 1}
              {flaggedQuestions.has(index) && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-6">
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-100 rounded" /> Not Attempted
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
                <span className="px-3 py-1 bg-blue-100 rounded-full text-sm text-blue-600">
                  {currentQuestion.type}
                </span>
              </div>
              <button
                onClick={() => toggleFlag(currentQuestionIndex)}
                className={`p-2 rounded-lg transition-colors ${
                  flaggedQuestions.has(currentQuestionIndex)
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-gray-100 hover:bg-gray-200'
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
                  className={`w-full p-6 text-left rounded-lg border transition-colors ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
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
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
              >
                {currentQuestionIndex === alphabetSeries.length - 1 ? 'Finish' : 'Next'} 
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 text-center shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4">Test Completed!</h2>
            <p className="text-xl mb-6">
              Your Score: {calculateScore()} out of {alphabetSeries.length}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-medium text-white"
            >
              Take Another Test
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}