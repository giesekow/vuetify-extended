/// <reference types="node" />
export interface BootstrapApiAnswers {
    backend: 'none' | 'axios' | 'feathers';
    apiURL?: string;
    keycloakURL?: string;
    keycloakRealm?: string;
    keycloakClientId?: string;
    keycloakOnLoad?: 'login-required' | 'check-sso';
    useSocket?: boolean;
    socketURL?: string;
    socketEvent?: string;
    socketAuthMode?: 'auth' | 'query';
    authPath?: string;
    refreshAuthPath?: string;
    authCreateMethod?: 'get' | 'post' | 'put';
    authRefreshMethod?: 'get' | 'patch' | 'post' | 'put';
}
export interface BootstrapAppCommandOptions {
    cwd: string;
    force: boolean;
    dryRun: boolean;
    interactive: boolean;
    apiAnswers?: Partial<BootstrapApiAnswers>;
    stdin: NodeJS.ReadableStream;
    stdout: Pick<typeof process.stdout, 'write'>;
    stderr: Pick<typeof process.stderr, 'write'>;
}
export declare function runBootstrapAppCommand(options: BootstrapAppCommandOptions): Promise<number>;
