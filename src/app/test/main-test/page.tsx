'use client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Flag, ChevronLeft, ChevronRight, Clock, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { 
  alphabetSeries, 
  series, 
  analogy, 
  codingDecoding,
  arithmaicReasoning
} from '@/data/questionsData'
import axios from 'axios'

export default function MainTestPage() {
  const router = useRouter()
  const TOTAL_QUESTIONS = 50
  const TIME_LIMIT = 60 * 60 // 60 minutes in seconds

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  //For mobile sidebar
  const [showSidebar, setShowSidebar] = useState(false)

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
      // Auto-hide sidebar on mobile when navigating
      if (window.innerWidth < 768) {
        setShowSidebar(false)
      }
    } else{
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      // Auto-hide sidebar on mobile when navigating
      if (window.innerWidth < 768) {
        setShowSidebar(false)
      }
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

  const handleSubmit = async () => {
    // Only allow submission if time expired or all questions answered
    if (timeLeft === 0 || areAllQuestionsAnswered()) {
      setShowResults(true);
      try {
        setIsSubmitting(true);
        setSubmitError(null);
        
        const score = calculateScore();
  
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/test/update`,
          {
            score: score
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
  
        if (response.status !== 200) {
          throw new Error('Failed to save score');
        }
      } catch (error) {
        setSubmitError('Failed to submit answers. Please try again.');
        console.error('Error submitting answers:', error); 
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Show warning that not all questions are answered
      setSubmitError(`Please answer all ${questions.length} questions before submitting.`);
      
      // Auto-dismiss error after 5 seconds
      setTimeout(() => {
        setSubmitError(null);
      }, 5000);
      
      // If on last question, go to the first unanswered question
      if (currentQuestionIndex === questions.length - 1) {
        const firstUnansweredIndex = questions.findIndex((_, index) => 
          selectedAnswers[index] === undefined
        );
        if (firstUnansweredIndex !== -1) {
          setCurrentQuestionIndex(firstUnansweredIndex);
        }
      }
    }
  };
  const areAllQuestionsAnswered = () => {
    return Object.keys(selectedAnswers).length === questions.length;
  };

  const calculateScore = () => {
    let score = 0
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score++
      }
    })
    return score
  }

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
    // Auto-hide sidebar on mobile when selecting a specific question
    if (window.innerWidth < 768) {
      setShowSidebar(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col md:flex-row">
      {/* Floating Timer for Mobile */}
      <div className="md:hidden fixed top-4 right-4 z-30 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 border border-gray-200">
        <Clock className="w-4 h-4 text-blue-500" />
        <span className="font-bold text-blue-600">{formatTime(timeLeft)}</span>
      </div>

      {/* Mobile Sidebar Toggle Button */}
      <button 
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden fixed bottom-4 right-4 z-30 bg-blue-500 text-white p-3 rounded-full shadow-lg"
        aria-label="Toggle question navigation"
      >
        {showSidebar ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Responsive */}
      <AnimatePresence>
        {(showSidebar || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
          <motion.div 
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed md:relative z-20 h-full w-[280px] md:w-64 bg-gray-50 border-r border-gray-200 p-4 flex flex-col overflow-y-auto
              ${showSidebar ? 'block' : 'hidden md:flex'}`}
          >
            <div className="mb-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatTime(timeLeft)}
              </div>
              <Clock className="w-6 h-6 mx-auto text-gray-400" />
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Questions</h3>
              <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {selectedAnswers ? Object.keys(selectedAnswers).length : 0}/{questions.length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
              <div 
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `${Object.keys(selectedAnswers).length / questions.length * 100}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-4 gap-2 mb-4">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => jumpToQuestion(index)}
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

            {/* Legend */}
            <div className="mt-4 mb-6 text-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-green-500/20 rounded"></div>
                <span className="text-gray-600">Answered</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-gray-600">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-3 h-3 bg-gray-100 rounded">
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                </div>
                <span className="text-gray-600">Flagged</span>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-auto bg-blue-500 hover:bg-blue-600 py-5 text-base"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Submitting...</span>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                'Submit Test'
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 pt-16 md:pt-8 overflow-y-auto">
        {submitError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {submitError}
            <Button 
              onClick={handleSubmit} 
              className="ml-4 bg-red-500 hover:bg-red-600 text-sm py-1 px-2"
              size="sm"
            >
              Retry
            </Button>
          </div>
        )}

        {!showResults ? (
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Question Header */}
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <div className="flex items-center gap-2 md:gap-4">
                <span className="text-lg md:text-xl font-semibold">Question {currentQuestionIndex + 1}</span>
                <span className="text-xs md:text-sm text-gray-500">of {questions.length}</span>
              </div>
              <button
                onClick={() => toggleFlag(currentQuestionIndex)}
                className={`p-2 rounded-lg transition-colors ${
                  flaggedQuestions.has(currentQuestionIndex)
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Flag className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Question */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-medium">{currentQuestion.question}</h2>
            </div>

            {/* Options */}
            <div className="space-y-3 md:space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`w-full p-4 md:p-6 text-left rounded-lg border transition-colors ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`flex items-center justify-center w-7 h-7 rounded-full border ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 text-gray-500'
                    }`}>{String.fromCharCode(65 + index)}</span>
                    <span className="text-base md:text-lg">{option}</span>
                  </span>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 gap-3">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 py-6 px-4 md:py-6 md:px-6"
                variant="outline"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              
              <span className="hidden sm:flex items-center text-gray-500">
                {currentQuestionIndex + 1} of {questions.length}
              </span>
              
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 py-6 px-4 md:py-6 md:px-6 bg-blue-500 hover:bg-blue-600"
              >
                {currentQuestionIndex === questions.length - 1 ? (
                  isSubmitting ? (
                    <>
                      <span>Submitting</span>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : (
                    <span>Submit</span>
                  )
                ) : (
                  <>
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto p-4 mt-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center border border-gray-100">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-blue-600">{Math.round((calculateScore() / questions.length) * 100)}%</span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Test Completed!</h2>
              
              <p className="text-lg md:text-xl mb-2">
                Your Score: <span className="font-semibold text-blue-600">{calculateScore()}</span> out of {questions.length}
              </p>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8 mt-4">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(calculateScore() / questions.length) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-center">
                <Button
                  onClick={() => router.push('/test')}
                  className="bg-blue-500 hover:bg-blue-600 py-6"
                  size="lg"
                >
                  Back to Topics
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}