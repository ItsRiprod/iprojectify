import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, createCookieSessionStorage, json, redirect as redirect$1 } from "@remix-run/node";
import { RemixServer, Outlet, Link, Meta, Links, ScrollRestoration, Scripts, useRouteError, isRouteErrorResponse, useLoaderData, Form, redirect, useActionData } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const globalStylesUrl = "/assets/global-CUvIeSlx.css";
const darkStylesUrl = "/assets/dark-EZe86R8G.css";
let links = () => {
  return [
    { rel: "stylesheet", href: globalStylesUrl },
    {
      rel: "stylesheet",
      href: darkStylesUrl,
      media: "(prefers-color-scheme: dark)"
    }
  ];
};
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("div", { className: "remix-app", children: [
    /* @__PURE__ */ jsx("header", { className: "remix-app__header", children: /* @__PURE__ */ jsxs("div", { className: "container remix-app__header-content", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", title: "Remix", className: "remix-app__header-home-link" }),
      /* @__PURE__ */ jsx("nav", { "aria-label": "Main navigation", className: "remix-app__header-nav", children: /* @__PURE__ */ jsxs("ul", { children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", children: "Home" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/dashboard", children: "Dashboard" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/admin", children: "Admin" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/login", children: "login" }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "remix-app__main", children: /* @__PURE__ */ jsx("div", { className: "container remix-app__main-content", children }) }),
    /* @__PURE__ */ jsx("footer", { className: "remix-app__footer", children: /* @__PURE__ */ jsx("div", { className: "container remix-app__footer-content", children: /* @__PURE__ */ jsx("p", { children: "© You!" }) }) })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Document, { children: /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Outlet, {}) }) });
}
function Document({ children, title }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      title ? /* @__PURE__ */ jsx("title", { children: title }) : null,
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("h1", { children: [
        error.status,
        " ",
        error.statusText
      ] }),
      /* @__PURE__ */ jsx("p", { children: error.data })
    ] });
  } else if (error instanceof Error) {
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: "Error" }),
      /* @__PURE__ */ jsx("p", { children: error.message }),
      /* @__PURE__ */ jsx("p", { children: "The stack trace is:" }),
      /* @__PURE__ */ jsx("pre", { children: error.stack })
    ] });
  } else {
    return /* @__PURE__ */ jsx("h1", { children: "Unknown Error" });
  }
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
const { getSession, commitSession, destroySession } = createCookieSessionStorage(
  {
    cookie: {
      name: "session",
      secure: process.env.NODE_ENV === "production",
      secrets: ["thisIsASecretYouShouldChange"],
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true
    }
  }
);
const loader$3 = async ({ request }) => {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  if (!session.has("userId")) {
    console.log("Not logged in!");
    return redirect("/login");
  }
  let projects;
  try {
    const { getProjects } = await import("./db.server.firebase-Dli1vNHA.js");
    projects = await getProjects(session.get("userId"));
  } catch (exception) {
    console.error(exception);
  }
  console.log("Idk whats happening here");
  return { projects };
};
async function action$2({ request }) {
  const { createProject } = await import("./db.server.firebase-Dli1vNHA.js");
  const session = await getSession(
    request.headers.get("Cookie")
  );
  createProject(session.get("userId"), { ownerId: session.get("userId") });
  return redirect("/dashboard");
}
function Dashboard() {
  const { projects } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "Dashboard" }),
    /* @__PURE__ */ jsx(Form, { method: "post", children: /* @__PURE__ */ jsx("button", { type: "submit", children: "Add Project" }) }),
    /* @__PURE__ */ jsx("ul", { children: projects != null ? Object.keys(projects).map((index, project) => /* @__PURE__ */ jsxs("li", { children: [
      /* @__PURE__ */ jsx("h2", { children: index }),
      /* @__PURE__ */ jsx("p", { children: project })
    ] }, index)) : /* @__PURE__ */ jsx(Fragment, { children: "Nothing In Your Dashboard" }) })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: Dashboard,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
