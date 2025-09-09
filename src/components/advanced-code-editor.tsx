"use client"

import React, { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Search, Replace, ZoomIn, ZoomOut, Maximize2, Minimize2, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface AdvancedCodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  theme?: "light" | "dark"
  className?: string
}

export default function AdvancedCodeEditor({ value, onChange, language, theme, className }: any) {
  const editorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // ALWAYS set textContent (not innerHTML) so we don't inject HTML into the model
    if (editorRef.current && (editorRef.current.textContent ?? "") !== value) {
      editorRef.current.textContent = value
    }
  }, [value])

  // On user input, read textContent (plain text) instead of innerHTML
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent ?? ""
    onChange(text)
  }

  // Prevent HTML from being pasted — force plain text paste
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    // insert plain text at cursor
    document.execCommand("insertText", false, text)
    // update model
    const current = editorRef.current?.textContent ?? ""
    onChange(current)
  }

  return (
    <div
      ref={editorRef}
      contentEditable
      spellCheck={false}
      onInput={handleInput}
      onPaste={handlePaste}
      className={className}
      // do NOT use dangerouslySetInnerHTML here
    />
  )
}
