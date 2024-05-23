import {
    NavLink,
    Form
} from "@remix-run/react";

export default function main() {

    return(
      <div className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-slate-100 supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75">

        <nav className="text-sm leading-6 font-semibold text-slate-700 dark:text-slate-200">
          <ul className="flex space-x-8 place-content-around">
            <li>
              <NavLink to="/"className={({ isActive, isPending }) =>
                          isPending ? "text-slate-700 dark:text-slate-200" : isActive ? "text-amber-500 dark:text-amber-150" : ""
              }
                >Home</NavLink>
            </li>
            <li>
                <NavLink to="/dashboard"className={({ isActive, isPending }) =>
                          isPending ? "text-slate-700 dark:text-slate-200" : isActive ? "text-amber-500 dark:text-amber-150" : ""
              }
              >Dashboard</NavLink>
            </li>
            <li>
                <NavLink to="/admin"className={({ isActive, isPending }) =>
                          isPending ? "text-slate-700 dark:text-slate-200" : isActive ? "text-amber-500 dark:text-amber-150" : ""
              }
              >Admin</NavLink>
            </li>
            <li>
                <NavLink to="/login" className={({ isActive, isPending }) =>
                          isPending ? "text-slate-700 dark:text-slate-200" : isActive ? "text-amber-500 dark:text-amber-150" : ""
              }
              >Login</NavLink>
            </li>
            </ul>
        </nav>
      </div>
    )
}