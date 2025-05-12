import { expect, fetchHtml, getServerUrl, page, run, test } from "@brillout/test-e2e";

export { testRun };

let isProd: boolean;

function testRun(cmd: `pnpm run ${"dev" | "preview"}${string}`, options?: Parameters<typeof run>[1]) {
  run(cmd, options);

  isProd = !cmd.startsWith("pnpm run dev");

  testUrl({
    url: "/",
    title: "My Vike App",
    text: isProd ? "SSR running on Cloudflare" : "Rendered to HTML",
    textHydration: "Rendered to HTML",
  });

  testUrl({
    url: "/star-wars",
    title: "6 Star Wars Movies",
    text: "A New Hope",
  });

  testUrl({
    url: "/star-wars/3",
    title: "Return of the Jedi",
    text: "1983-05-25",
  });
}

function testUrl({
  url,
  title,
  text,
  textHydration,
  noSSR,
}: {
  url: string;
  title: string;
  text: string;
  textHydration?: string;
  counter?: true;
  noSSR?: true;
}) {
  test(`${url} (HTML)`, async () => {
    const html = await fetchHtml(url);
    if (!noSSR) {
      expect(html).toContain(text);
    }
    expect(getTitle(html)).toBe(title);
  });
  test(`${url} (Hydration)`, async () => {
    await page.goto(getServerUrl() + url);
    const body = await page.textContent("body");
    expect(body).toContain(textHydration ?? text);
  });
}

function getTitle(html: string) {
  const title = html.match(/<title>(.*?)<\/title>/i)?.[1];
  return title;
}
