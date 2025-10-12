declare module 'webtex' {
  export interface HtmlGeneratorOptions {
    hyphenate?: boolean
  }

  export class HtmlGenerator {
    constructor(options?: HtmlGeneratorOptions)
    htmlDocument(): {
      documentElement: {
        outerHTML: string,
      }
    }
  }

  export interface ParseOptions {
    generator?: HtmlGenerator
  }

  export function parse(latex: string, options?: ParseOptions): HtmlGenerator
}
