const app = (() => {
    const app = {};

    //#region debug
    let debug = true;
    /**
     * @param {boolean} new_debug
     */
    app.setDebug = (new_debug) => debug = !!new_debug;
    //#endregion

    //#region logs
    /**
     * @param {string} prefix 
     * @returns 
     */
    const logger = (prefix) => {
        const messages = [];
        /**
         * @param {string} message 
         * @param {object} data
         * @returns {{log: function, messages: Array<{time: number, message: string, data: object}>}}
         */
        const log = (message, data = {}) => {
            messages.push({time: Date.now(), message, data});
            if(debug) console.log(`${prefix}: ${message}`, data);
        };
        return {
            log,
            messages,
        };
    }    
    const logs = new Map();
    app.getLoggers = () => Object.fromEntries(logs);
    /**
     * @param {string} prefix
     */
    app.getLogger = (prefix) => {
        const log = logger(prefix);
        logs.set(prefix, log.messages);
        return log.log;
    };
    //#endregion

    return app;
})();
// app.setDebug(false);

const logger = app.getLogger('1');
logger('1.1');
logger('1.2');
logger('1.3');
logger('1.4');

const logger2 = app.getLogger('2');
logger2('2.1');
logger2('2.2');
logger('1.5');
logger2('2.3');
logger2('2.4');

console.log(app.getLoggers());
