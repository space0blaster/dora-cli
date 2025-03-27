import fs from "fs";
import path from "path";
import md5 from "md5";
import ora from "ora";
import chalk from "chalk";

import {CONFIG_PATH,INDEX_PATH} from "../utils/settings.js";
import os from "os";

let indexedFiles=0;
let embeddedMetadata=0;

class Crawler {
    crawl(targetPath,options,ollama,chroma) {
        if(fs.existsSync(targetPath)) {
            console.log(chalk.magenta(targetPath));
            const spinner=ora(chalk.gray('indexing path objects')).start();
            let startTime=Date.now()

            let indexed={
                targetDirectory:"",
                model:"",
                files:[]
            };
            function walk(dir) {
                let items=fs.readdirSync(dir);
                if(items && items.length>0) {
                    items.forEach((item)=>{
                        //if(config.ignored.indexOf(item)===-1) {
                        let filePath=path.join(dir,item);
                        let isDir=Crawler.isDirectory(filePath);
                        if(isDir) walk(filePath);
                        else {
                            indexed.files.push({
                                id:md5(filePath),
                                name:item,
                                isDirectory:isDir,
                                path:filePath,
                                embedded:false
                            });
                            indexedFiles++;
                        }
                        //}
                        process.stdout.clearLine(0);
                        process.stdout.cursorTo(0);
                        process.stdout.write(item); // shorten
                    });
                }
            }
            walk(targetPath);
            fs.writeFile(INDEX_PATH,JSON.stringify(indexed),()=>{
                spinner.succeed(chalk.gray("done indexing"));
                console.log(chalk.gray("    "+chalk.inverse(indexedFiles)+" object paths indexed"));

                const spinner2=ora(chalk.gray('now embedding paths')).start();
                this.embedToChroma(indexed,ollama,chroma).then(vector=>{
                    spinner2.succeed(chalk.gray("done embedding"));
                    console.log(chalk.gray("    "+chalk.inverse(indexedFiles)+ " object paths embedded"));
                    let endTime=Date.now();
                    console.log(chalk.gray(parseInt(endTime-startTime)/1000+' seconds'));
                });
            });
        }
        else console.log(chalk.red('Index target "'+targetPath+'" does not exist.'));
    };
    static isDirectory(filePath) {
        try {
            const stats=fs.statSync(filePath);
            return (stats.mode & fs.constants.S_IFDIR)===fs.constants.S_IFDIR;
        } catch (error) {
            return false;
        }
    };
    async embedToChroma(indexed,ollama,chroma) {
        let config=JSON.parse(fs.readFileSync(CONFIG_PATH));
        const collection=await chroma.getOrCreateCollection({name:md5(os.hostname())});
        for(let i=0;i<indexed.files.length;i++) {
            if(!indexed.files[i].embedded) {
                let d="file_name: "+indexed.files[i].name+", file_path: "+indexed.files[i].path;
                let v=await ollama.embed({model:config.embedModel,input:d});
                await collection.upsert({ids:[md5(indexed.files[i].path)],embeddings:[v.embeddings[0]],documents:[d]});
                indexed.files[i].embedded=true;
                fs.writeFileSync(INDEX_PATH,JSON.stringify(indexed));
                embeddedMetadata++;
            }
        }
        return true;
    }
}

export {Crawler};