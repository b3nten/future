<div align="center">
<br />

![Future](.github/banner.jpg)

<h3>Future 🔮</h3>

#### Inspect and resolve promises from the outside

[![Npm package yearly downloads](https://badgen.net/npm/dy/express)](https://npmjs.com/package/express)
[![GitHub stars](https://img.shields.io/github/stars/freeCodeCamp/freeCodeCamp.svg?style=social&label=Star&maxAge=2592000)](https://github.com/freeCodeCamp/freeCodeCamp)
[![NuGet stable version](https://badgen.net/nuget/v/newtonsoft.json)](https://nuget.org/packages/newtonsoft.json)

*Future is a wrapper around promises that allows external and synchronous access to promises*
</div>

```typescript
const future = new Future<string, Error>((resolve, reject) => {
	setTimeout(() => {
		if(performance.now() % 2 === 0){
			resolve("It worked!")
		} else {
			reject(Error("It didn't work."))
		}
	}, 2000)
})

future.status    // "pending" | "resolved" | "rejected"
future.value     // string | undefined
future.rejection // Error | undefined

future.pending  // boolean
future.resolved // boolean
future.rejected // boolean

future.resolve("Resolving from outside!")
future.reject(Error("Rejection from outside."))

future.then    // = Promise.then
future.catch   // = Promise.catch
future.finally // = Promise.finally
```