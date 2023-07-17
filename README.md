# using-pool
An object pool library using modern Typescript for auto-recycling.

It takes advatage of the `using` keyword to recycle the object as soon as it leaves the scope.

Example:

```typescript
import { Pool } from 'using-pool'

const userPool = new Pool(() => ({/** a object factory */}))

function doSomething() {
    using user = userPool.get()

    // do some work with the object
    // (...)

} // as soon as it leaves the scope, `user` is recycled (comes back to the pool to be reused)

```

## pre requisites
- node version: `14` or later
- typescript version: `5.2.0-beta` or later

You will also need to set your compilation target to `"es2022"` or below, and configure your lib setting to either include `"esnext"` or `"esnext.disposable"`.

```json
// tsconfig.json
{
    "compilerOptions": {
        "target": "es2022",
        "lib": ["es2022", "esnext.disposable", "dom"]
        // (...)
    }
}
```