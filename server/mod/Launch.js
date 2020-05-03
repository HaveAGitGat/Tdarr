
var shellWorker
var shell = require('shelljs');

//console.dir(process.argv)
var mainJSPath = process.argv[2]
process.env.MONGO_URL = process.argv[3]
process.env.PORT = process.argv[4]
process.env.ROOT_URL = process.argv[5]


//mainJS path = path to Tdarr Server

shellWorker = shell.exec(`node "${mainJSPath}"`, function (code, stdout, stderr, stdin) {
    console.log('Exit code:', code);

    process.exit()
});


process.on('uncaughtException', function (err) {
    console.log(err)
    process.exit();
});

process.on('message', (infoArray) => {

    if (infoArray[0] == "exitThread") {

        try {

            if (process.platform == 'win32') {
                var killCommand = 'taskkill /PID ' + shellWorker.pid + ' /T /F'
            }
            if (process.platform == 'linux') {
                //var killCommand = 'vps -o pid --no-headers --ppid ' + shellWorker.pid
                var killCommand = 'pkill -P ' + shellWorker.pid
            }
            if (process.platform == 'darwin') {
                //var killCommand = 'pgrep -P ' + shellWorker.pid
                var killCommand = 'pkill -P ' + shellWorker.pid
            }
            // if (shell.exec(killCommand).code !== 0) {
            //     shell.exit(1);
            // }
            shell.exec(killCommand)

        } catch (err) {
            console.log(err)
        }
        shellWorker = null
        process.exit();
    }

})
