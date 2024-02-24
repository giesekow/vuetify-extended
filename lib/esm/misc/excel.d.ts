import Excel from 'exceljs';
export declare const saveWorkBook: (filename: string, workbook: Excel.Workbook) => Promise<void>;
export declare const saveWorkBooks: (filename: string, workbooks: Excel.Workbook[], names: string[]) => Promise<void>;
export declare const readSheetFromFile: (file: any, sheetName: string, headers?: any, hasHeaders?: boolean) => Promise<any>;
export declare const readRowsFromFile: (file: any, sheetName: string, start: any, length: any) => Promise<any>;
export declare const writeData: (sheetNames: string[], data: any, workbook?: Excel.Workbook) => Excel.Workbook;
export declare const writeTables: (sheetNames: string[], data: any, workbook?: Excel.Workbook) => Excel.Workbook;
export declare const createWorkbook: () => Excel.Workbook;
export declare const $excel: {
    saveWorkBook: (filename: string, workbook: Excel.Workbook) => Promise<void>;
    saveWorkBooks: (filename: string, workbooks: Excel.Workbook[], names: string[]) => Promise<void>;
    readSheetFromFile: (file: any, sheetName: string, headers?: any, hasHeaders?: boolean) => Promise<any>;
    writeData: (sheetNames: string[], data: any, workbook?: Excel.Workbook) => Excel.Workbook;
    writeTables: (sheetNames: string[], data: any, workbook?: Excel.Workbook) => Excel.Workbook;
    createWorkbook: () => Excel.Workbook;
    readRowsFromFile: (file: any, sheetName: string, start: any, length: any) => Promise<any>;
};
