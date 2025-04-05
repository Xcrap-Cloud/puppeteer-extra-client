# 🕷️ Xcrap Extra Puppeteer Client

**Xcrap Puppeteer Extra Client** is an Xcrap framework package that implements an HTTP client using the [Puppeteer Extra](https://www.npmjs.com/package/puppeteer-extra) library.

## 📦 Installation

For installation, there are no secrets, just use your preferred dependency manager. Here is an example using NPM:

```cmd
npm i @xcrap/puppeteer-extra-client @xcrap/core @xcrap/parser
```

> You need to install `@xcrap/parser` and `@xcrap/core` as well because I left them as `peerDependencies`, which means that the package needs `@xcrap/parser` and `@xcrap/core` as dependencies, however, the ones that the user has installed in the project will be used.

## 🚀 Usage

Just like every HTTP client, `PuppteerExtraClient` has two methods: `fetch()` to make a request to a specific URL and `fetchMany()` to make requests to multiple URLs at the same time, being able to control competition and delays between requests.

### Usage Example

```ts
import { PuppteerClient } from "@xcrap/puppeteer-client"
import { extract } from "@xcrap/parser"

;(async () => {
    const client = new PuppteerClient()
    const url = "https://example.com"
    const response = await client.fetch({ url: url })
    const parser = response.asHtmlParser()
    const pageTitle = await parser.parseFist({ query: "title", extractor: extract("innerText") })

    console.log("Page Title:", pageTitle)
})();
```

### Using Plugins

Being the main functionality of `puppeteer-extra`, you can use plugins in the constructor as follows:

```ts
import { PuppeteerExtraClient } from "@xcrap/puppeteer-extra-client"
const StealthPlugin = require("puppeteer-extra-plugin-stealth")

const client = new PuppeteerExtraClient({
	plugins: [StealthPlugin()]
})
```

Or if you have previously instantiated a client:

```ts
client.usePlugin(StealthPlugin())
```

### Using Actions

If you want to perform operations on the page before or after requests, you can use the `actions` property, which is an array of functions. Actions are flexible enough that you can do exactly what you would normally do with Puppeteer: login, click buttons, evaluate functions, etc.

```ts
const response = await client.fetch({
	url: "https://example.com",
	actions: [
		async (page) => {
			await page.type("#username", "user")
			await page.type("#password", "mypassword123")
			await page.click("#submit")
		}
	]
})
```

By default, an action is executed after the request. If you want to manually define when it will be executed, you will have to pass an object instead of a simple function:

```ts
const response = await client.fetch({
	url: "https://example.com",
	actions: [
		{
			type: "afterRequest", // Executed after the request
			exec: async (page) => {
				await page.type("#username", "user")
				await page.type("#password", "mypassword123")
				await page.click("#submit")
			}
		},
		{
			type: "beforeRequest", // Executed before the request
			func: async (page) => {
				const width = 1920 + Math.floor(Math.random() * 100)
				const height = 3000 + Math.floor(Math.random() * 100)
		
				await page.setViewport({
					width: width,
					height: height,
					deviceScaleFactor: 1,
					hasTouch: false,
					isLandscape: false,
					isMobile: false,
				})
			}
		}
	]
})
```

### Adding a proxy

In an HTTP client that extends from `BaseClient` we can add a proxy in the constructor as we can see in the following example:

1. **Providing a `proxy` string**:

```ts
const client = new PuppteerClient({ proxy: "http://47.251.122.81:8888" })
```

2. **Providing a function that will generate a `proxy`:**

```ts
function randomProxy() {
	const proxies = [
        "http://47.251.122.81:8888",
        "http://159.203.61.169:3128"
    ]
	
	const randomIndex = Math.floor(Math.random() * proxies.length)
	
	return proxies[randomIndex]
}

const client = new PuppteerClient({ proxy: randomProxy })
```

### Using a custom User Agent

In a client that extends `BaseClient` we can also customize the `User-Agent` of requests. We can do this in two ways: 

1. **Providing a string of `userAgent`**:

```ts
const client = new PuppteerClient({ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36" })
```

2. **Providing a function that will generate a `userAgent`**:

```ts
function randomUserAgent() {
	const userAgents = [
		"Mozilla/5.0 (iPhone; CPU iPhone OS 9_8_4; like Mac OS X) AppleWebKit/603.37 (KHTML, like Gecko) Chrome/54.0.1244.188 Mobile Safari/601.5",
		"Mozilla/5.0 (Windows NT 10.3;; en-US) AppleWebKit/537.35 (KHTML, like Gecko) Chrome/47.0.1707.185 Safari/601"
	]
	
	const randomIndex = Math.floor(Math.random() * userAgents.length)
	
	return userAgents[randomIndex]
}

const client = new PuppteerClient({ userAgent: randomUserAgent })
```

### Using Custom Proxy URL

In a client that extends from `BaseClient` we can use proxy URLs, I'm not sure how I can explain to you how they work, but I kind of ended up discovering this type of porxy when I was trying to solve the CORS problem by making a request on the client side, and then I discovered *CORS Proxy*. Here I have a [template](https://gist.github.com/marcuth/9fbd321b011da44d1287faae31a8dd3a) of one for CloudFlare Workers if you want to create your own.

Well, we can do it the same way we did with `userAgent`: 

1. **Providing a string of `proxyUrl`**:

```ts
const client = new PuppteerClient({ proxyUrl: "https://my-proxy-app.my-username.workers.dev" })
```

2. **Providing a function that will generate a `proxyUrl`**:

```ts
function randomProxyUrl() {
	const proxyUrls = [
		"https://my-proxy-app.my-username-1.workers.dev",
		"https://my-proxy-app.my-username-2.workers.dev"
	]
	
	const randomIndex = Math.floor(Math.random() * proxyUrls.length)
	
	return proxyUrls[randomIndex]
}

const client = new PuppteerClient({ proxyUrl: randomProxyUrl })
```

## 🤝 Contributing

- Want to contribute? Follow these steps:
- Fork the repository.
- Create a new branch (git checkout -b feature-new).
- Commit your changes (git commit -m 'Add new feature').
- Push to the branch (git push origin feature-new).
- Open a Pull Request.

## 📝 License

This project is licensed under the MIT License.
