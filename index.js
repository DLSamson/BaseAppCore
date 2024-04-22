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
}));

const highlight = (log) => {
    const elements = document.querySelectorAll('pre code');
    elements.forEach((element) => {
        hljs.highlightElement(element);
    });
}


const app = new App();

app
    .loadModules(['jquery', 'alpine', 'axios', 'skeletonCss', 'highlight'])
    .ready({
        utils: [
            highlight,
            initSomething,
        ],
        logs: [
            showLogs,
        ],
    })
    .alpineReady({
        utils: [
            toggler,
            counter,
        ],
    });