import {
  page,
  run,
  urlBase,
} from "../../libframe/test/setup";

export { runTests };

function runTests(cmd: "npm run dev" | "npm run prod") {
  run(cmd);

  test("Route String still works (1)", async () => {
    await page.goto(urlBase + "/products");
    const text = await page.textContent("#page-content");
    expect(text).toContain("Product list:");
    expect(text).toContain("Product 42");
    await page.click('a[href="/product/1337"]');
    expect(await page.textContent("#page-content")).toBe('Product 1337')
  });

  test("`export const filesystemRoutingRoot = '/'` in `_default.page.route.js`", async () => {
    await page.goto(urlBase + "/about");
    expect(await page.textContent("#page-content")).toBe('About page')
    await page.click('a[href="/"]');
    expect(await page.textContent("#page-content")).toBe('Welcome')
  })

  test("normal Filesystem Routing", async () => {
    await page.goto(urlBase + "/auth/login");
    expect(await page.textContent("#page-content")).toBe('Login page')
    await page.goto(urlBase + "/auth/signup");
    expect(await page.textContent("#page-content")).toBe('Signup page')
  })
}
