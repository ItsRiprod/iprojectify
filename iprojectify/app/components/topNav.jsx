import {
    NavLink
} from "@remix-run/react";

export default function main() {

    return(
      <div className="sticky top-0 z-40 h-[3.8125rem] w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-slate-100 supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75">

        <nav className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          <ul className="flex h-[3.8125rem] space-x-8 place-content-around ">
            <li>
              <NavLink to="/"
                  className={({ isActive, isPending }) =>
                    `${isPending ? "text-slate-700 dark:text-slate-200" : ""}
                    ${isActive ? "text-amber-500 dark:text-amber-150" : ""}
                    bg-red-500 h-`
                  }
                >Home</NavLink>
            </li>
            <li>
                <NavLink to="/portal"
                  className={({ isActive, isPending }) =>
                    `${isPending ? "text-slate-700 dark:text-slate-200" : ""}
                    ${isActive ? "text-amber-500 dark:text-amber-150" : ""}
                    otherNames`
                  }
              >Portal</NavLink>
            </li>
            <li>
                <NavLink to="/admin"
                  className={({ isActive, isPending }) =>
                    `${isPending ? "text-slate-700 dark:text-slate-200" : ""}
                    ${isActive ? "text-amber-500 dark:text-amber-150" : ""}
                    otherNames`
                  }
              >Admin</NavLink>
            </li>
            <li>
                <NavLink to="/login"
                  className={({ isActive, isPending }) =>
                    `${isPending ? "text-slate-700 dark:text-slate-200" : ""}
                    ${isActive ? "text-amber-500 dark:text-amber-150" : ""}
                    otherNames`
                  }
              >Login</NavLink>
            </li>
            </ul>
        </nav>
      </div>
    )
}