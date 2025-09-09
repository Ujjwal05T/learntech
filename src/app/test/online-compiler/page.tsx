"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Settings,
  Moon,
  Sun,
  Code2,
  Terminal,
  Copy,
  Download,
  Maximize2,
  Trash2,
  Wand2,
  Share,
} from "lucide-react"
import AdvancedCodeEditor from "@/components/advanced-code-editor"
import { OutputConsole, type OutputLine } from "@/components/output-console"
import { SettingsDialog, type AppSettings, defaultSettings } from "@/components/settings-dialog"
import { LanguageSelector, type Language } from "@/components/language-selector"
import { ResizablePanels } from "@/components/resizable-panels"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { FullscreenModal } from "@/components/fullscreen-modal"
import { AutoSaveIndicator } from "@/components/auto-save-indicator"
import { CodeFormatter } from "@/components/code-formatter"
import type { CompilationRequest } from "@/lib/compiler-service"
import { useToast } from "@/hooks/use-toast"

export default function CompilerPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [code, setCode] = useState("")
  const [output, setOutput] = useState<OutputLine[]>([])
  const [executionTime, setExecutionTime] = useState<number>()
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false)
  const [isOutputFullscreen, setIsOutputFullscreen] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date>()
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const { toast } = useToast()

  const languages: Language[] = [
    {
      value: "javascript",
      label: "JavaScript",
      extension: "js",
      version: "ES2023",
      description: "Modern JavaScript with latest features",
      features: ["ES6+ Syntax", "Async/Await", "Modules", "Arrow Functions"],
      compilerFlags: ["--strict", "--target=es2023"],
    },
    {
      value: "python",
      label: "Python",
      extension: "py",
      version: "3.11",
      description: "High-level programming language",
      features: ["Dynamic Typing", "Rich Libraries", "Object-Oriented", "Functional Programming"],
      compilerFlags: ["-O", "-W ignore"],
    },
    {
      value: "java",
      label: "Java",
      extension: "java",
      version: "17 LTS",
      description: "Enterprise-grade object-oriented language",
      features: ["Strong Typing", "JVM", "Garbage Collection", "Platform Independent"],
      compilerFlags: ["-Xlint:all", "-encoding UTF-8"],
    },
    {
      value: "cpp",
      label: "C++",
      extension: "cpp",
      version: "C++20",
      description: "Systems programming with modern features",
      features: ["Templates", "RAII", "Smart Pointers", "Concepts"],
      compilerFlags: ["-std=c++20", "-Wall", "-Wextra"],
    },
    {
      value: "c",
      label: "C",
      extension: "c",
      version: "C17",
      description: "Low-level systems programming",
      features: ["Manual Memory Management", "Pointers", "Preprocessor", "Minimal Runtime"],
      compilerFlags: ["-std=c17", "-Wall", "-Wextra"],
    },
    {
      value: "go",
      label: "Go",
      extension: "go",
      version: "1.21",
      description: "Fast, simple, and reliable",
      features: ["Goroutines", "Channels", "Fast Compilation", "Built-in Testing"],
      compilerFlags: ["-race", "-buildmode=exe"],
    },
  ]

  const codeTemplates: Record<string, string> = {
    javascript: `// JavaScript Example - ES2023 Features
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
console.log("Current time:", new Date().toLocaleString());

// Modern async example
const fetchData = async () => {
  return new Promise(resolve => 
    setTimeout(() => resolve("Data loaded!"), 100)
  );
};

fetchData().then(console.log);`,
    python: `# Python Example - Modern Features
def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("World"))
print("Python version info available")

# List comprehension example
numbers = [x**2 for x in range(5)]
print(f"Squares: {numbers}")

# Type hints and dataclass
from dataclasses import dataclass

@dataclass
class Person:
    name: str
    age: int

person = Person("Alice", 30)
print(f"Person: {person}")`,
    java: `// Java Example - Modern Java 17 Features
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Text blocks (Java 15+)
        var json = \"\"\"
            {
                "name": "Java",
                "version": "17"
            }
            \"\"\";
        
        System.out.println("JSON: " + json);
        
        // Pattern matching preview
        var result = switch ("java") {
            case "java" -> "Compiled language";
            case "python" -> "Interpreted language";
            default -> "Unknown";
        };
        
        System.out.println("Result: " + result);
    }
}`,
    cpp: `// C++ Example - Modern C++20 Features
#include <iostream>
#include <vector>
#include <ranges>
#include <string>

int main() {
    std::cout << "Hello, World!" << std::endl;
    
    // Ranges and views (C++20)
    std::vector<int> numbers{1, 2, 3, 4, 5};
    
    auto even_squares = numbers 
        | std::views::filter([](int n) { return n % 2 == 0; })
        | std::views::transform([](int n) { return n * n; });
    
    std::cout << "Even squares: ";
    for (auto n : even_squares) {
        std::cout << n << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`,
    c: `// C Example - Modern C17 Features
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    printf("Hello, World!\\n");
    
    // VLA (Variable Length Arrays)
    int size = 5;
    int array[size];
    
    for (int i = 0; i < size; i++) {
        array[i] = i * i;
    }
    
    printf("Squares: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", array[i]);
    }
    printf("\\n");
    
    return 0;
}`,
    go: `// Go Example - Modern Go 1.21 Features
package main

import (
    "fmt"
    "time"
)

func main() {
    fmt.Println("Hello, World!")
    
    // Goroutines and channels
    ch := make(chan string, 1)
    
    go func() {
        time.Sleep(100 * time.Millisecond)
        ch <- "Goroutine completed!"
    }()
    
    // Generic function example
    numbers := []int{1, 2, 3, 4, 5}
    doubled := Map(numbers, func(x int) int { return x * 2 })
    
    fmt.Printf("Doubled: %v\\n", doubled)
    fmt.Println(<-ch)
}

// Generic Map function
func Map[T, U any](slice []T, fn func(T) U) []U {
    result := make([]U, len(slice))
    for i, v := range slice {
        result[i] = fn(v)
    }
    return result
}
}`,
  }

  const autoSave = useCallback(async () => {
    if (!settings.editor.autoSave || !hasUnsavedChanges) return

    setIsAutoSaving(true)
    try {
      const saveData = {
        code,
        language: selectedLanguage,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem("compiler-autosave", JSON.stringify(saveData))
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error("Auto-save failed:", error)
    } finally {
      setIsAutoSaving(false)
    }
  }, [code, selectedLanguage, hasUnsavedChanges, settings.editor.autoSave])

  useEffect(() => {
    if (!settings.editor.autoSave) return

    const timer = setTimeout(autoSave, 2000) // Auto-save after 2 seconds of inactivity
    return () => clearTimeout(timer)
  }, [code, autoSave, settings.editor.autoSave])

  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [code])

  useEffect(() => {
    const savedSettings = localStorage.getItem("compiler-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)
        setSelectedLanguage(parsed.language)
        if (
          parsed.theme === "dark" ||
          (parsed.theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
          setIsDarkMode(true)
          document.documentElement.classList.add("dark")
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }

    const autoSaved = localStorage.getItem("compiler-autosave")
    if (autoSaved) {
      try {
        const { code: savedCode, language: savedLanguage, timestamp } = JSON.parse(autoSaved)
        if (savedCode && savedLanguage) {
          setCode(savedCode)
          setSelectedLanguage(savedLanguage)
          setLastSaved(new Date(timestamp))
          setHasUnsavedChanges(false)
        }
      } catch (error) {
        console.error("Failed to load auto-saved code:", error)
      }
    }
  }, [])

  const handleSettingsChange = (newSettings: AppSettings) => {
    setSettings(newSettings)
    localStorage.setItem("compiler-settings", JSON.stringify(newSettings))

    // Apply theme changes
    if (
      newSettings.theme === "dark" ||
      (newSettings.theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove("dark")
    }
  }

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark"
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
    handleSettingsChange({ ...settings, theme: newTheme })
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    const startTime = Date.now()
    setOutput([])

    const selectedLang = languages.find((l) => l.value === selectedLanguage)
    const compilationStart: OutputLine = {
      id: `${Date.now()}-start`,
      type: "info",
      content: `Compiling ${selectedLang?.label} ${selectedLang?.version} code...`,
      timestamp: new Date(),
    }
    setOutput([compilationStart])

    try {
      const compilationRequest: CompilationRequest = {
        code,
        language: selectedLanguage,
        settings: settings.compiler,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/test/compileCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(compilationRequest),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const newOutput: OutputLine[] = [compilationStart]

      // Add compiler flags info if warnings enabled
      if (settings.compiler.warnings && selectedLang?.compilerFlags) {
        newOutput.push({
          id: `${Date.now()}-flags`,
          type: "info",
          content: `Using flags: ${selectedLang.compilerFlags.join(" ")}`,
          timestamp: new Date(),
        })
      }

      // Add compilation result
      if (result.success) {
        newOutput.push({
          id: `${Date.now()}-compile`,
          type: "success",
          content: `Compilation successful (${settings.compiler.optimization} optimization)`,
          timestamp: new Date(),
        })
      } else {
        newOutput.push({
          id: `${Date.now()}-compile-error`,
          type: "error",
          content: "Compilation failed",
          timestamp: new Date(),
        })
      }

      // Add warnings
      result.warnings?.forEach((warning: string, index: number) => {
        newOutput.push({
          id: `${Date.now()}-warning-${index}`,
          type: "warning",
          content: warning,
          timestamp: new Date(),
        })
      })

      // Add errors
      result.errors?.forEach((error: string, index: number) => {
        newOutput.push({
          id: `${Date.now()}-error-${index}`,
          type: "error",
          content: error,
          timestamp: new Date(),
        })
      })

      // Add output
      if (result?.data?.output && Array.isArray(result.data.output)) {
      result.data.output.forEach((line: string, index: number) => {
        newOutput.push({
            id: `${Date.now()}-output-${index}`,
            type: "stdout",  // It's regular output, so we set this to "stdout"
            content: line,   // The content of the line (the actual output from the code)
            timestamp: new Date(),  // Current timestamp when the output is added
        });
    });
    }
    else{
      // If no output exists, we can push an error or notification to indicate a problem
    newOutput.push({
        id: `${Date.now()}-error`,
        type: "stdout",  // This can be used to indicate an error or missing output
        content: "Error: No output available or compilation failed.",
        timestamp: new Date(),
    });
    }


      // Add execution summary
      const endTime = Date.now()
      const totalTime = endTime - startTime
      newOutput.push({
        id: `${Date.now()}-end`,
        type: result.success ? "success" : "error",
        content: `Program finished with exit code ${result.exitCode}`,
        timestamp: new Date(),
      })

      if (result.memoryUsage) {
        newOutput.push({
          id: `${Date.now()}-memory`,
          type: "info",
          content: `Memory usage: ${result.memoryUsage} KB`,
          timestamp: new Date(),
        })
      }

      setOutput(newOutput)
      setExecutionTime(result.executionTime || totalTime)

      toast({
        title: "Code executed successfully",
        description: `Finished in ${result.executionTime || totalTime}ms`,
      })
    } catch (error) {
      const errorOutput: OutputLine[] = [compilationStart]
      errorOutput.push({
        id: `${Date.now()}-api-error`,
        type: "error",
        content: `API Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: new Date(),
      })
      errorOutput.push({
        id: `${Date.now()}-fallback`,
        type: "info",
        content: "Please check your internet connection and try again",
        timestamp: new Date(),
      })

      setOutput(errorOutput)
      setExecutionTime(Date.now() - startTime)

      toast({
        title: "Execution failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage)
    handleSettingsChange({ ...settings, language: newLanguage })

    if (code.trim() && code !== codeTemplates[newLanguage]) {
      const shouldReplace = window.confirm(
        `Do you want to load the ${languages.find((l) => l.value === newLanguage)?.label} sample code? This will replace your current code.`,
      )
      if (shouldReplace) {
        setCode(codeTemplates[newLanguage] || "")
        toast({
          title: "Sample code loaded",
          description: `${languages.find((l) => l.value === newLanguage)?.label} template has been loaded`,
        })
      }
    } else {
      setCode(codeTemplates[newLanguage] || "")
      toast({
        title: "Sample code loaded",
        description: `${languages.find((l) => l.value === newLanguage)?.label} template has been loaded`,
      })
    }

    setOutput([])
    setExecutionTime(undefined)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code copied",
      description: "Code has been copied to clipboard",
    })
  }

  const downloadCode = () => {
    const language = languages.find((l) => l.value === selectedLanguage)
    const filename = `main.${language?.extension || "txt"}`
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Code downloaded",
      description: `File saved as ${filename}`,
    })
  }

  const clearOutput = () => {
    setOutput([])
    setExecutionTime(undefined)
  }

  function stripHtml(input: string) {
    return input.replace(/<\/?[^>]+(>|$)/g, "")
  }

  const formatCode = () => {
    const formatted = CodeFormatter.format(code, selectedLanguage)
    // ensure no HTML tags slip into editor value
    setCode(stripHtml(formatted))
    toast({
      title: "Code formatted",
      description: "Code has been automatically formatted",
    })
  }

  const saveCode = () => {
    autoSave()
    toast({
      title: "Code saved",
      description: "Your code has been saved locally",
    })
  }

  const shareCode = () => {
    const shareData = {
      code,
      language: selectedLanguage,
      timestamp: new Date().toISOString(),
    }
    const encoded = btoa(JSON.stringify(shareData))
    const shareUrl = `${window.location.origin}?share=${encoded}`

    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Share link copied",
      description: "Share link has been copied to clipboard",
    })
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const shareParam = urlParams.get("share")

    if (shareParam) {
      try {
        const decoded = JSON.parse(atob(shareParam))
        setCode(decoded.code)
        setSelectedLanguage(decoded.language)
        toast({
          title: "Shared code loaded",
          description: "Code has been loaded from share link",
        })
      } catch (error) {
        console.error("Failed to load shared code:", error)
      }
    }
  }, [])

  const leftPanel = (
    <div className="flex-1 flex flex-col border-r border-border">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            main.{languages.find((l) => l.value === selectedLanguage)?.extension}
          </span>
          <AutoSaveIndicator isAutoSaving={isAutoSaving} lastSaved={lastSaved} hasUnsavedChanges={hasUnsavedChanges} />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={formatCode}
            className="h-7 px-2"
            title="Format Code (Ctrl+Shift+F)"
          >
            <Wand2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={copyCode} className="h-7 px-2" title="Copy Code">
            <Copy className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={downloadCode} className="h-7 px-2" title="Download Code">
            <Download className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={shareCode} className="h-7 px-2" title="Share Code">
            <Share className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditorFullscreen(true)}
            className="h-7 px-2"
            title="Fullscreen Editor"
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-muted-foreground">Ready</span>
        </div>
      </div>

      <div className="flex-1 m-4">
        <AdvancedCodeEditor
          value={code}
          onChange={setCode}
          language={selectedLanguage}
          theme={isDarkMode ? "dark" : "light"}
          className="h-full"
        />
      </div>
    </div>
  )

  const rightPanel = (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Output</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearOutput}
            disabled={output.length === 0}
            className="h-7 px-2"
            title="Clear Output (Ctrl+Shift+K)"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOutputFullscreen(true)}
            className="h-7 px-2"
            title="Fullscreen Output"
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
          <Badge variant={isRunning ? "default" : "secondary"} className="text-xs">
            {isRunning ? "Executing" : "Ready"}
          </Badge>
        </div>
      </div>

      <Card className="flex-1 m-4 p-0 overflow-hidden">
        <OutputConsole output={output} isRunning={isRunning} executionTime={executionTime} className="h-full" />
      </Card>
    </div>
  )

  return (
    <div className={`min-h-screen bg-background transition-colors duration-300`}>
      <KeyboardShortcuts
        onRunCode={handleRunCode}
        onSaveCode={saveCode}
        onToggleTheme={toggleTheme}
        onClearOutput={clearOutput}
        onFormatCode={formatCode}
        disabled={isRunning}
      />

      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">CodeCompiler</h1>
            </div>
            <Badge variant="secondary" className="text-xs">
              Online IDE
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector
              value={selectedLanguage}
              onValueChange={handleLanguageChange}
              languages={languages}
              className="w-48"
            />

            <Button onClick={handleRunCode} disabled={isRunning} className="gap-2" title="Run Code (Ctrl+Enter)">
              <Play className="h-4 w-4" />
              {isRunning ? "Running..." : "Run Code"}
            </Button>

            <Button variant="outline" size="icon" onClick={toggleTheme} title="Toggle Theme (Ctrl+Shift+T)">
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <SettingsDialog settings={settings} onSettingsChange={handleSettingsChange}>
              <Button variant="outline" size="icon" title="Settings">
                <Settings className="h-4 w-4" />
              </Button>
            </SettingsDialog>
          </div>
        </div>
      </header>

      <main className="h-[calc(100vh-4rem)]">
        <ResizablePanels
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          defaultLeftWidth={50}
          minLeftWidth={30}
          maxLeftWidth={70}
        />
      </main>

      <FullscreenModal
        isOpen={isEditorFullscreen}
        onClose={() => setIsEditorFullscreen(false)}
        title="Code Editor - Fullscreen"
      >
        <AdvancedCodeEditor
          value={code}
          onChange={setCode}
          language={selectedLanguage}
          theme={isDarkMode ? "dark" : "light"}
          className="h-full"
        />
      </FullscreenModal>

      <FullscreenModal
        isOpen={isOutputFullscreen}
        onClose={() => setIsOutputFullscreen(false)}
        title="Output Console - Fullscreen"
      >
        <OutputConsole output={output} isRunning={isRunning} executionTime={executionTime} className="h-full" />
      </FullscreenModal>
    </div>
  )
}