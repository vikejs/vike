import { page, run, autoRetry, fetchHtml } from "../../libframe/test/setup";

export { runTests };

function runTests(
  cmd: "npm run dev" | "npm run prod" | "npm run dev:miniflare",
  { hasStarWarsPage }: { hasStarWarsPage: boolean }
) {
  if (isWindows() && cmd === "npm run dev:miniflare") {
    test("SKIPED: miniflare doesn't work with Windows", () => {});
    return;
  }

  run(cmd);

  test("page content is rendered to HTML", async () => {
    const html = await fetchHtml("/");
    expect(html).toContain("<h1>Welcome</h1>");
  });

  test("page is rendered to the DOM and interactive", async () => {
    expect(await page.textContent("h1")).toBe("Welcome");
    expect(await page.textContent("button")).toBe("Counter 0");
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click("button");
      expect(await page.textContent("button")).toBe("Counter 1");
    });
  });

  test("about page", async () => {
    await page.click('a[href="/about"]');
    expect(await page.textContent("h1")).toBe("About");
  });

  if (hasStarWarsPage) {
    test("data fetching", async () => {
      await page.click('a[href="/star-wars"]');
      await autoRetry(async () => {
        expect(await page.textContent("h1")).toBe("Star Wars Movies");
      });
      expect(await page.textContent("body")).toContain("The Phantom Menace");
    });
  }
}

function isWindows() {
  return process.platform === "win32";
}
