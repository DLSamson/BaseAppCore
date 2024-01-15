class App {
    //#region debug
    _debug = true;
    set debug(new_debug) {this._debug = !!new_debug};
    get debug() {return this._debug};
    //#endregion

    //#region logs
    _logs = new Map();
    _log = this.getLogger('App');
    get loggers() {return Object.fromEntries(this._logs)};
    /** @param {string} prefix */
    getLogger(prefix) {
        /**
         * @param {string} message - The message to be logged.
         * @param {object} [data={}] - Optional data associated with the message.
         */
        const log = (message, data = {}) => {
            messages.push({time: Date.now(), message, data});
            if(this._debug) console.log(`${prefix}: ${message}`, data);
        }
        const messages = [];
        this._logs.set(prefix, messages);
        return log;
    }
    //#endregion

    //#region setup
    /** @param {Array<Function>} initializers */
    ready = (initializers) => {
        this._log('Setting up initializers...');
        const fn = () => initializers.map(initializer => {
            try {
                this._log(`Running: ${initializer.name}`);
                initializer();
                this._log(`Complete: ${initializer.name}`);
            } catch(error) {
                this._log(`Error occurred while running initializer: ${initializer.name}`, {error});
            }
        });

        document.readyState === 'loading'
            ? document.addEventListener('DOMContentLoaded', fn)
            : fn();
    };
    //#endregion

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }
    loadStyles(url) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }
    _modules = {
        jquery: {
            js: [],
            css: [],
        }
    }
    
    loadModules(keys) {

    }
}
const app = new App();

const initSomething = () => {
    const log = app.getLogger('initSomething');
    log('START');
    setTimeout(() => {
        log('Something is happening...');
    }, 2500);
    log('END');
}
const showLogs = () => {
    if(!app.debug) return;
    console.log(app.loggers);
}

app.ready([
    initSomething,
    showLogs
]);
