import os from "os";
import fs from "fs";
import chalk from "chalk";

const CONFIG_PATH=os.homedir()+'/.dora/config.json';

class Config {
    static init(options) {
        if(options.ollamaHost) this.ollamaHost(options.ollamaHost);
        else if(options.ollamaPort) this.ollamaPort(options.ollamaPort);
        else if(options.chromaHost) this.chromaHost(options.chromaHost);
        else if(options.chromaPort) this.chromaPort(options.chromaPort);
        else if(options.chatModel) this.chatModel(options.chatModel);
        else if(options.embedModel) this.embedModel(options.embedModel);
        else if(options.autoOpen) this.autoOpen(options.autoOpen);
        else if(options.help) this.help();
        else {
            console.log(chalk.red('Invalid configuration option. Try "dora config --help" for available options.'));
        }
    };
    static ollamaHost(host) {
        let configFile=JSON.parse(fs.readFileSync(CONFIG_PATH));
        configFile.ollamaHost=host;
        fs.writeFile(CONFIG_PATH,JSON.stringify(configFile,null,2),(err)=>{
           if(!err) console.log(chalk.green('Ollama host changed to '+host));
           else console.log(chalk.red('Write error-> '+err));
        });
    };
    static ollamaPort(port) {
        let configFile=JSON.parse(fs.readFileSync(CONFIG_PATH));
        configFile.ollamaPort=parseInt(port);
        fs.writeFile(CONFIG_PATH,JSON.stringify(configFile,null,2),(err)=>{
            if(!err) console.log(chalk.green('Ollama port changed to '+port));
            else console.log(chalk.red('Write error-> '+err));
        });
    };
    static chromaHost(host) {
        let configFile=JSON.parse(fs.readFileSync(CONFIG_PATH));
        configFile.chromaHost=host;
        fs.writeFile(CONFIG_PATH,JSON.stringify(configFile,null,2),(err)=>{
            if(!err) console.log(chalk.green('ChromaDB host changed to '+host));
            else console.log(chalk.red('Write error:-> '+err));
        });
    };
    static chromaPort(port) {
        let configFile=JSON.parse(fs.readFileSync(CONFIG_PATH));
        configFile.chromaPort=parseInt(port);
        fs.writeFile(CONFIG_PATH,JSON.stringify(configFile,null,2),(err)=>{
            if(!err) console.log(chalk.green('ChromaDB port changed to '+port));
            else console.log(chalk.red('Write error-> '+err));
        });
    };
    static chatModel(model) {
        let configFile=JSON.parse(fs.readFileSync(CONFIG_PATH));
        configFile.chatModel=model;
        fs.writeFile(CONFIG_PATH,JSON.stringify(configFile,null,2),(err)=>{
            if(!err) console.log(chalk.green('Chat model changed to '+model));
            else console.log(chalk.red('Write error-> '+err));
        });
    };
    static embedModel(model) {
        let configFile=JSON.parse(fs.readFileSync(CONFIG_PATH));
        configFile.embedModel=model;
        fs.writeFile(CONFIG_PATH,JSON.stringify(configFile,null,2),(err)=>{
            if(!err) console.log(chalk.green('Embed model changed to '+model));
            else console.log(chalk.red('Write error-> '+err));
        });
    };
    static autoOpen(selection) {
        let configFile=JSON.parse(fs.readFileSync(CONFIG_PATH));
        configFile.autoOpen=(selection.toLowerCase() === "true");
        fs.writeFile(CONFIG_PATH,JSON.stringify(configFile,null,2),(err)=>{
            if(!err) console.log(chalk.green('Auto-open changed to '+selection));
            else console.log(chalk.red('Write error-> '+err));
        });
    };
    static help() {
        let configFile=JSON.parse(fs.readFileSync(CONFIG_PATH));
        console.log('Configuration options.');
        console.log('\n');
        console.log(chalk.blue('   Option                Description         Default                           Current'));
        console.log('   --ollama-host         Ollama host         127.0.0.1                         '+configFile.ollamaHost);
        console.log('   --ollama-port         Ollama port         11434                             '+configFile.ollamaPort);
        console.log('   --chroma-host         ChromaDB host       127.0.0.1                         '+configFile.chromaHost);
        console.log('   --chroma-port         ChromaDB port       8000                              '+configFile.chromaPort);
        console.log('   --chat-model          Chat model          artifish/llama3.2-uncensored      '+configFile.chatModel);
        console.log('   --embed-model         Embed model         nomic-embed-text                  '+configFile.embedModel);
        console.log('   --auto-open           File auto-open      true                              '+configFile.autoOpen);
        console.log('\n');
    };
}

export {Config};