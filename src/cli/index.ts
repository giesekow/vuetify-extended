#!/usr/bin/env node
import { type BootstrapApiAnswers, runBootstrapAppCommand } from './bootstrap-app';

async function main() {
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
    const exitCode = await runBootstrapAppCommand({
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

function parseNamedArgs(args: string[]) {
  const flags = new Set<string>();
  const values: Record<string, string> = {};

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

function hasFlag(parsed: { flags: Set<string> }, name: string): boolean {
  return parsed.flags.has(name);
}

function resolveInteractiveMode(parsed: { flags: Set<string> }): boolean {
  if (
    hasFlag(parsed, 'non-interactive') ||
    hasFlag(parsed, 'non-interractive') ||
    hasFlag(parsed, 'non--interactive') ||
    hasFlag(parsed, 'non--interractive')
  ) {
    return false;
  }

  return true;
}

function buildApiAnswersFromArgs(parsed: { flags: Set<string>; values: Record<string, string> }): Partial<BootstrapApiAnswers> {
  const values = parsed.values;

  return {
    backend: values['backend'] as BootstrapApiAnswers['backend'] | undefined,
    apiURL: values['api-url'],
    keycloakURL: values['keycloak-url'],
    keycloakRealm: values['keycloak-realm'],
    keycloakClientId: values['keycloak-client-id'],
    keycloakOnLoad: values['keycloak-on-load'] as BootstrapApiAnswers['keycloakOnLoad'] | undefined,
    useSocket: parseOptionalBoolean(values['use-socket']),
    socketURL: values['socket-url'],
    socketEvent: values['socket-event'],
    socketAuthMode: values['socket-auth-mode'] as BootstrapApiAnswers['socketAuthMode'] | undefined,
    authPath: values['auth-path'],
    refreshAuthPath: values['refresh-auth-path'],
    authCreateMethod: values['auth-create-method'] as BootstrapApiAnswers['authCreateMethod'] | undefined,
    authRefreshMethod: values['auth-refresh-method'] as BootstrapApiAnswers['authRefreshMethod'] | undefined,
  };
}

function parseOptionalBoolean(value: string | undefined): boolean | undefined {
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
