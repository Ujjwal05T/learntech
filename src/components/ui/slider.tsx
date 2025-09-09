"use client"

import React from "react"

type SliderProps = {
  value?: number
  min?: number
  max?: number
  step?: number
  onValueChange?: (val: number) => void
  className?: string
  ariaLabel?: string
}

export default function Slider({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  className = "",
  ariaLabel,
}: SliderProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={ariaLabel}
      className={`h-2 w-full appearance-none rounded-lg bg-gray-700/40 ${className}`}
      onChange={(e) => onValueChange?.(Number(e.target.value))}
    />
  )
}
