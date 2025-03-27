import fs from "fs";
import chalk from "chalk";
import ora from "ora";
import open from "open";
import md5 from "md5";
import {v4} from "uuid";

import {CONFIG_PATH, HISTORY_PATH, RECENT_PATH} from "../utils/settings.js";
import os from "os";

class Find {
    constructor() {
        this.systemPrompt="Your name is Dora, a local file search assistant. Respond in JSON format with results in an array called 'files' and your accompanying text response in a key called 'text'. Be brief.";
    }
    async startModel(ollama) {
        let config=JSON.parse(fs.readFileSync(CONFIG_PATH));
        ollama.ps().then(async running=>{
            if(running.models.findIndex(x=>x.name===config.chatModel)===-1) {
                await ollama.create({model:config.chatModel,from:config.chatModel,system:this.systemPrompt});
                //console.log('start new model');
            }
            else {
                await ollama.show({model:config.chatModel}).then(async model=>{
                    if(model.system!==this.systemPrompt) {
                        await ollama.create({model:config.chatModel,from:config.chatModel,system:this.systemPrompt});
                        //console.log('running model system prompt does not match, starting a new one');
                    }
                    //else console.log('no need to start model, already running');
                });
            }
        });
    };
    async query(term,options,ollama,chroma) {
        console.log(chalk.magenta(term));
        const spinner=ora(chalk.gray(`searching...\n`)).start();
        let startTime=Date.now()
        //
        //
        let config=JSON.parse(fs.readFileSync(CONFIG_PATH));
        //
        let history=JSON.parse(fs.readFileSync(HISTORY_PATH));
        let termPayload={id:v4(),role:'user',content:term};
        history.push(termPayload);
        fs.writeFileSync(HISTORY_PATH,JSON.stringify(history));
        //
        //
        let recent=JSON.parse(fs.readFileSync(RECENT_PATH));
        //
        //
        let autoOpen=(options.autoOpen) ? options.autoOpen : config.autoOpen;
        async function embedPrompt(){
            return await ollama.embed({model:config.embedModel,input:term});
        }
        embedPrompt().then(async promptEmbeddings => {
            //
            const collection=await chroma.getOrCreateCollection({name: md5(os.hostname())});
            let nResults=10;
            let collectionCount=await collection.count();
            if(collectionCount<10) nResults=collectionCount;
            const queryData=await collection.query({
                queryEmbeddings: promptEmbeddings.embeddings,
                nResults: nResults
            });
            if(collectionCount>1) {
                ollama.chat({
                    model:config.chatModel,
                    messages:[{
                        role:"user",
                        content:"Using this data: " + queryData['documents'][0] + ". Respond to this prompt: " + term
                    }]
                }).then(async reply=>{
                    try {
                        let structuredReply=JSON.parse(reply.message.content);
                        if(structuredReply.files && structuredReply.files.length>0) {
                            spinner.succeed(chalk.gray("done searching"));
                            //console.log(chalk.gray('\nfound some files:'));
                            console.log(chalk.gray('\n'+structuredReply.text));
                            for(let i=0;i<structuredReply.files.length;i++) {
                                console.log('  [*] '+structuredReply.files[i][Object.keys(structuredReply.files[i])[1]]);
                                if(autoOpen) {
                                    await open(structuredReply.files[i][Object.keys(structuredReply.files[i])[1]]);
                                }
                                recent.push(structuredReply.files[i][Object.keys(structuredReply.files[i])[1]]);
                            }
                            let endTime=Date.now();
                            console.log(chalk.gray(parseInt(endTime-startTime)/1000+' seconds'));
                        }
                        else {
                            console.log(chalk.red('no relevant objects found'));
                        }
                        history.push({role:'assistant',content:structuredReply.files,queryId:termPayload.id})
                        fs.writeFileSync(HISTORY_PATH, JSON.stringify(history));
                        //
                        //
                        fs.writeFileSync(RECENT_PATH, JSON.stringify(recent));
                        //
                    } catch (e) {
                        console.log(chalk.yellow("COULD NOT PARSE. Note: chat model could not follow structured output in this instance, so here is the raw output instead:\n"));
                        console.log(reply.message.content)
                    }
                });
            }
            else {
                spinner.succeed(chalk.gray("done searching"));
                console.log(chalk.red('no embedded objects found, try crawling a target path with "dora crawl <path>"'));
            }
            //
        });
    };
}

export {Find};