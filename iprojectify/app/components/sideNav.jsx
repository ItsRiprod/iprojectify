import {
    Links,
    Link,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    isRouteErrorResponse,
    useRouteError,
    NavLink,
} from "@remix-run/react";

export default function main() {
    
    return(
      <div className="hidden lg:block fixed z-20 inset-0 top-[3.8125rem] left-[0px] right-auto w-[19rem] pb-10 pl-8 pr-6 overflow-y-auto">

        <nav aria-label="Side navigation" className="navElements">
          <ul>
            <li>
              <NavLink to="/"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >Home</NavLink>
            </li>
            <li>
              <NavLink to="/admin"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >Admin</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/login"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >Login</NavLink>
            </li>
          </ul>
   
        </nav>
      </div>
    )
}