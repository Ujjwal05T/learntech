"use client"

import { useEffect } from "react"

interface KeyboardShortcutsProps {
  onRunCode: () => void
  onSaveCode: () => void
  onToggleTheme: () => void
  onClearOutput: () => void
  onFormatCode: () => void
  disabled?: boolean
}

export function KeyboardShortcuts({
  onRunCode,
  onSaveCode,
  onToggleTheme,
  onClearOutput,
  onFormatCode,
  disabled = false,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return

      // Ctrl/Cmd + Enter: Run Code
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault()
        onRunCode()
        return
      }

      // Ctrl/Cmd + S: Save Code
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        onSaveCode()
        return
      }

      // Ctrl/Cmd + Shift + T: Toggle Theme
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "T") {
        e.preventDefault()
        onToggleTheme()
        return
      }

      // Ctrl/Cmd + Shift + K: Clear Output
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "K") {
        e.preventDefault()
        onClearOutput()
        return
      }

      // Ctrl/Cmd + Shift + F: Format Code
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "F") {
        e.preventDefault()
        onFormatCode()
        return
      }

      // F11: Toggle Fullscreen (handled by browser, but we can track it)
      if (e.key === "F11") {
        // Let browser handle fullscreen
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onRunCode, onSaveCode, onToggleTheme, onClearOutput, onFormatCode, disabled])

  return null
}
