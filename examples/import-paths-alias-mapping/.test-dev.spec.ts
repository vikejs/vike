import { autoRetry, page, run, urlBase } from "../../tests/setup";

run("npm run dev");

test("Counter succesfully imported in dev", async () => {
  page.goto(`${urlBase}/`);
  expect(await page.textContent("body")).toContain("Counter 0");
  // `autoRetry` because browser-side code may not be loaded yet
  await autoRetry(async () => {
    await page.click("button");
    expect(await page.textContent("body")).toContain("Counter 1");
  });
});
