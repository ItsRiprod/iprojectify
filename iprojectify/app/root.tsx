import {
  Links,
  Link,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError
} from "@remix-run/react";
import { getSession, } from "./sessions.ts";

import globalStylesUrl from "./styles/global.css?url";
import darkStylesUrl from "./styles/dark.css?url";
import TopNavBar from "./components/topNav"
import stylesheet from "./tailwind.css?url";
import React from "react";

export let links = () => {
  return [
    { rel: "stylesheet", href: stylesheet },
    { rel: "stylesheet", href: globalStylesUrl },
    {
      rel: "stylesheet",
      href: darkStylesUrl,
      media: "(prefers-color-scheme: dark)",
    },
  ];
};

function Layout({ children }) {
 


  return (
    <div>
      <TopNavBar/>
      <section className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
          {children}
      </section>
      <footer className="footer flex justify-center h-10 p-2 z-50 bottom-0 w-full text-center text-sm text-slate-500 dark:text-slate-400 bg-slate-200/75 dark:bg-slate-900/75">
          
          <p>Web Version: 00.00.1</p>
          <p>&copy; You!</p>
      </footer>
    </div>
  );
}


export default function App() {
  return (
    <Document title="iProjectify">
      <Layout>
      
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({ children, title }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-950">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export const loader = async ({ request }) => {
  let loggedIn = false;
  const session = await getSession(
    request.headers.get("Cookie")
  );
  if (session.has("userId")) {
    loggedIn = true;
  }
  return { loggedIn };
};

