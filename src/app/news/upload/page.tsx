'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from 'axios'
import { toast } from 'react-hot-toast'

interface UploadForm {
  title: string
  description: string
  mediaType: 'text' | 'video'
  author: string
  mediaUrl: File
}

export default function UploadPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<UploadForm>({
    title: '',
    description: '',
    mediaType: 'text',
    author: '',
    mediaUrl: null as unknown as File
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!selectedFile) {
        toast.error('Please select a file')
        return
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/upload`, 
        {
          title: formData.title,
          description: formData.description,
          mediaType: formData.mediaType,
          author: formData.author,
          mediaUrl: selectedFile
        }, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100)
            )
            console.log(`Upload Progress: ${percentCompleted}%`)
          }
        }
      )

      if (response.data) {
        toast.success('Content uploaded successfully!')
        router.push('/news')
      }
    } catch (error) {
      console.error('Upload error:', error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Upload failed')
        console.error('Error details:', error.response?.data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (e.g., max 100MB)
      const maxSize = 100 * 1024 * 1024 // 100MB in bytes
      if (file.size > maxSize) {
        toast.error('File is too large. Maximum size is 100MB')
        return
      }

      setSelectedFile(file)
      setFormData(prev => ({ ...prev, mediaUrl: file }))
    }
  }

  return (
    <div className="min-h-screen bg-[#060317] text-white p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Upload Content
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Content Type</label>
            <Select
              value={formData.mediaType}
              onValueChange={(value: 'text' | 'video') => 
                setFormData({ ...formData, mediaType: value })}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Article</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-white/5 border-white/10"
              placeholder="Enter content title"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white/5 border-white/10 min-h-[100px]"
              placeholder="Enter content description"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Author</label>
            <Input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="bg-white/5 border-white/10"
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {formData.mediaType === 'text' ? 'Article File (PDF, DOC)' : 'Video File'}
            </label>
            <Input
              type="file"
              onChange={handleFileChange}
              accept={formData.mediaType === 'text' ? '.pdf,.doc,.docx' : 'video/*'}
              className="bg-white/5 border-white/10 file:bg-blue-600 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4 file:hover:bg-blue-700 file:cursor-pointer"
              required
            />
            {selectedFile && (
              <p className="text-sm text-gray-400">
                Selected file: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !selectedFile}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload Content'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}