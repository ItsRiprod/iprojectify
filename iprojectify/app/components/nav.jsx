import {
    Links,
    Link,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    isRouteErrorResponse,
    useRouteError,
  } from "@remix-run/react";

export default function main() {
    
    return(
        <div className="container remix-app__header-content">
          <Link to="/" title="Remix" className="remix-app__header-home-link">

          </Link>
          <nav aria-label="Main navigation" className="remix-app__header-nav">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/admin">Admin</Link>
              </li>
              <li>
                <Link to="/login">
                  login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
    )
}