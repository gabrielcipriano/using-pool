import { Pool } from './Pool';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const aPool = suite('Pool');

aPool('should be defined', () => {
    const pool = new Pool();
    assert.ok(pool);
});

aPool('should auto recycle objects when using the "using" keyword', () => {
    const pool = new Pool(() => ({ a: 1, b: 2 }));

    const wm = new WeakMap(); // to give each object a unique id

    if (true) { // new scope
        using obj = pool.get();

        wm.set(obj, 1);
    }// dispose recycles the object

    using obj = pool.get();

    assert.is(wm.get(obj), 1);
});

aPool('should auto recycle objects with a custom dispose method', () => {
    const pool = new Pool(() => ({ 
        prop: 0,
        [Symbol.dispose]() { // we can use it to 'reset' the object when it is recycled
            this.prop = 0;
        }
    }));

    const wm = new WeakMap(); // to give the object a unique id

    if (true) {
        using obj = pool.get();

        obj.prop = 1;

        wm.set(obj, 2);
    }

    using obj = pool.get();

    assert.is(wm.get(obj), 2);
    assert.is(obj.prop, 0);
});

aPool('should be limited to a max size', () => {
    const pool = new Pool(() => ({}), { maxSize: 1 });

    const wm = new WeakMap(); // to give each object a unique id

    if (true) {
        using obj1 = pool.get();
        using obj2 = pool.get();

        wm.set(obj1, 1);
        wm.set(obj2, 2);
    }// dispose resolves as a stack. So obj2 is recycled, and obj1 is not due to the max size

    using obj = pool.get();

    assert.is(wm.get(obj), 2);

    using otherObj = pool.get();

    assert.is(wm.has(otherObj), false);
});

aPool.run();
