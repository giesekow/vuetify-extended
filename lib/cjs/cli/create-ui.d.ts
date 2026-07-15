/// <reference types="node" />
export interface CreateCommandOptions {
    cwd: string;
    force: boolean;
    dryRun: boolean;
    interactive: boolean;
    stdin: NodeJS.ReadableStream;
    stdout: Pick<typeof process.stdout, 'write'>;
    stderr: Pick<typeof process.stderr, 'write'>;
    values?: Record<string, string>;
    positionals?: string[];
}
type ScriptExt = '.ts' | '.js';
export declare const __testing: {
    resolveFormStepPageContext: typeof resolveFormStepPageContext;
};
export declare function runCreateReportCommand(options: CreateCommandOptions): Promise<number>;
export declare function runCreateTriggerCommand(options: CreateCommandOptions): Promise<number>;
export declare function runCreateCollectionCommand(options: CreateCommandOptions): Promise<number>;
export declare function runCreateMenuItemCommand(options: CreateCommandOptions): Promise<number>;
export declare function runCreateSubMenuCommand(options: CreateCommandOptions): Promise<number>;
export declare function runCreateFormCommand(options: CreateCommandOptions): Promise<number>;
declare function resolveFormStepPageContext(cwd: string, page: string, fallbackExt: ScriptExt): {
    pageExt: ScriptExt;
    reportFile: string;
    reportSource: string;
    currentForms: number;
    reportTitle: string | undefined;
};
export {};
