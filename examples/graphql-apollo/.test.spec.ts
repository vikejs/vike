import {
  autoRetry,
  fetchHtml,
  page,
  partRegExp,
  run,
  urlBase,
} from "../../tests/setup";

const isHexNumber = /[0-9a-f]+/;

run("npm run start");

test("page is rendered to HTML", async () => {
  const html = await fetchHtml("/");
  expect(html).toContain(
    "<li>Angola</li><li>Antarctica</li><li>Argentina</li><li>American Samoa</li>"
  );
  expect(html).toContain("<button>Counter <span>0</span></button>");
  expect(html).toMatch(
    partRegExp`{pageProps:{randomMessage:"${isHexNumber}"},apolloIntialState:{ROOT_QUERY`
  );
});

test("page is hydrated to DOM", async () => {
  page.goto(`${urlBase}/`);
  expect(await page.textContent("button")).toBe("Counter 0");
  // `autoRetry` because browser-side code may not be loaded yet
  await autoRetry(async () => {
    await page.click("button");
    expect(await page.textContent("button")).toBe("Counter 1");
  });
  expect(await page.textContent("body")).toMatch(
    partRegExp`Random message from server: ${isHexNumber}.`
  );
  expect(await page.textContent("body")).toContain("Antarctica");
});
