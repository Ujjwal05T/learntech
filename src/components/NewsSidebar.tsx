import React, { useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import { Upload } from 'lucide-react'

type FilterType = 'home' | 'articles' | 'videos' | 'expert' | 'news' | 'student'

function NewsSidebar() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('home')

  const handleFilter = (filter: FilterType) => {
    setActiveFilter(filter)
    toast('Feature coming soon!', {
      icon: '🚀',
      duration: 2000,
      className: 'bg-[#1a1a1a] text-white'
    })
  }

  return (
    <div className='h-[100vh] bg-[#060317] p-5 text-white'>
      <div className="p-4 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          News
        </h1>
        <div className="w-full space-y-2">
          <Button 
            variant="newslink" 
            size="lg" 
            className={cn(
              'w-full justify-center transition-all duration-200',
              activeFilter === 'home' && 'bg-white/10 text-blue-400'
            )}
            onClick={() => handleFilter('home')}
          >
            All Content
          </Button>
          <Button 
            variant="newslink" 
            size="lg" 
            className={cn(
              'w-full justify-center transition-all duration-200',
              activeFilter === 'articles' && 'bg-white/10 text-blue-400'
            )}
            onClick={() => handleFilter('articles')}
          >
            Articles
          </Button>
          <Button 
            variant="newslink" 
            size="lg" 
            className={cn(
              'w-full justify-center transition-all duration-200',
              activeFilter === 'videos' && 'bg-white/10 text-blue-400'
            )}
            onClick={() => handleFilter('videos')}
          >
            Videos
          </Button>
        </div>
      </div>

      <hr className='border-white/10 my-4' />

      <div className="p-4 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          You
        </h1>
        <div className="w-full space-y-2">
          {['expert', 'news', 'student'].map((filter) => (
            <Button 
              key={filter}
              variant="newslink" 
              size="lg" 
              className={cn(
                'w-full justify-center capitalize transition-all duration-200',
                activeFilter === filter && 'bg-white/10 text-blue-400'
              )}
              onClick={() => handleFilter(filter as FilterType)}
            >
              {filter}
            </Button>
          ))}
          
          <Link href="/news/upload" className='block'>
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              <Upload className="w-4 h-4" />
              Upload Content
            </Button>
          </Link>
        </div>
      </div>

      <hr className='border-white/10 my-4' />
      
      <div className='p-4 flex flex-col items-center'>
        <h1 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Upcoming
        </h1>
        <div className='bg-[rgba(255,255,255,0.1)] border-none rounded-lg p-4 w-full'>
          <h2 className='text-center mb-3 text-white/80'>Topic of next event</h2> 
          <Link href="/news/nextEvent" className='block'>
            <Button 
              variant="create" 
              size="lg" 
              className='w-full justify-center hover:bg-black/20 transition-colors'
            >
              Ask a question
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NewsSidebar
