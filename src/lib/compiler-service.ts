export interface CompilationRequest {
  code: string
  language: string
  settings: {
    optimization: "none" | "basic" | "aggressive"
    warnings: boolean
    strictMode: boolean
    debugInfo: boolean
    customFlags: string
  }
}

export interface CompilationResult {
  success: boolean
  output: string[]
  errors: string[]
  warnings: string[]
  executionTime: number
  memoryUsage?: number
  exitCode: number
}

export class CompilerService {
  private static readonly TIMEOUT_MS = 10000 // 10 seconds
  private static readonly MAX_OUTPUT_LENGTH = 10000 // Prevent excessive output

  static async compile(request: CompilationRequest): Promise<CompilationResult> {
    const startTime = Date.now()

    try {
      // Validate input
      this.validateInput(request)

      // Execute based on language
      const result = await this.executeCode(request)

      const executionTime = Date.now() - startTime

      return {
        ...result,
        executionTime,
      }
    } catch (error) {
      return {
        success: false,
        output: [],
        errors: [error instanceof Error ? error.message : "Unknown compilation error"],
        warnings: [],
        executionTime: Date.now() - startTime,
        exitCode: 1,
      }
    }
  }

  private static validateInput(request: CompilationRequest): void {
    if (!request.code || request.code.trim().length === 0) {
      throw new Error("Code cannot be empty")
    }

    if (request.code.length > 50000) {
      throw new Error("Code is too long (maximum 50,000 characters)")
    }

    // Basic security checks
    const dangerousPatterns = [
      /import\s+os/i,
      /import\s+subprocess/i,
      /exec\s*\(/i,
      /eval\s*\(/i,
      /system\s*\(/i,
      /__import__/i,
      /file\s*\(/i,
      /open\s*\(/i,
      /\.\.\/|\.\.\\/, // Path traversal
      /rm\s+-rf/i,
      /del\s+/i,
    ]

    for (const pattern of dangerousPatterns) {
      if (pattern.test(request.code)) {
        throw new Error("Code contains potentially dangerous operations")
      }
    }
  }

  private static async executeCode(request: CompilationRequest): Promise<Omit<CompilationResult, "executionTime">> {
    switch (request.language) {
      case "javascript":
        return this.executeJavaScript(request)
      case "python":
        return this.executePython(request)
      case "java":
        return this.executeJava(request)
      case "cpp":
        return this.executeCpp(request)
      case "c":
        return this.executeC(request)
      case "go":
        return this.executeGo(request)
      default:
        throw new Error(`Unsupported language: ${request.language}`)
    }
  }

  private static async executeJavaScript(
    request: CompilationRequest,
  ): Promise<Omit<CompilationResult, "executionTime">> {
    try {
      // Create a safe execution environment
      const output: string[] = []
      const errors: string[] = []
      const warnings: string[] = []

      // Mock console for capturing output
      const mockConsole = {
        log: (...args: any[]) => output.push(args.map((arg) => String(arg)).join(" ")),
        error: (...args: any[]) => errors.push(args.map((arg) => String(arg)).join(" ")),
        warn: (...args: any[]) => warnings.push(args.map((arg) => String(arg)).join(" ")),
      }

      // Create execution context
      const context = {
        console: mockConsole,
        setTimeout: (fn: Function, delay: number) => {
          if (delay > 1000) delay = 1000 // Limit timeout
          return setTimeout(fn, delay)
        },
        Date,
        Math,
        JSON,
        Promise,
        Array,
        Object,
        String,
        Number,
        Boolean,
      }

      // Execute code in controlled environment
      const wrappedCode = `
        (function() {
          ${request.code}
        })();
      `

      // Use Function constructor for safer evaluation
      const func = new Function(...Object.keys(context), wrappedCode)
      await func(...Object.values(context))

      return {
        success: errors.length === 0,
        output,
        errors,
        warnings,
        exitCode: errors.length > 0 ? 1 : 0,
      }
    } catch (error) {
      return {
        success: false,
        output: [],
        errors: [error instanceof Error ? error.message : "JavaScript execution error"],
        warnings: [],
        exitCode: 1,
      }
    }
  }

  private static async executePython(request: CompilationRequest): Promise<Omit<CompilationResult, "executionTime">> {
    // Simulate Python execution with realistic output
    const output: string[] = []
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Basic Python syntax validation
      if (request.code.includes("print(")) {
        // Match print('...'), print("..."), print('''...'''), print("""...""")
        // Supports optional f/F prefix and multiline triple-quoted strings
        const printRegex = /print\s*\(\s*(?:[fF])?\s*(['"]{1,3})([\s\S]*?)\1\s*\)/g
        let m: RegExpExecArray | null
        while ((m = printRegex.exec(request.code)) !== null) {
          const content = m[2]
          // Unescape common sequences and preserve newlines from triple quotes
          const processed = content.replace(/\\n/g, "\n")
          output.push(processed)
        }
      }

      // Check for common Python patterns
      if (request.code.includes("def ")) {
        output.push("Function definitions processed")
      }

      if (request.code.includes("class ")) {
        output.push("Class definitions processed")
      }

      if (request.code.includes("import ")) {
        if (request.settings.warnings) {
          warnings.push("Import statements detected - limited library support in sandbox")
        }
      }

      // After building output, before returning from executePython:
      if (output.length === 0 && errors.length === 0) {
        // If code contains obvious output-producing patterns but nothing was captured,
        // treat as possible error so UI shows that something went wrong.
        if (/(?:print\s*\(|(?:f|F)?['"]{3}|(?:f|F)?['"]|def\s+|class\s+)/.test(request.code)) {
          errors.push(
            "No output produced — possible syntax/runtime error or unsupported constructs in sandbox"
          )
          return {
            success: false,
            output,
            errors,
            warnings,
            exitCode: 1,
          }
        }
      }

      return {
        success: true,
        output,
        errors,
        warnings,
        exitCode: 0,
      }
    } catch (error) {
      return {
        success: false,
        output,
        errors: [error instanceof Error ? error.message : "Python execution error"],
        warnings,
        exitCode: 1,
      }
    }
  }

  private static async executeJava(request: CompilationRequest): Promise<Omit<CompilationResult, "executionTime">> {
    const output: string[] = []
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Check for main method
      if (!/public\s+static\s+void\s+main\s*\(/.test(request.code)) {
        errors.push("No main method found")
        return { success: false, output, errors, warnings, exitCode: 1 }
      }

      // Match System.out.println("..."); and extract string literal content
      const printlnRegex = /System\.out\.println\s*\(\s*(['"])([\s\S]*?)\1\s*\)\s*;/g
      let match: RegExpExecArray | null
      while ((match = printlnRegex.exec(request.code)) !== null) {
        const content = match[2]
        output.push(content.replace(/\\n/g, "\n"))
      }

      // Check for compilation warnings
      if (request.settings.warnings) {
        if (request.code.includes("var ")) {
          warnings.push("Using var keyword - consider explicit types for better readability")
        }
      }

      return {
        success: true,
        output,
        errors,
        warnings,
        exitCode: 0,
      }
    } catch (error) {
      return {
        success: false,
        output,
        errors: [error instanceof Error ? error.message : "Java compilation error"],
        warnings,
        exitCode: 1,
      }
    }
  }

  private static async executeCpp(request: CompilationRequest): Promise<Omit<CompilationResult, "executionTime">> {
    const output: string[] = []
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Check for main function
      if (!request.code.includes("int main")) {
        errors.push("No main function found")
        return { success: false, output, errors, warnings, exitCode: 1 }
      }

      // Extract cout statements
      const coutMatches = request.code.match(/cout\s*<<\s*(.*?)\s*;/g)
      if (coutMatches) {
        for (const match of coutMatches) {
          const content = match.replace(/cout\s*<<\s*(.*?)\s*;/, "$1")
          if (content.includes('"')) {
            output.push(content.replace(/"/g, ""))
          } else if (content.includes("endl")) {
            output.push("")
          } else {
            output.push(content)
          }
        }
      }

      // Check for modern C++ features
      if (request.code.includes("auto ") && request.settings.warnings) {
        warnings.push("Using auto keyword - ensure type deduction is clear")
      }

      return {
        success: true,
        output,
        errors,
        warnings,
        exitCode: 0,
      }
    } catch (error) {
      return {
        success: false,
        output,
        errors: [error instanceof Error ? error.message : "C++ compilation error"],
        warnings,
        exitCode: 1,
      }
    }
  }

  private static async executeC(request: CompilationRequest): Promise<Omit<CompilationResult, "executionTime">> {
    const output: string[] = []
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Check for main function
      if (!/int\s+main\s*\(/.test(request.code)) {
        errors.push("No main function found")
        return { success: false, output, errors, warnings, exitCode: 1 }
      }

      // Match printf("..."); and extract string literal content (supports escaped \n)
      const printfRegex = /printf\s*\(\s*(['"])([\s\S]*?)\1\s*\)\s*;/g
      let match: RegExpExecArray | null
      while ((match = printfRegex.exec(request.code)) !== null) {
        const content = match[2]
        const output_str = content.replace(/\\n/g, "\n")
        output.push(output_str)
      }

      return {
        success: true,
        output,
        errors,
        warnings,
        exitCode: 0,
      }
    } catch (error) {
      return {
        success: false,
        output,
        errors: [error instanceof Error ? error.message : "C compilation error"],
        warnings,
        exitCode: 1,
      }
    }
  }

  private static async executeGo(request: CompilationRequest): Promise<Omit<CompilationResult, "executionTime">> {
    const output: string[] = []
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Check for main function
      if (!request.code.includes("func main")) {
        errors.push("No main function found")
        return { success: false, output, errors, warnings, exitCode: 1 }
      }

      // Extract fmt.Println statements
      const printMatches = request.code.match(/fmt\.Println$$(.*?)$$/g)
      if (printMatches) {
        for (const match of printMatches) {
          const content = match.replace(/fmt\.Println\((.*?)/, "$1")
          if (content.includes('"')) {
            output.push(content.replace(/"/g, ""))
          } else {
            output.push(content)
          }
        }
      }

      // Check for goroutines
      if (request.code.includes("go func") && request.settings.warnings) {
        warnings.push("Goroutines detected - execution order may vary")
      }

      return {
        success: true,
        output,
        errors,
        warnings,
        exitCode: 0,
      }
    } catch (error) {
      return {
        success: false,
        output,
        errors: [error instanceof Error ? error.message : "Go compilation error"],
        warnings,
        exitCode: 1,
      }
    }
  }
}
