export function requireVanillaPuppeteer() {
    try {
        return [require("puppeteer"), undefined]
    } catch {}

    try {
        return [require("puppeteer-core"), undefined]
    } catch (error) {
        return [undefined, error]
    }
}