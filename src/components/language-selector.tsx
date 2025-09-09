"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface Language {
  value: string
  label: string
  extension: string
  version: string
  description: string
  features: string[]
  compilerFlags?: string[]
}

interface LanguageSelectorProps {
  value: string
  onValueChange: (value: string) => void
  languages: Language[]
  className?: string
}

export function LanguageSelector({ value, onValueChange, languages, className }: LanguageSelectorProps) {
  const selectedLanguage = languages.find((lang) => lang.value === value)

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className={className}>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{lang.label}</span>
                    <span className="text-xs text-muted-foreground">{lang.description}</span>
                  </div>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {lang.version}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedLanguage && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="text-xs cursor-help">
                {selectedLanguage.version}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <div className="space-y-2">
                <div className="font-semibold">{selectedLanguage.label} Features:</div>
                <ul className="text-xs space-y-1">
                  {selectedLanguage.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <div className="h-1 w-1 rounded-full bg-primary"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
