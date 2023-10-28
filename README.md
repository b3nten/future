<div align="center">
<br />

![Future](.github/banner.jpg)

<h3>Future 🔮</h3>

#### Create future values that resolve lazily

[![Npm package yearly downloads](https://badgen.net/npm/dy/express)](https://npmjs.com/package/express)
[![GitHub stars](https://img.shields.io/github/stars/freeCodeCamp/freeCodeCamp.svg?style=social&label=Star&maxAge=2592000)](https://github.com/freeCodeCamp/freeCodeCamp)
[![NuGet stable version](https://badgen.net/nuget/v/newtonsoft.json)](https://nuget.org/packages/newtonsoft.json)

*Future lets you create future worlds (values) that can be realized lazily*
</div>

### Huh?

Future is a wrapper around promises that don't begin resolving until they are either awaited or chained with `.then()`. You can think of a `future` as a promise that doesn't begin executing until it's value is requested.

#### Why?

Futures allow you to inspect and even set it's value from the outside. You can create futures, set a default value, await it sometime in the future and then resolve it or reject it from the outside based on your control flow. You can return a cleanup function from a future that is called when the future resolves or rejects. For example, you can create a future that calls `fetch` and returns a cleanup that aborts the fetch call. If your data dependencies change you can resolve/reject the future which automatically aborts the fetch.

#### Example:

```typescript
const future = new Future<string, Error>((resolve, reject) => {
  const tmnt = setTimeout(() => {
    if(performance.now() % 2 === 0){
      resolve("It worked!")
    } else {
      reject(Error("It didn't work."))
    }
  }, 2000)
  return () => clearTimeout(tmnt) // called on resolve/reject.
})

future.realize() // Begins execution. Same as `await future` or `future.then()`.

future.status    // "pending" | "resolved" | "rejected"
future.value     // string | undefined
future.rejection // Error | undefined

future.pending  // boolean
future.resolved // boolean
future.rejected // boolean

future.resolve("Resolving from outside!")
future.reject(Error("Rejection from outside."))
```

#### Destroying the Future

In the future (lol) I'd like to provide the ability to destroy a future, which prevents chained futures from executing as well. The issue is that it would also prevent an `await` call from executing, which hangs and throws an unresolved promise error. If you have suggestions on how to handle this ergonomically I'd love to hear it. 