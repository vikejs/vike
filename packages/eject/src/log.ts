import chalk from 'chalk'

export function successLog(message?: unknown, ...optionalParams: unknown[]) {
  console.log(chalk.green(message, optionalParams))
}

export function errorLog(message?: unknown, ...optionalParams: unknown[]) {
  console.log(chalk.red(message, optionalParams))
}

export function infoLog(message?: unknown, ...optionalParams: unknown[]) {
  console.log(chalk.blue(message, optionalParams))
}

export function warnLog(message?: unknown, ...optionalParams: unknown[]) {
  console.log(chalk.yellow(message, optionalParams))
}
