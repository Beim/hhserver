class Logger {

    log(arg) {
        console.log('log: ', JSON.stringify(arg))
    }
}

module.exports = new Logger()