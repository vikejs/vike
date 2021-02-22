import React from "react";

export { Page };

function Page({ url }: { url: string }) {
  return (
    <>
      <h1>Not Found</h1>
      Nothing to be found at <code>{url}</code>.
    </>
  );
}
