
export interface PdfContent {
  text?: string;
  columns?: any[];
  table?: {
    headerRows?: number;
    widths?: any[];
    body: any[][];
  };
  stack?: any[];
  layout?: any;
  style?: string;
  margin?: number[];
  pageBreak?: string;
  alignment?: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
  image?: string;
  width?: number | string;
  height?: number;
  [key: string]: any;
}
