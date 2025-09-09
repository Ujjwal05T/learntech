"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Save, Check, Clock } from "lucide-react"

interface AutoSaveIndicatorProps {
  isAutoSaving: boolean
  lastSaved?: Date
  hasUnsavedChanges: boolean
}

export function AutoSaveIndicator({ isAutoSaving, lastSaved, hasUnsavedChanges }: AutoSaveIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState("")

  useEffect(() => {
    if (!lastSaved) return

    const updateTimeAgo = () => {
      const now = new Date()
      const diff = now.getTime() - lastSaved.getTime()
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)

      if (seconds < 60) {
        setTimeAgo("just now")
      } else if (minutes < 60) {
        setTimeAgo(`${minutes}m ago`)
      } else {
        setTimeAgo(`${hours}h ago`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [lastSaved])

  if (isAutoSaving) {
    return (
      <Badge variant="secondary" className="gap-1 text-xs">
        <Clock className="h-3 w-3 animate-spin" />
        Saving...
      </Badge>
    )
  }

  if (hasUnsavedChanges) {
    return (
      <Badge variant="outline" className="gap-1 text-xs">
        <Save className="h-3 w-3" />
        Unsaved
      </Badge>
    )
  }

  if (lastSaved) {
    return (
      <Badge variant="secondary" className="gap-1 text-xs">
        <Check className="h-3 w-3" />
        Saved {timeAgo}
      </Badge>
    )
  }

  return null
}
