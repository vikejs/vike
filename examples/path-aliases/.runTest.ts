import { autoRetry, page, run, urlBase } from "../../tests/setup";

export { runTest };

function runTest(npmScript: "npm run dev" | "npm run prod") {
  run(npmScript);

  test(`Counter succesfully imported [${npmScript}]`, async () => {
    page.goto(`${urlBase}/`);
    expect(await page.textContent("body")).toContain("Counter 0");
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click("button");
      expect(await page.textContent("body")).toContain("Counter 1");
    });
  });
}
