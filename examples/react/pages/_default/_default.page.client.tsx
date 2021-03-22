import React from "react";
import ReactDOM from "react-dom";
import { PageLayout } from "./PageLayout";
import { useClientRouter } from "vite-plugin-ssr/client/router";

const { awaitInitialPageRender } = useClientRouter({
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

awaitInitialPageRender.then(() => {
  console.log("Hydration finished; page is now interactive.");
});

function onTransitionStart() {
  document.querySelector("#page-content")!.classList.add("page-transition");
  console.log("Page transition start");
}
function onTransitionEnd() {
  document.querySelector("#page-content")!.classList.remove("page-transition");
  document.body.classList.remove("page-transition");
  console.log("Page transition end");
}
