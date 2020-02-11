
const fs = require('fs')
const path = require('path');
if (fs.existsSync(path.join(process.cwd(), "/npm"))) {
    var rootModules = path.join(process.cwd(), '/npm/node_modules/')
} else {
    var rootModules = ''
}


module.exports = function runFFprobe(filepath) {

    const ffprobe = require(rootModules + 'ffprobe')
    const ffprobeStaticPath = require(rootModules + 'ffprobe-static').path



    return new Promise(resolve => {
        try {
            ffprobe(filepath, { path: ffprobeStaticPath }, function (err, jsonData) {
                //console.log(err)
                //console.log(jsonData)
                if (err) {
                    console.log(err)
                    resolve(
                        {
                            result: 'error',
                            data: 'FFprobe encountered an error:' + err,
                        }
                    )
                }

                if (jsonData) {
                    resolve(
                        {
                            result: 'success',
                            data: jsonData
                        }
                    )
                }
            });
        } catch (err) {

            console.log(err.stack)

            resolve(
                {
                    result: 'err',
                    data: 'FFprobe encountered an err:' + err,
                }
            )

        }
    });
}



