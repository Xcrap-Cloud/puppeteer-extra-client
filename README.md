# 🕷️ Xcrap Puppeteer Extra Client

**Xcrap Puppeteer Extra Client** is an [Xcrap](https://www.npmjs.com/package/xcrap) framework package that implements an HTTP client using the [Puppeteer Extra](https://www.npmjs.com/package/puppeteer-extra) library.

-----

## 📦 Installation

Installation is straightforward; just use your preferred dependency manager. Here's an example using NPM:

```cmd
npm i @xcrap/puppeteer-extra-client @xcrap/core @xcrap/parser
```

> You also need to install `@xcrap/parser` and `@xcrap/core` because they are `peerDependencies`. This means the package requires `@xcrap/parser` and `@xcrap/core` as dependencies, but it will use the versions the user has installed in their project.

-----

## 🚀 Usage

Like all HTTP clients, `PuppeteerExtraClient` has two methods: `fetch()` to make a request to a specific URL, and `fetchMany()` to make requests to multiple URLs simultaneously, allowing control over concurrency and delays between requests.

### Usage Example

```ts
import { PuppeteerExtraClient } from "@xcrap/puppeteer-extra-client"
import { extract } from "@xcrap/parser"

;(async () => {
    const client = new PuppeteerExtraClient()
    const url = "https://example.com"
    const response = await client.fetch({ url: url })
    const parser = response.asHtmlParser()
    const pageTitle = await parser.parseFist({ query: "title", extractor: extract("innerText") })

    console.log("Page Title:", pageTitle)
})();
```

### Using Plugins

As the main feature of `puppeteer-extra`, you can use plugins in the constructor as follows:

```ts
import { PuppeteerExtraClient } from "@xcrap/puppeteer-extra-client"
const StealthPlugin = require("puppeteer-extra-plugin-stealth")

const client = new PuppeteerExtraClient({
	plugins: [StealthPlugin()]
})
```

Or, if you've previously instantiated a client:

```ts
client.usePlugin(StealthPlugin())
```

### Using Actions

If you want to perform operations on the page before or after requests, you can use the `actions` property, which is an array of functions. Actions are flexible enough for you to do exactly what you would normally do with Puppeteer: log in, click buttons, evaluate functions, etc.

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

By default, an action is executed after the request. If you want to manually define when it should be executed, you'll need to pass an object instead of a simple function:

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

### Adding a Proxy

In an HTTP client that extends `BaseClient`, you can add a proxy in the constructor, as shown in the following example:

1.  **Providing a `proxy` string**:

    ```ts
    const client = new PuppeteerExtraClient({ proxy: "http://47.251.122.81:8888" })
    ```

2.  **Providing a function that will generate a `proxy`**:

    ```ts
    function randomProxy() {
    	const proxies = [
    		"http://47.251.122.81:8888",
    		"http://159.203.61.169:3128"
    	]
    	
    	const randomIndex = Math.floor(Math.random() * proxies.length)
    	
    	return proxies[randomIndex]
    }

    const client = new PuppeteerExtraClient({ proxy: randomProxy })
    ```

### Using a Custom User Agent

In a client that extends `BaseClient`, you can also customize the `User-Agent` for requests. You can do this in two ways:

1.  **Providing a `userAgent` string**:

    ```ts
    const client = new PuppeteerExtraClient({ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36" })
    ```

2.  **Providing a function that will generate a `userAgent`**:

    ```ts
    function randomUserAgent() {
    	const userAgents = [
    		"Mozilla/5.0 (iPhone; CPU iPhone OS 9_8_4; like Mac OS X) AppleWebKit/603.37 (KHTML, like Gecko)  Chrome/54.0.1244.188 Mobile Safari/601.5",
    		"Mozilla/5.0 (Windows NT 10.3;; en-US) AppleWebKit/537.35 (KHTML, like Gecko) Chrome/47.0.1707.185 Safari/601"
    	]
    	
    	const randomIndex = Math.floor(Math.random() * userAgents.length)
    	
    	return userAgents[randomIndex]
    }

    const client = new PuppeteerExtraClient({ userAgent: randomUserAgent })
    ```

### Using a Custom Proxy URL

In a client that extends `BaseClient`, you can use proxy URLs. I'm not entirely sure how best to explain how they work, but I stumbled upon this type of proxy when trying to solve a CORS issue by making a client-side request, and that's when I learned about *CORS Proxy*. Here's a [template](https://gist.github.com/marcuth/9fbd321b011da44d1287faae31a8dd3a) for a Cloudflare Workers proxy if you want to set up your own.

You can set it up the same way we did with the `userAgent`:

1.  **Providing a `proxyUrl` string**:

    ```ts
    const client = new PuppeteerExtraClient({ proxyUrl: "https://my-proxy-app.my-username.workers.dev" })
    ```

2.  **Providing a function that will generate a `proxyUrl`**:

    ```ts
    function randomProxyUrl() {
    	const proxyUrls = [
    		"https://my-proxy-app.my-username-1.workers.dev",
    		"https://my-proxy-app.my-username-2.workers.dev"
    	]
    	
    	const randomIndex = Math.floor(Math.random() * proxyUrls.length)
    	
    	return proxyUrls[randomIndex]
    }

    const client = new PuppeteerClient({ proxyUrl: randomProxyUrl })
    ```

-----

## 🧪 Tests

Automated tests are located in `__tests__`. To run them:

```bash
npm run test
```

-----

## 🤝 Contributing

  - Want to contribute? Follow these steps:
  - Fork the repository.
  - Create a new branch (git checkout -b feature-new).
  - Commit your changes (git commit -m 'Add new feature').
  - Push to the branch (git push origin feature-new).
  - Open a Pull Request.

-----

## 📝 License

This project is licensed under the MIT License.