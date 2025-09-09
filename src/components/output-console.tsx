"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Clock, Copy, Download, Trash2 } from "lucide-react"

export type OutputLine = {
  id: string
  type: "info" | "stdout" | "warning" | "error" | "success"
  content: string
  timestamp: Date
}

type Props = {
  output: OutputLine[]
  isRunning?: boolean
  executionTime?: number
  className?: string
}

export function OutputConsole({ output, isRunning, executionTime, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const [shouldAutoScroll] = useState(true)

  // Auto-scroll to bottom on new output
  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [output.length, isRunning])

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (shouldAutoScroll && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        ;(scrollContainer as HTMLElement).scrollTop = (scrollContainer as HTMLElement).scrollHeight
      }
    }
  }, [output, shouldAutoScroll])

  const copyOutput = () => {
    const text = output.map((line) => `[${line.type.toUpperCase()}] ${line.content}`).join("\n")
    navigator.clipboard.writeText(text)
  }

  const downloadOutput = () => {
    const text = output
      .map((line) => `[${line.timestamp.toLocaleTimeString()}] [${line.type.toUpperCase()}] ${line.content}`)
      .join("\n")
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "output.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearOutput = () => {
    // This should be handled by parent; kept for button callback compatibility
  }

  const getLineClass = (type: OutputLine["type"]) => {
    switch (type) {
      case "error":
        return "text-red-400"
      case "warning":
        return "text-yellow-400"
      case "success":
        return "text-green-400"
      case "info":
        return "text-muted-foreground"
      default:
        return "text-foreground"
    }
  }

  return (
    <Card className={className}>
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {isRunning ? <Clock className="h-3 w-3 text-primary animate-spin" /> : null}
          </div>
          {executionTime !== undefined && (
            <Badge variant="outline" className="text-xs">
              {executionTime}ms
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={copyOutput} disabled={output.length === 0} className="h-7 px-2">
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadOutput}
            disabled={output.length === 0}
            className="h-7 px-2"
          >
            <Download className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={clearOutput} disabled={output.length === 0} className="h-7 px-2">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div ref={containerRef} className="h-full overflow-auto p-4 bg-black/5 dark:bg-black/40">
          {output.length === 0 ? (
            <div className="text-sm text-muted-foreground">No output yet</div>
          ) : (
            output.map((line) => (
              <div key={line.id} className="mb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span className={getLineClass(line.type)}>{line.type.toUpperCase()}</span>
                  <span className="text-[11px]">{line.timestamp.toLocaleTimeString()}</span>
                </div>

                <pre className="whitespace-pre-wrap break-words text-sm bg-transparent p-2 rounded">
                  {line.content}
                </pre>
              </div>
            ))
          )}

          {typeof executionTime === "number" && (
            <div className="mt-4 text-xs text-muted-foreground">Execution time: {executionTime} ms</div>
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}

// Export default as well to avoid import style mismatch
export default OutputConsole
