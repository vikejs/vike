import React from "react";
import ReactDOM from "react-dom";
import { PageLayout } from "./PageLayout";
import { useClientRouter } from "vite-plugin-ssr/client/router";
import { PageContext } from "./types";
import { getPageTitle } from "./getPageTitle";

const { hydrationPromise } = useClientRouter({
  render(pageContext: PageContext) {
    const { Page, pageProps } = pageContext;
    const page = (
      <PageLayout>
        <Page {...pageProps} />
      </PageLayout>
    );
    const container = document.getElementById("page-view");
    if (pageContext.isHydration) {
      ReactDOM.hydrate(page, container);
    } else {
      ReactDOM.render(page, container);
    }
    document.title = getPageTitle(pageContext)
  },
  onTransitionStart,
  onTransitionEnd,
});

hydrationPromise.then(() => {
  console.log("Hydration finished; page is now interactive.");
});

function onTransitionStart() {
  console.log("Page transition start");
  document.querySelector("#page-content")!.classList.add("page-transition");
}
function onTransitionEnd() {
  console.log("Page transition end");
  document.querySelector("#page-content")!.classList.remove("page-transition");
}
