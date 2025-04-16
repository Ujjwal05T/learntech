'use client'
import { useEffect, useState } from 'react'
import VideoCards from '@/components/VideoCards'
// import ArticleCards from '@/components/ArticleCards'
import NewsSidebar from '@/components/NewsSidebar'
import axios from 'axios'

interface NewsItem {
  author: string
  createdAt: string
  description: string
  mediaType: 'text' | 'video'
  mediaUrl: string
  title: string
  _id?: string
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/blogs`)
      setNewsItems(response.data.data)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row bg-[#060317] min-h-screen">
      {/* Sidebar - YouTube dimensions */}
      <div className="md:w-60 flex-shrink-0">
        <NewsSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {/* Content wrapper with max-width and padding like YouTube */}
        <div className="max-w-[2150px] mx-auto px-4 md:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {newsItems.map((item) => (
                item.mediaType === 'video' ? (
                  <VideoCards
                    key={item._id}
                    videoSrc={item.mediaUrl}
                    title={item.title}
                    description={item.description}
                    authorName={item.author}
                    uploadedTime={new Date(item.createdAt).toLocaleString()}
                  />
              ) : (
                // <ArticleCards
                //   key={item._id}
                //   title={item.title}
                //   description={item.description}
                //   authorName={item.author}
                //   uploadedTime={new Date(item.createdAt).toLocaleString()}
                // />
                null
              )
            ))}
          </div>
          )}
          </div>
      </main>
    </div>
  )
}