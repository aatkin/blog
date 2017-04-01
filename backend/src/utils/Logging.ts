import * as chalk from "chalk";

export function error(message: any, ...params: any[]) {
    if (params.length) {
        console.error(chalk.red(message), chalk.red.apply(null, [...params]));
    } else {
        console.error(chalk.red(message));
    }
}

export function debug(message: any, ...params: any[]) {
    if (params.length) {
        console.log(chalk.yellow(message), chalk.yellow.apply(null, [...params]));
    } else {
        console.log(chalk.yellow(message));
    }
}
