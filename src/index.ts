import { PuppeteerClient, PuppeteerClientOptions } from "@xcrap/puppeteer-client"
import { PuppeteerExtra, PuppeteerExtraPlugin } from "puppeteer-extra"

import { requireVanillaPuppeteer } from "./utils"

export type PuppeteerExtraClientOptions = PuppeteerClientOptions & {
    plugins?: PuppeteerExtraPlugin[]
}

export class PuppeteerExtraClient extends PuppeteerClient {
    readonly puppeteer: PuppeteerExtra

    constructor(options: PuppeteerExtraClientOptions = {}) {
        super(options)

        this.puppeteer = new PuppeteerExtra(...requireVanillaPuppeteer())

        if (options.plugins) {
            for (const plugin of options.plugins) {
                this.usePlugin(plugin)
            }
        }
    }

    protected async initBrowser(): Promise<void> {
        const puppeteerArguments: string[] = []

        if (this.proxy) {
            const currentProxy = typeof this.proxy === "function" ?
                this.proxy() :
                this.proxy

            puppeteerArguments.push(`--proxy-server=${currentProxy}`)
        }

        if (this.options.args && this.options.args.length > 0) {
            puppeteerArguments.push(...this.options.args)
        }

        this.browser = await this.puppeteer.launch({
            ...this.options,
            args: puppeteerArguments,
            headless: this.options.headless,
        })
    }

    usePlugin(plugin: PuppeteerExtraPlugin): void {
        this.puppeteer.use(plugin)
    }
}