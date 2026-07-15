#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bootstrap_app_1 = require("./bootstrap-app");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const args = process.argv.slice(2);
        const command = args[0];
        const subcommand = args[1];
        if (!command || command === '--help' || command === '-h') {
            printHelp();
            process.exitCode = 0;
            return;
        }
        if (command === 'bootstrap' && subcommand === 'app') {
            const parsed = parseNamedArgs(args.slice(2));
            const exitCode = yield (0, bootstrap_app_1.runBootstrapAppCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                apiAnswers: buildApiAnswersFromArgs(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
            });
            process.exitCode = exitCode;
            return;
        }
        process.stderr.write(`[vuetify-ext] Unknown command: ${args.join(' ')}\n\n`);
        printHelp();
        process.exitCode = 1;
    });
}
function printHelp() {
    process.stdout.write(`vuetify-ext

Usage:
  vuetify-ext bootstrap app [options]

Commands:
  bootstrap app   Scaffold the recommended Vuetify Extended app bootstrap into the current Vue project

Interaction:
  The bootstrap command is interactive by default.
  Use --non-interactive to suppress prompts and pass values through flags.

Core flags:
  --dry-run                 Show which files would be created or updated without writing them
  --force                   Overwrite existing Vuetify Extended bootstrap files
  --interactive             Force interactive mode
  --non-interactive         Disable prompts and use only command-line values

API flags:
  --backend <none|axios|feathers>
  --api-url <url>
  --keycloak-url <url>
  --keycloak-realm <realm>
  --keycloak-client-id <clientId>
  --keycloak-on-load <login-required|check-sso>
  --use-socket <true|false>

Axios-specific flags:
  --socket-url <url>
  --socket-event <event>
  --socket-auth-mode <auth|query>
  --auth-path <path>
  --refresh-auth-path <path>
  --auth-create-method <get|post|put>
  --auth-refresh-method <get|post|put|patch>
`);
}
function parseNamedArgs(args) {
    const flags = new Set();
    const values = {};
    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];
        if (!arg.startsWith('--')) {
            continue;
        }
        const trimmed = arg.slice(2);
        const equalsIndex = trimmed.indexOf('=');
        if (equalsIndex >= 0) {
            const name = trimmed.slice(0, equalsIndex);
            const value = trimmed.slice(equalsIndex + 1);
            values[name] = value;
            flags.add(name);
            continue;
        }
        const next = args[index + 1];
        if (next && !next.startsWith('--')) {
            values[trimmed] = next;
            flags.add(trimmed);
            index += 1;
            continue;
        }
        flags.add(trimmed);
    }
    return { flags, values };
}
function hasFlag(parsed, name) {
    return parsed.flags.has(name);
}
function resolveInteractiveMode(parsed) {
    if (hasFlag(parsed, 'non-interactive') ||
        hasFlag(parsed, 'non-interractive') ||
        hasFlag(parsed, 'non--interactive') ||
        hasFlag(parsed, 'non--interractive')) {
        return false;
    }
    return true;
}
function buildApiAnswersFromArgs(parsed) {
    const values = parsed.values;
    return {
        backend: values['backend'],
        apiURL: values['api-url'],
        keycloakURL: values['keycloak-url'],
        keycloakRealm: values['keycloak-realm'],
        keycloakClientId: values['keycloak-client-id'],
        keycloakOnLoad: values['keycloak-on-load'],
        useSocket: parseOptionalBoolean(values['use-socket']),
        socketURL: values['socket-url'],
        socketEvent: values['socket-event'],
        socketAuthMode: values['socket-auth-mode'],
        authPath: values['auth-path'],
        refreshAuthPath: values['refresh-auth-path'],
        authCreateMethod: values['auth-create-method'],
        authRefreshMethod: values['auth-refresh-method'],
    };
}
function parseOptionalBoolean(value) {
    if (value === undefined) {
        return undefined;
    }
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'y'].includes(normalized)) {
        return true;
    }
    if (['false', '0', 'no', 'n'].includes(normalized)) {
        return false;
    }
    return undefined;
}
void main();
