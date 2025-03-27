import chalk from "chalk";

class Help {
    static init() {
        console.log('\n');
        console.log(chalk.blue('   Command            Description'));
        console.log('   -i, --index        Index directory.');
        console.log('   -s, --search       Search for files.');
        console.log('   -h, --help         Display help.')
        console.log('\n');
    }
}

export {Help};