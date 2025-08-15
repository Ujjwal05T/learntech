'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import { 
  alphabetSeries, 
  series, 
  analogy, 
  codingDecoding,
  arithmaticReasoning
} from '@/data/questionsData'

const topics = [
  {
    id: 'alphabet',
    title: 'Alphabet Series',
    description: 'Practice alphabet pattern questions',
    count: alphabetSeries.length,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'number',
    title: 'Number Series',
    description: 'Practice numerical pattern questions',
    count: series.length,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'logical',
    title: 'Logical Reasoning',
    description: 'Practice logical reasoning questions',
    count: analogy.length,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'verbal',
    title: 'Verbal Ability',
    description: 'Practice verbal ability questions',
    count: codingDecoding.length,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'arithmetic',
    title: 'Arithmetic Reasoning',
    description: 'Practice arithmetic reasoning questions',
    count: arithmaticReasoning.length,
    color: 'from-teal-500 to-emerald-500'
  },
  {
    id: 'random',
    title: 'Random Mix',
    description: 'Practice questions from all categories',
    count: alphabetSeries.length + series.length + analogy.length + codingDecoding.length + arithmaticReasoning.length,
    color: 'from-indigo-500 to-purple-500'
  },
  // Main test commented out for now
  /*
  {
    id: 'main-test',
    title: 'Main Test',
    description: 'Take the comprehensive assessment test',
    count: 50,
    color: 'from-red-500 to-yellow-500'
  }
  */
]

export default function SelectionPage() {
  const router = useRouter()
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null)

  const handleTopicSelect = (topicId: string) => {
    router.push(`/test/${topicId}`)
  }

  const navigateToHome = () => {
    router.push('/home')
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden py-12">
      {/* Subtle Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-100 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-purple-100 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-pink-100 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex justify-between items-center mb-8">
          <Button 
            onClick={navigateToHome}
            variant="outline" 
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <Home className="mr-2 h-4 w-4" /> Home
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-3">
            Select a Topic
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our collection of aptitude questions to practice
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              onHoverStart={() => setHoveredTopic(topic.id)}
              onHoverEnd={() => setHoveredTopic(null)}
            >
              <Card
                className="h-full cursor-pointer overflow-hidden bg-white border border-gray-100 hover:border-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={() => handleTopicSelect(topic.id)}
              >
                <div className={`h-2 bg-gradient-to-r ${topic.color}`} />
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">{topic.title}</h2>
                  <p className="text-gray-600 mb-4 text-sm">{topic.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {topic.count} questions
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`transition-all duration-300 ${
                        hoveredTopic === topic.id
                          ? `bg-gradient-to-r ${topic.color} text-white shadow-md`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTopicSelect(topic.id)
                      }}
                    >
                      Start Practice
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10 border-t border-gray-200 pt-6">
          <p className="text-gray-500 text-sm">
            Complete practice sessions to improve your score on the leaderboard
          </p>
        </div>
      </div>
    </div>
  )
}