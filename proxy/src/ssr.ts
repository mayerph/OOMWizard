import * as puppeteer from "puppeteer"

export async function ssr(url: string) {
  console.info("rendering the page in ssr mode")
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  try {
    await page.goto(url)
    await page.waitForSelector("#shared-image")
  } catch (err) {
    console.error(err)
    throw new Error("page.goto/waitForSelector timed out.")
  }

  const html = await page.content()
  await browser.close()

  return { html }
}
