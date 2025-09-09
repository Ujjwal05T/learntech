"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Settings, Code, Palette, Zap, Keyboard, Save, RotateCcw } from "lucide-react"

export interface EditorSettings {
  fontSize: number
  tabSize: number
  wordWrap: boolean
  lineNumbers: boolean
  minimap: boolean
  autoSave: boolean
  autoComplete: boolean
  bracketMatching: boolean
}

export interface CompilerSettings {
  optimization: "none" | "basic" | "aggressive"
  warnings: boolean
  strictMode: boolean
  debugInfo: boolean
  customFlags: string
}

export interface AppSettings {
  editor: EditorSettings
  compiler: CompilerSettings
  theme: "light" | "dark" | "auto"
  language: string
}

interface SettingsDialogProps {
  settings: AppSettings
  onSettingsChange: (settings: AppSettings) => void
  children: React.ReactNode
}

const defaultSettings: AppSettings = {
  editor: {
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    lineNumbers: true,
    minimap: false,
    autoSave: true,
    autoComplete: true,
    bracketMatching: true,
  },
  compiler: {
    optimization: "basic",
    warnings: true,
    strictMode: false,
    debugInfo: true,
    customFlags: "",
  },
  theme: "auto",
  language: "javascript",
}

export function SettingsDialog({ settings, onSettingsChange, children }: SettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSave = () => {
    onSettingsChange(localSettings)
    setIsOpen(false)
  }

  const handleReset = () => {
    setLocalSettings(defaultSettings)
  }

  const updateEditorSetting = <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
    setLocalSettings((prev) => ({
      ...prev,
      editor: { ...prev.editor, [key]: value },
    }))
  }

  const updateCompilerSetting = <K extends keyof CompilerSettings>(key: K, value: CompilerSettings[K]) => {
    setLocalSettings((prev) => ({
      ...prev,
      compiler: { ...prev.compiler, [key]: value },
    }))
  }

  const shortcuts = [
    { key: "Ctrl + Enter", action: "Run Code" },
    { key: "Ctrl + S", action: "Save Code" },
    { key: "Ctrl + /", action: "Toggle Comment" },
    { key: "Ctrl + D", action: "Duplicate Line" },
    { key: "Ctrl + Shift + K", action: "Delete Line" },
    { key: "F11", action: "Toggle Fullscreen" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="editor" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="compiler" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Compiler
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="shortcuts" className="flex items-center gap-2">
              <Keyboard className="h-4 w-4" />
              Shortcuts
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 overflow-y-auto max-h-[50vh]">
            <TabsContent value="editor" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[localSettings.editor.fontSize]}
                        onValueChange={([value]) => updateEditorSetting("fontSize", value)}
                        min={10}
                        max={24}
                        step={1}
                        className="flex-1"
                      />
                      <Badge variant="outline">{localSettings.editor.fontSize}px</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tab Size</Label>
                    <Select
                      value={localSettings.editor.tabSize.toString()}
                      onValueChange={(value) => updateEditorSetting("tabSize", Number.parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 spaces</SelectItem>
                        <SelectItem value="4">4 spaces</SelectItem>
                        <SelectItem value="8">8 spaces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Word Wrap</Label>
                    <Switch
                      checked={localSettings.editor.wordWrap}
                      onCheckedChange={(checked) => updateEditorSetting("wordWrap", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Line Numbers</Label>
                    <Switch
                      checked={localSettings.editor.lineNumbers}
                      onCheckedChange={(checked) => updateEditorSetting("lineNumbers", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Minimap</Label>
                    <Switch
                      checked={localSettings.editor.minimap}
                      onCheckedChange={(checked) => updateEditorSetting("minimap", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Auto Save</Label>
                    <Switch
                      checked={localSettings.editor.autoSave}
                      onCheckedChange={(checked) => updateEditorSetting("autoSave", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Auto Complete</Label>
                    <Switch
                      checked={localSettings.editor.autoComplete}
                      onCheckedChange={(checked) => updateEditorSetting("autoComplete", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Bracket Matching</Label>
                    <Switch
                      checked={localSettings.editor.bracketMatching}
                      onCheckedChange={(checked) => updateEditorSetting("bracketMatching", checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="compiler" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Optimization Level</Label>
                    <Select
                      value={localSettings.compiler.optimization}
                      onValueChange={(value: "none" | "basic" | "aggressive") =>
                        updateCompilerSetting("optimization", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (-O0)</SelectItem>
                        <SelectItem value="basic">Basic (-O1)</SelectItem>
                        <SelectItem value="aggressive">Aggressive (-O2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Compiler Flags</Label>
                    <Input
                      value={localSettings.compiler.customFlags}
                      onChange={(e) => updateCompilerSetting("customFlags", e.target.value)}
                      placeholder="-Wall -Wextra"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Show Warnings</Label>
                    <Switch
                      checked={localSettings.compiler.warnings}
                      onCheckedChange={(checked) => updateCompilerSetting("warnings", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Strict Mode</Label>
                    <Switch
                      checked={localSettings.compiler.strictMode}
                      onCheckedChange={(checked) => updateCompilerSetting("strictMode", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Debug Information</Label>
                    <Switch
                      checked={localSettings.compiler.debugInfo}
                      onCheckedChange={(checked) => updateCompilerSetting("debugInfo", checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={localSettings.theme}
                    onValueChange={(value: "light" | "dark" | "auto") =>
                      setLocalSettings((prev) => ({ ...prev, theme: value }))
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Color Scheme Preview</Label>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded bg-primary"></div>
                    <div className="h-8 w-8 rounded bg-secondary"></div>
                    <div className="h-8 w-8 rounded bg-accent"></div>
                    <div className="h-8 w-8 rounded bg-muted"></div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shortcuts" className="space-y-4">
              <div className="space-y-2">
                <Label>Keyboard Shortcuts</Label>
                <div className="space-y-2">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                      <span className="text-sm">{shortcut.action}</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {shortcut.key}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReset} className="gap-2 bg-transparent">
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { defaultSettings }
