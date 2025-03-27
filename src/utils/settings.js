import os from "os";

const CONFIG_PATH=os.homedir()+'/.dora/config.json';
const HISTORY_PATH=os.homedir()+'/.dora/history.json';
const RECENT_PATH=os.homedir()+'/.dora/recent.json';
const INDEX_PATH=os.homedir()+'/.dora/index.json';

export {CONFIG_PATH,HISTORY_PATH,RECENT_PATH,INDEX_PATH};