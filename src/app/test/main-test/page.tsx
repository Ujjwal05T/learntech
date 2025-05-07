'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Flag, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { 
  alphabetSeries, 
  series, 
  analogy, 
  codingDecoding,
  arithmaicReasoning
} from '@/data/questionsData'

export default function MainTestPage() {
  const router = useRouter()
  const TOTAL_QUESTIONS = 50
  const TIME_LIMIT = 60* 60//ultiply by 60 to convert   minutes in seconds

  // Initialize states
  const [questions] = useState(() => {
    const allQuestions = [
      ...alphabetSeries,
      ...series, 
      ...analogy,
      ...codingDecoding,
      ...arithmaicReasoning
    ].sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS)
    return allQuestions
  })

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)

      return () => clearInterval(timer)
    } else if (timeLeft === 0 && !showResults) {
      handleSubmit()
    }
  }, [timeLeft, showResults])

  // Format time remaining
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

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
    } else{
      handleSubmit()
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

  const handleSubmit = () => {
    setShowResults(true)
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

  return (
    <div className="min-h-screen bg-[#ffffff] text-black flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 flex flex-col">
        <div className="mb-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {formatTime(timeLeft)}
          </div>
          <Clock className="w-6 h-6 mx-auto text-gray-400" />
        </div>

        <h3 className="text-lg font-semibold mb-4">Questions</h3>
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

        <Button
          onClick={handleSubmit}
          className="mt-auto bg-blue-500 hover:bg-blue-600"
        >
          Submit Test
        </Button>
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
              </div>
              <button
                onClick={() => toggleFlag(currentQuestionIndex)}
                className={`p-2 rounded-lg transition-colors ${
                  flaggedQuestions.has(currentQuestionIndex)
                    ? 'bg-yellow-500/20 text-yellow-500'
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
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </Button>
              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'} 
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Test Completed!</h2>
            <p className="text-xl mb-8">
              Your Score: {calculateScore()} out of {questions.length}
            </p>
            <Button
              onClick={() => router.push('/test')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Back to Topics
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}