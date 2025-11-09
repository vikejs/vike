export { Layout };

import type { PropsWithChildren } from "react";

import "./Layout.css";

function Layout({ children }: PropsWithChildren) {
  return (
    <PageLayout>
      <Sidebar>
        <img width={48} src="/assets/logo.svg" alt="Vike logo" />
        <a className="navitem" href="/">
          Home
        </a>
        <a className="navitem" href="/about">
          About
        </a>
      </Sidebar>
      <Content>{children}</Content>
    </PageLayout>
  );
}

function PageLayout({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        display: "flex",
        maxWidth: 900,
        margin: "auto",
      }}
    >
      {children}
    </div>
  );
}

function Sidebar({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        padding: 20,
        paddingTop: 42,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        lineHeight: "1.8em",
      }}
    >
      {children}
    </div>
  );
}

function Content({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        padding: 20,
        paddingBottom: 50,
        borderLeft: "2px solid #eee",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}
