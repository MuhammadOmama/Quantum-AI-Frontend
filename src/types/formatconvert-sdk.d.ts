declare module 'https://formatconvert.quantumlogicslimited.com/sdk.js' {
  export interface ConvertProgress {
    page?: number;
    total?: number;
    stage?: string;
  }

  export interface ConvertResult {
    blob: Blob;
    filename?: string;
    from?: string;
    to?: string;
  }

  export function convert(
    file: File,
    to: string,
    options?: {
      pageSize?: 'a4' | 'letter';
      quality?: number;
      width?: number;
      onProgress?: (progress: ConvertProgress) => void;
      [key: string]: unknown;
    }
  ): Promise<ConvertResult>;

  export function convertMany(...args: any[]): Promise<any>;
  export function zipResults(...args: any[]): Promise<any>;
  export function detectFormat(...args: any[]): Promise<any>;
  export function targetsFor(...args: any[]): Promise<any>;
  export function listConversions(...args: any[]): Promise<any>;
  export const FORMATS: any;
  export default { convert };
}