// Minimal type declarations for pdf-parse
declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    numpages: number;
    numrender: number;
    info: Record<string, unknown>;
    metadata: Record<string, unknown>;
    version: string;
  }
  function pdfParse(dataBuffer: Buffer, options?: Record<string, unknown>): Promise<PDFData>;
  export = pdfParse;
}

// Minimal type declarations for tesseract.js
declare module 'tesseract.js' {
  interface RecognizeResult {
    data: { text: string };
  }
  interface Worker {
    recognize(image: string | Buffer): Promise<RecognizeResult>;
    terminate(): Promise<void>;
  }
  function createWorker(lang?: string): Promise<Worker>;
  export { createWorker };
}

// Minimal type declarations for pdf-lib
declare module 'pdf-lib' {
  interface RGB {
    type: 'RGB';
    red: number;
    green: number;
    blue: number;
  }
  interface PDFPage {
    getSize(): { width: number; height: number };
    drawText(text: string, options?: {
      x?: number;
      y?: number;
      size?: number;
      color?: RGB;
    }): void;
  }
  interface PDFDocument {
    addPage(): PDFPage;
    save(): Promise<Uint8Array>;
  }
  function rgb(r: number, g: number, b: number): RGB;
  const PDFDocument: {
    create(): Promise<PDFDocument>;
  };
  export { PDFDocument, rgb };
}
