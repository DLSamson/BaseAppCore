class App {
    //#region debug
    _debug = true;
    set debug(new_debug) { this._debug = !!new_debug };
    get debug() { return this._debug };
    //#endregion

    //#region logs
    _logs = new Map();
    _log = this.getLogger('App');
    get loggers() { return Object.fromEntries(this._logs) };
    /** @param {string} prefix */
    getLogger(prefix) {
        /**
         * @param {string} message - The message to be logged.
         * @param {object} [data={}] - Optional data associated with the message.
         */
        const log = (message, data = {}) => {
            messages.push({ time: Date.now(), message, data });
            if (this._debug) console.log(`${prefix}: ${message}`, data);
        }
        const messages = [];
        this._logs.set(prefix, messages);
        return log;
    }
    //#endregion

    //#region setup
    /** @param {Object<string, Function[]>} initializersGroups */
    ready(initializersGroups) {
        this._log('Setting up initializers...');
        const fn = event => {
            this._log('ready', event);
            this.runInitializers(initializersGroups);
        };

        document.readyState === 'loading'
            ? document.addEventListener('DOMContentLoaded', fn)
            : fn();
        
        return this;
    };

    /** @param {Object<string, Function[]>} initializersGroups */
    alpineReady(initializersGroups) {
        this._log('Setting up alpine initializers...');
        const fn = event => {
            this._log('alpine ready', event);
            this.runInitializers(initializersGroups);
        };

        document.addEventListener('alpine:init', fn);

        return this;
    }

    /** @param {Object<string, Function[]>} initializersGroups */
    runInitializers = (initializersGroups) => Object.entries(initializersGroups).forEach(([groupName, initializers]) => {
        const log = this.getLogger('runInitializers');
        log(`START GROUP INITIALIZING  : ${groupName}`);
        initializers.forEach(initializer => {
            try {
                log(`Initing: ${initializer.name}`);
                initializer(this.getLogger(initializer.name));
                log(`Inited: ${initializer.name}`);
            } catch (error) {
                log(`Error occurred while running initializer: ${initializer.name}`, error);
            }
        });
        log(`END GROUP INITIALIZING: ${groupName}`);
    });
    //#endregion

    // #region modules
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
            js: ['https://code.jquery.com/jquery-3.7.1.min.js'],
            css: [],
        },
        alpine: {
            js: ['https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js'],
            css: [],
        },
        axios: {
            js: ['https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js'],
            css: [],
        },
        skeletonCss: {
            js: [],
            css: ['https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css'],
        }
    }

    getModules = () => Object.keys(this._modules);

    /** @param {string[]} keys */
    loadModules(keys) {
        keys.forEach(key => {
            const { js, css } = this._modules[key];
            js.forEach(src => {
                this.loadScript(src)
                    .then(script => this._log(`script loaded: ${src}`, script))
                    .catch(error => this._log(`script load error: ${src}`, error));
            });
            css.forEach(url => {
                this.loadStyles(url)
                    .then(style => this._log(`style loaded: ${url}`, style))
                    .catch(error => this._log(`style load error: ${url}`, error));
            });
        });

        return this;
    }
    // #endregion
}

const initSomething = (log) => {
    setTimeout(() => {
        log('Something is happening...');
    }, 50000);
}

const showLogs = () => {
    if (!app.debug) return;
    console.log(app.loggers);
}

const toggler = (log) => Alpine.data('open', () => ({
    log: log,
    show: false,
    toggle() {
        this.show = !this.show;
    },
    close() {
        this.show = false;
    }
}));

const counter = (log) => Alpine.data('counter', () => ({
    log: log,
    count: 0,
    increment() {
        this.count++;
    },
    decrement() {
        this.count--;
    }
}))


const app = new App();

app
    .loadModules(['jquery', 'alpine', 'axios', 'skeletonCss'])
    .ready({
        utils: [
            initSomething,
        ],
        logs: [
            showLogs,
        ],
    })
    .alpineReady({
        utils: [
            toggler,
            counter
        ],
    });