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

    const objId = new WeakMap();

    if (true) { // new scope
        using obj = pool.get();

        objId.set(obj, 'cipriano');
    }// dispose recycles the object

    using obj = pool.get();

    assert.is(objId.get(obj), "cipriano");
});

aPool.run();
