"use client"

export class CodeFormatter {
  static format(code: string, language: string): string {
    switch (language) {
      case "javascript":
        return this.formatJavaScript(code)
      case "python":
        return this.formatPython(code)
      case "java":
        return this.formatJava(code)
      case "cpp":
      case "c":
        return this.formatC(code)
      case "go":
        return this.formatGo(code)
      default:
        return code
    }
  }

  private static formatJavaScript(code: string): string {
    // Basic JavaScript formatting
    const formatted = code.replace(/;/g, ";\n").replace(/\{/g, " {\n").replace(/\}/g, "\n}\n").replace(/,/g, ",\n")

    return this.addIndentation(formatted)
  }

  private static formatPython(code: string): string {
    // Python formatting (preserve existing indentation structure)
    return code
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n")
  }

  private static formatJava(code: string): string {
    // Basic Java formatting
    const formatted = code.replace(/;/g, ";\n").replace(/\{/g, " {\n").replace(/\}/g, "\n}\n")

    return this.addIndentation(formatted)
  }

  private static formatC(code: string): string {
    // Basic C/C++ formatting
    const formatted = code.replace(/;/g, ";\n").replace(/\{/g, " {\n").replace(/\}/g, "\n}\n")

    return this.addIndentation(formatted)
  }

  private static formatGo(code: string): string {
    // Basic Go formatting
    const formatted = code.replace(/\{/g, " {\n").replace(/\}/g, "\n}\n")

    return this.addIndentation(formatted)
  }

  private static addIndentation(code: string): string {
    const lines = code.split("\n")
    let indentLevel = 0
    const indentSize = 2

    return lines
      .map((line) => {
        const trimmed = line.trim()
        if (!trimmed) return ""

        if (trimmed.includes("}")) {
          indentLevel = Math.max(0, indentLevel - 1)
        }

        const indented = " ".repeat(indentLevel * indentSize) + trimmed

        if (trimmed.includes("{")) {
          indentLevel++
        }

        return indented
      })
      .join("\n")
      .replace(/\n\s*\n\s*\n/g, "\n\n") // Remove excessive blank lines
  }
}
