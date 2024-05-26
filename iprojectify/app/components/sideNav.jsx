import {
    NavLink,
    useLoaderData
} from "@remix-run/react";

export default function Main() {
    const { projects } = useLoaderData();

    return(
      <div className="hidden lg:block bg-slate-100 dark:bg-slate-900 fixed inset-0 top-[3.8125rem] left-[0px] right-auto w-[19rem] pb-10 pl-8 pr-6 overflow-y-auto">

        <nav aria-label="Side navigation" className="">
          <ul>
            <li>
              <NavLink to="/portal" end
              className={({ isActive, isPending }) =>
                `${isPending ? "bg-red-50" : ""}
                ${isActive ? "bg-amber-500 hover:bg-amber-400 dark:hover:bg-amber-400 text-slate-600" : ""}
                p-2 pe-2 w-full lg:rounded-e-2xl border-l-2 border-l-slate-700 hover:border-l-amber-400 relative flex items-center justify-between ps-5 font-bold hover:bg-slate-200 dark:hover:bg-slate-800`
              }
            >Dashboard</NavLink>
            </li>
            {projects != null ? Object.entries(projects).map(([key, value]) => (
              <li key={key}>
                <NavLink to={key}
                className={({ isActive, isPending }) =>
                  `${isPending ? "bg-red-50" : ""}
                  ${isActive ? "bg-amber-500 hover:bg-amber-400 dark:hover:bg-amber-400 text-slate-600" : ""}
                  p-2 pe-2 w-full lg:rounded-e-2xl border-l-2 border-l-slate-700 hover:border-l-amber-400 relative flex items-center justify-between ps-5 font-bold hover:bg-slate-200 dark:hover:bg-slate-800`
                }
              >{value.name != null ? value.name : key}</NavLink>
              </li>
            )) : null}
          </ul>
        </nav>
      </div>
    )
}