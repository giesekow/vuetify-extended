export declare class PrinterBase {
    constructor();
    getTemplate(tempId: any, field?: string): Promise<string>;
    getTemplateIdByName(name: string | undefined): Promise<any>;
    getTemplateNameById(tempId: any): Promise<string | undefined>;
    getTemplateByName(name: any, field?: string): Promise<string>;
    getVariables(varnames: any[]): Promise<any>;
    printFunctions(): {};
    printHTML(html: string): Promise<void>;
    compileEJS(html: string, data: any): Promise<string>;
    handleIncludes(html: string, resolved: any, heirarchy: string[]): Promise<string>;
    printReport(name: string, data: any): Promise<void>;
    parseReport(name: string, data: any): Promise<string>;
    printReportById(tempId: any, data: any): Promise<void>;
    parseReportById(tempId: any, data: any): Promise<string>;
    parseHTMLReport(html: string, data: any): Promise<string>;
    parseVariables(html: string, data: any): Promise<any>;
}
