'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { Shuffle } from 'lucide-react'
import { 
  alphabetSeries, 
  series, 
  analogy, 
  codingDecoding,
  arithmaicReasoning
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
    id: 'arithmaicReasoning',
    title: 'Arithmaic Reasoning',
    description: 'Practice Arithmaic Reasoning questions',
    count: arithmaicReasoning.length,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'random',
    title: 'Random Mix',
    description: 'Practice questions from all categories',
    count: alphabetSeries.length + series.length + analogy.length + codingDecoding.length + arithmaicReasoning.length,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'mainTest',
    title: 'Main Test',
    description: 'Take the main test',
    count: 0,
    color: 'from-red-500 to-yellow-500'
  }
]

export default function SelectionPage() {
  const router = useRouter()
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null)

  const handleTopicSelect = (topicId: string) => {
    router.push(`/test/${topicId}`)
  }

  // const handleRandomTest = () => {
  //   router.push('/test/random')
  // }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Select a Topic to Practice</h1>
          <p className="text-gray-600">Choose from our collection of aptitude questions or try a random mix</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {topics.map((topic) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setHoveredTopic(topic.id)}
              onHoverEnd={() => setHoveredTopic(null)}
            >
              <Card
                className="h-full cursor-pointer overflow-hidden"
                onClick={() => handleTopicSelect(topic.id)}
              >
                <div className={`h-2 bg-gradient-to-r ${topic.color}`} />
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2">{topic.title}</h2>
                  <p className="text-gray-600 mb-4">{topic.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {topic.count} questions available
                    </span>
                    <Button
                      variant="ghost"
                      className={`${
                        hoveredTopic === topic.id
                          ? 'bg-gradient-to-r ' + topic.color + ' text-white'
                          : ''
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          
        </motion.div>
      </div>
    </div>
  )
}