async function loader$2({ request }) {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  if (session.has("userId")) {
    console.log("Already Logged In!");
  }
  const data = { error: session.get("error") };
  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
}
async function action$1({ request }) {
  const formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);
  console.log(_action);
  if (_action === "email") {
    try {
      const { signUp } = await import("./db.server.firebase-Dli1vNHA.js");
      const email = formData.get("email");
      const password = formData.get("password");
      const { user, userId } = await signUp(email, password);
      const idToken = await user.getIdToken();
      const session = await getSession();
      session.set("idToken", idToken);
      session.set("userId", userId);
      return redirect$1("/", {
        headers: {
          "Set-Cookie": await commitSession(session)
        }
      });
    } catch (error) {
      return json({ error: error.message }, { status: 400 });
    }
  }
  if (_action === "google") {
    try {
      const { signInWithGoogle } = await import("./db.server.firebase-Dli1vNHA.js");
      const { createUserSession } = await import("./session.server-fw0SI87g.js");
      const { user, userId } = await signInWithGoogle();
      const idToken = await user.getIdToken();
      return createUserSession(idToken, userId, "/");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return json({ error: error.message }, { status: 400 });
    }
  }
}
function SignUp() {
  const actionData = useActionData();
  return /* @__PURE__ */ jsxs("div", { className: "signup", children: [
    /* @__PURE__ */ jsx("h1", { children: "Sign Up Page" }),
    /* @__PURE__ */ jsxs(Form, { method: "post", children: [
      /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsxs("label", { children: [
        "Email",
        /* @__PURE__ */ jsx("input", { type: "email", name: "email", required: true })
      ] }) }),
      /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsxs("label", { children: [
        "Password",
        /* @__PURE__ */ jsx("input", { type: "password", name: "password", required: true })
      ] }) }),
      (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("p", { style: { color: "red" }, children: actionData.error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          name: "_action",
          value: "email",
          children: "Sign Up"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Form, { method: "post", children: /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        name: "_action",
        value: "google",
        children: /* @__PURE__ */ jsx("s", { children: "Sign Up with Google" })
      }
    ) }),
    /* @__PURE__ */ jsx(Link, { to: "/login", children: "Go to Login" })
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: SignUp,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" }
  ];
};
async function loader$1({ request }) {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  let user = "Not Logged In";
  if (session.has("userId")) {
    console.log("Already Logged In!");
    user = session.get("userId");
  }
  return { user };
}
function Index() {
  const { user } = useLoaderData();
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { style: { fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }, children: [
    /* @__PURE__ */ jsx("h1", { children: "Welcome to Remix" }),
    /* @__PURE__ */ jsx("p", { children: user }),
    /* @__PURE__ */ jsx("a", { href: "/dashboard", children: "a" })
  ] }) });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader: loader$1,
  meta
}, Symbol.toStringTag, { value: "Module" }));
function Admin() {
  return /* @__PURE__ */ jsx("div", { style: { fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }, children: /* @__PURE__ */ jsx("h1", { children: "Admin Stuff" }) });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Admin
}, Symbol.toStringTag, { value: "Module" }));
async function loader({ request }) {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  if (session.has("userId")) {
    console.log("Already Logged In!");
  }
  const data = { error: session.get("error") };
  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
}
async function action({ request }) {
  let formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);
  if (_action === "in") {
    let email = formData.get("email");
    let password = formData.get("password");
    try {
      const { signIn } = await import("./db.server.firebase-Dli1vNHA.js");
      const { user, userId } = await signIn(email, password);
      const idToken = await user.getIdToken();
      const session = await getSession();
      session.set("idToken", idToken);
      session.set("userId", userId);
      return redirect$1("/", {
        headers: {
          "Set-Cookie": await commitSession(session)
        }
      });
    } catch (error) {
      return json({ error: error.message }, { status: 400 });
    }
  }
  if (_action === "out") {
    console.log("Logging Out");
    const session = await getSession(
      request.headers.get("Cookie")
    );
    return redirect$1("/", {
      headers: {
        "Set-Cookie": await destroySession(session)
      }
    });
  }
}
function Login() {
  const actionData = useActionData();
  return /* @__PURE__ */ jsxs("div", { className: "login", children: [
    /* @__PURE__ */ jsx("h1", { children: "Login Page" }),
    /* @__PURE__ */ jsxs(Form, { method: "post", children: [
      /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsxs("label", { children: [
        "Email",
        /* @__PURE__ */ jsx("input", { type: "email", name: "email" })
      ] }) }),
      /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsxs("label", { children: [
        "Password",
        /* @__PURE__ */ jsx("input", { type: "password", name: "password" })
      ] }) }),
      (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("p", { style: { color: "red" }, children: actionData.error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          name: "_action",
          value: "in",
          children: "Login"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Form, { method: "post", children: /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        name: "_action",
        value: "out",
        children: "Logout"
      }
    ) }),
    /* @__PURE__ */ jsx("a", { href: "/signup", children: "Create Account" })
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: Login,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-B1vc0sUo.js", "imports": ["/assets/jsx-runtime-CZxWQka4.js", "/assets/components-CP-CheBG.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-DJZg-NnY.js", "imports": ["/assets/jsx-runtime-CZxWQka4.js", "/assets/components-CP-CheBG.js"], "css": [] }, "routes/dashboard": { "id": "routes/dashboard", "parentId": "root", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dashboard-DnwdZakk.js", "imports": ["/assets/jsx-runtime-CZxWQka4.js", "/assets/components-CP-CheBG.js"], "css": [] }, "routes/signup": { "id": "routes/signup", "parentId": "root", "path": "signup", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/signup-CUozhmAG.js", "imports": ["/assets/jsx-runtime-CZxWQka4.js", "/assets/components-CP-CheBG.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-XbjVHfSR.js", "imports": ["/assets/jsx-runtime-CZxWQka4.js", "/assets/components-CP-CheBG.js"], "css": [] }, "routes/admin": { "id": "routes/admin", "parentId": "root", "path": "admin", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin-oMKDrj1y.js", "imports": ["/assets/jsx-runtime-CZxWQka4.js"], "css": [] }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/login-CiBrPZ2W.js", "imports": ["/assets/jsx-runtime-CZxWQka4.js", "/assets/components-CP-CheBG.js"], "css": [] } }, "url": "/assets/manifest-2d3a32ff.js", "version": "2d3a32ff" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false, "unstable_singleFetch": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/dashboard": {
    id: "routes/dashboard",
    parentId: "root",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/signup": {
    id: "routes/signup",
    parentId: "root",
    path: "signup",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route3
  },
  "routes/admin": {
    id: "routes/admin",
    parentId: "root",
    path: "admin",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  }
};
export {
  assetsBuildDirectory as a,
  basename as b,
  commitSession as c,
  entry as e,
  future as f,
  getSession as g,
  isSpaMode as i,
  mode as m,
  publicPath as p,
  routes as r,
  serverManifest as s
};
