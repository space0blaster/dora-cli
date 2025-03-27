#!/usr/bin/env node

import fs from "fs";

import { program } from "commander";
import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";
import {Ollama} from "ollama";
import {ChromaClient} from "chromadb";

// Import command files.
import {CONFIG_PATH, HISTORY_PATH, RECENT_PATH} from "../src/utils/settings.js";
import {Crawler} from "../src/commands/crawler.js";
import {Find} from "../src/commands/find.js";
import {History} from "../src/commands/history.js";
import {Recent} from "../src/commands/recent.js";
import {Config} from "../src/commands/config.js";

// Program metadata.
program.version("1.0.0").description("Dora");

// create files and configs if they don't exist
if(!fs.existsSync(CONFIG_PATH)) {
    let defaultConfig={
        ollamaHost:'127.0.0.1',
        ollamaPort:11434,
        chromaHost:'127.0.0.1',
        chromaPort:8000,
        chatModel:'artifish/llama3.2-uncensored',
        embedModel:'nomic-embed-text',
        autoOpen:true
    };
    fs.writeFileSync(CONFIG_PATH,JSON.stringify(defaultConfig));
}
if(!fs.existsSync(HISTORY_PATH)) fs.writeFileSync(HISTORY_PATH,JSON.stringify([]));
if(!fs.existsSync(RECENT_PATH)) fs.writeFileSync(RECENT_PATH,JSON.stringify([]));

// get configurations
let config=JSON.parse(fs.readFileSync(CONFIG_PATH));

// initialize Ollama and ChromadDB
const ollama=new Ollama({host:'http://'+config.ollamaHost+':'+config.ollamaPort});
const chroma=new ChromaClient({path:'http://'+config.chromaHost+':'+config.chromaPort,allow_reset:true});

/**
 * index command
**/
program
    .command("crawl")
    .description("crawl a directory recursively.")
    .argument("<path>","Path to crawl target directory")
    .action((path,options)=>{
        let c=new Crawler();
        c.crawl(path,options,ollama,chroma);
    });

/**
 * search command
 **/
program.command("find")
    .description("find files and directories semantically.")
    .argument("<term>","Search term.")
    .option("--auto-open <true-false>","override program auto-open")
    .action((term,options)=>{
        let f=new Find();
        f.startModel(ollama).then(()=>{
            f.query(term,options,ollama,chroma);
        })
    });

/**
 * history command
**/
program.command("history")
    .description("show search history")
    .option("--limit","history items limit")
    .action((options)=>{
        History.show(options);
    });


/**
 * recent command
 **/
program.command("recent")
    .description("show recent files")
    .option("--limit","recent items limit")
    .action((options)=>{
        Recent.show(options);
    });


/**
 * config command
 **/
program.command('config')
        .description("Configure Dora settings.")
        .option("--ollama-host <name>","configure Ollama host/IP")
        .option("--ollama-port <port>","configure Ollama port")
        .option("--chroma-host <name>","configure ChromaDB host/IP")
        .option("--chroma-port <port>","configure ChromaDB port")
        .option("--chat-model <model>","configure chat model")
        .option("--embed-model <model>","configure embed model")
        .option("--auto-open <true-false>","configure file auto-open during search")
        .option("-h, --help","display config command help")
        .action((options)=>{
            Config.init(options);
        });

/**
 * about
 */
program.command('about')
    .description("About Dora")
    .action(()=>{
        // ASCII welcome.
        console.log(
            chalk.magenta(figlet.textSync("DORA", { horizontalLayout: "full" }))
        );
        console.log('Smarty pants file finder.');
        console.log('\n');
        console.log('Author: Aman Tsegai')
        console.log('Github: https://github.com/space0blaster/dora-cli')
        console.log('License: MIT')
        console.log('2025')
    });


program.parse(process.argv);