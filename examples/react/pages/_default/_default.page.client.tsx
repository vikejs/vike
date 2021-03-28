import React from "react";
import ReactDOM from "react-dom";
import { PageLayout } from "./PageLayout";
import { useClientRouter } from "vite-plugin-ssr/client/router";

const { hydrationPromise } = useClientRouter({
  render({ Page, pageProps, isHydration }) {
    const page = (
      <PageLayout>
        <Page {...pageProps} />
      </PageLayout>
    );
    const container = document.getElementById("page-view");
    if (isHydration) {
      ReactDOM.hydrate(page, container);
    } else {
      ReactDOM.render(page, container);
    }
    document.title = pageProps.docTitle || "Demo";
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
