class ScrollQueue {
    constructor() {
        this.promise = null;
        this.resolve = null;
    }
    
    add() {
        this.promise = new Promise(resolve => {
            this.resolve = resolve;
        });
    }

    flush() {
        this.resolve && this.resolve();
        this.resolve = null;
        this.promise = null;
    }

    async wait() {
        await this.promise
    }
}

export const scrollWaiter = new ScrollQueue();