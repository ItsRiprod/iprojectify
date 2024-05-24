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
  const [darkMode, setDarkMode] = React.useState(true);

  React.useEffect(() => {
    const isDarkMode =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.theme = newDarkMode ? "dark" : "light";
  };


  return (
    <div className={darkMode ? "dark" : "light"}>
      <TopNavBar />
      <section className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
          {children}
      </section>
      <footer className="footer">
        <div className="max-w-screen flex justify-center h-10 p-2 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900">
          <button className="bg-slate-200 dark:bg-slate-800 rounded px-1 mr-3 hover:bg-amber-600 transition-color duration-500" onClick={toggleDarkMode}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <p>| Web Version: 00.00.1</p>
          <p>&copy; You!</p>
        </div>
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
