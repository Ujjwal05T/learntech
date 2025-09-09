"use client"

import { useEffect, type ReactNode } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Minimize2, X } from "lucide-react"

interface FullscreenModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function FullscreenModal({ isOpen, onClose, title, children }: FullscreenModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-none w-screen h-screen p-0 gap-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <h2 className="text-lg font-semibold">{title}</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
