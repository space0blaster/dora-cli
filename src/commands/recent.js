import os from "os";
import fs from "fs";
import chalk from "chalk";

const RECENT_PATH=os.homedir()+'/.dora/recent.json';

class Recent {
    static show(options) {
        if(fs.existsSync(RECENT_PATH)) {
            let recent=JSON.parse(fs.readFileSync(RECENT_PATH));
            if(recent && recent.length>0) {
                let limit=(options.limit && parseInt(options.limit)<=history.length) ? options.limit : recent.length;
                for(let i=0;i<limit;i++) {
                    console.log(recent[i]);
                }
            }
            else console.log(chalk.yellow('No recent files found.'));
        }
        else console.log(chalk.yellow('No recent files found.'));
    };
}

export {Recent};