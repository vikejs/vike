import {
  page,
  run,
  autoRetry,
  fetchHtml,
  urlBase,
} from "../../libframe/test/setup";

export { testPages };

function testPages(
  cmd: "npm run dev" | "npm run prod:static" | "npm run prod:server",
  isDev: boolean = false
) {
  const baseUrl = isDev ? "" : "/dist/client";
  const addBaseUrl = (url: string) => baseUrl + url;

  run(cmd, { baseUrl });

  test("page content is rendered to HTML", async () => {
    const html = await fetchHtml(addBaseUrl("/"));

    expect(html).toContain("<h1>Welcome</h1>");
    expect(html).toContain(`<a href="${addBaseUrl("/")}">Home</a>`);
    expect(html).toContain(`<a href="${addBaseUrl("/about")}">About</a>`);
  });

  test("page is rendered to the DOM and interactive", async () => {
    expect(await page.textContent("h1")).toBe("Welcome");
    expect(await page.textContent("button")).toBe("Counter 0");
    await autoRetry(async () => {
      await page.click("button");
      expect(await page.textContent("button")).toContain("Counter 1");
    });
  });

  test("about page", async () => {
    await page.click(`a[href="${addBaseUrl("/about")}"]`);
    expect(await page.textContent("h1")).toBe("About");
    await autoRetry(async () => {
      expect(await page.$eval("h1", (e) => getComputedStyle(e).color)).toBe(
        "rgb(0, 128, 0)"
      );
    });
  });
}
