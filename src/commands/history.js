import os from "os";
import fs from "fs";
import chalk from "chalk";

import {HISTORY_PATH} from "../utils/settings.js";

class History {
    static show(options) {
        if(fs.existsSync(HISTORY_PATH)) {
            let history=JSON.parse(fs.readFileSync(HISTORY_PATH));
            if(history && history.length>0) {
                let limit=(options.limit && parseInt(options.limit)<=history.length) ? options.limit : history.length;
                for(let i=0;i<limit;i++) {
                    if(history[i].role==='user') console.log(history[i].content);
                }
            }
            else console.log(chalk.yellow('No history found.'));
        }
        else console.log(chalk.yellow('No history found.'));
    };
}

export {History};