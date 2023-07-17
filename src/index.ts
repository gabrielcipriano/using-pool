
// @ts-ignore
Symbol.dispose = Symbol.dispose ?? Symbol("Symbol.dispose");

export class Pool<T extends object = {}> {
    private readonly factory: () => T;
    private readonly maxSize: number = Infinity;

    private readonly objs: (T & Disposable)[] = [];

    constructor(factory?: () => T, options?: { maxSize: number }){
        this.factory = factory || (() => ({} as T));

        if(options && options.maxSize){
            this.maxSize = options.maxSize;
        }
    }

    get(): T & Disposable{
        if(this.objs.length > 0){
            const obj =  this.objs[this.objs.length - 1];
            this.objs.length -= 1;
            return obj;
        }

        const obj = this.factory() as T & Disposable;

        const originalDispose = obj[Symbol.dispose];
        
        Object.defineProperty(obj, Symbol.dispose, { 
            value: () => {
                originalDispose?.();

                if (this.objs.length < this.maxSize) {
                    this.objs[this.objs.length] = obj;
                }
            },
            enumerable: false
        });

        return obj;
    }
}
