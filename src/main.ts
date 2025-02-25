import Parser from "./frontend/parser";
import { createGlobalEnv } from "./runtime/environment";
import { evaluate } from "./runtime/interpreter";

import * as readline from 'readline/promises';
import { readFileSync } from "fs";
import { transcribe } from "./utils/transcriber";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const file = process.argv[2];

if(file) {
    run(file);
} else {
    repl();
}

// fuck your boobs

async function run(filename: string) {
    if (!filename.endsWith("cbs")) return
    
    const parser = new Parser();
    const env = createGlobalEnv();

    let input = readFileSync(filename, 'utf-8');

    input = await transcribe(input);

    const program = parser.produceAST(input);
    const result = evaluate(program, env);

    return result;
}

async function repl() {
    const parser = new Parser();
    const env = createGlobalEnv();

    console.log("Repl v1.0 (Bussin)");

    while (true) {
        let input = await rl.question("> ");

        // check for no user input or exit keyword.
        if (!input || input.includes("exit")) {
            process.exit(1);
        }

        input = await transcribe(input);

        const program = parser.produceAST(input);

        const result = evaluate(program, env);
        console.log(result);
    }
}
