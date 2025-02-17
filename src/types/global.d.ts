// src/types/global.d.ts
declare module 'papaparse' {
    export interface ParseResult<T> {
      data: T[];
      errors: any[];
      meta: {
        delimiter: string;
        linebreak: string;
        aborted: boolean;
        truncated: boolean;
        cursor: number;
      };
    }
  
    export interface ParseConfig {
      header?: boolean;
      dynamicTyping?: boolean;
      skipEmptyLines?: boolean;
      complete?: (results: ParseResult<any>) => void;
    }
  
    const Papa: {
      parse<T>(file: string, config?: ParseConfig): ParseResult<T>;
    };
  
    export default Papa;
  }
  
  // Also add window.fs type
  interface Window {
    fs: {
      readFile(path: string, options?: { encoding?: string }): Promise<any>;
    }
  }