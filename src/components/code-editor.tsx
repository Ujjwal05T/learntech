"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  theme?: "light" | "dark"
  className?: string
}

export function CodeEditor({ value, onChange, language, theme = "light", className }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [lineCount, setLineCount] = useState(1)

  // Update line count when content changes
  useEffect(() => {
    const lines = value.split("\n").length
    setLineCount(lines)
  }, [value])

  // Handle textarea input
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  // Handle tab key for proper indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.substring(0, start) + "  " + value.substring(end)
      onChange(newValue)

      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  // Sync scroll between line numbers and textarea
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (editorRef.current) {
      const lineNumbers = editorRef.current.querySelector(".line-numbers")
      if (lineNumbers) {
        lineNumbers.scrollTop = e.currentTarget.scrollTop
      }
    }
  }

  // Get syntax highlighting classes based on language
  const getSyntaxHighlighting = (code: string, lang: string) => {
    // Simple syntax highlighting - in a real implementation, you'd use a proper syntax highlighter
    const keywords: Record<string, string[]> = {
      javascript: [
        "function",
        "const",
        "let",
        "var",
        "if",
        "else",
        "for",
        "while",
        "return",
        "class",
        "import",
        "export",
      ],
      python: ["def", "class", "if", "else", "elif", "for", "while", "return", "import", "from", "try", "except"],
      java: ["public", "private", "class", "interface", "if", "else", "for", "while", "return", "import", "package"],
      cpp: [
        "#include",
        "int",
        "char",
        "float",
        "double",
        "if",
        "else",
        "for",
        "while",
        "return",
        "class",
        "public",
        "private",
      ],
      c: ["#include", "int", "char", "float", "double", "if", "else", "for", "while", "return", "struct"],
      go: ["func", "var", "const", "if", "else", "for", "range", "return", "package", "import", "struct"],
    }

    let highlightedCode = code
    const langKeywords = keywords[lang] || []

    langKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "g")
      highlightedCode = highlightedCode.replace(
        regex,
        `<span class="text-blue-600 dark:text-blue-400 font-semibold">${keyword}</span>`,
      )
    })

    // Highlight strings with proper contrast
    highlightedCode = highlightedCode.replace(
      /"([^"]*)"/g,
      '<span class="text-green-600 dark:text-green-400">"$1"</span>',
    )
    highlightedCode = highlightedCode.replace(
      /'([^']*)'/g,
      "<span class=\"text-green-600 dark:text-green-400\">'$1'</span>",
    )

    // Highlight comments with proper contrast
    if (lang === "javascript" || lang === "java" || lang === "cpp" || lang === "c" || lang === "go") {
      highlightedCode = highlightedCode.replace(
        /\/\/.*$/gm,
        '<span class="text-gray-500 dark:text-gray-400 italic">$&</span>',
      )
    } else if (lang === "python") {
      highlightedCode = highlightedCode.replace(
        /#.*$/gm,
        '<span class="text-gray-500 dark:text-gray-400 italic">$&</span>',
      )
    }

    return highlightedCode
  }

  return (
    <div ref={editorRef} className={cn("relative h-full font-mono text-sm", className)}>
      <div className="flex h-full">
        {/* Line Numbers */}
        <div className="line-numbers flex-shrink-0 w-12 bg-muted/50 border-r border-border overflow-hidden">
          <div className="py-4 px-2 text-right text-muted-foreground text-xs leading-6">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1} className="h-6 flex items-center justify-end">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative">
          {/* Syntax Highlighted Background */}
          <div
            className="absolute inset-0 p-4 pointer-events-none whitespace-pre-wrap break-words leading-6 text-foreground"
            dangerouslySetInnerHTML={{
              __html: getSyntaxHighlighting(value, language),
            }}
          />

          {/* Actual Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent resize-none outline-none leading-6 whitespace-pre-wrap break-words caret-foreground selection:bg-primary/20"
            placeholder={`// Start coding in ${language}...`}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  )
}
