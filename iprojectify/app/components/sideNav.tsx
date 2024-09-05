import {
  NavLink,
  useLoaderData
} from "@remix-run/react";
import { useState } from "react";
import { IconMenu } from "../assets/Icons";

export default function Main() {
  const { projects } = useLoaderData<{ projects: Record<string, { name: string | null }> }>();
  const [expand, setExpand] = useState(false);

  return (
    <div className={`${expand ? 'fixed lg:w-[19rem] lg:overflow-y-auto pb-10 pl-8 pr-6 w-full lg:relative flex flex-col mt-[3.8125rem] lg:mt-0' : 'w-fit h-fit top-[3.8125rem] left-[0px]'} overflow-hidden hover:group-target:data-[active]:bg-red-100  bg-slate-100 dark:bg-slate-900 inset-0 right-auto`}>
      <button
        className="p-0 m-0"
        onClick={() => setExpand((prev) => !prev)}><IconMenu iconSize={48} /></button>
      {expand && (


        <nav aria-label="Side navigation" className="">
          <ul>
            <li>
              <NavLink to="/portal" end
                className={({ isActive, isPending }) =>
                  `${isPending ? "bg-red-50" : ""}
                ${isActive ? "bg-cyan-500 hover:bg-cyan-400 dark:hover:bg-cyan-400 text-slate-600" : " hover:bg-slate-200 dark:hover:bg-slate-800 lg:block"}
                  p-2 pe-2 w-full lg:rounded-e-2xl border-l-2 border-l-slate-700 hover:border-l-cyan-400 relative flex items-center justify-between ps-5 font-bold`
                }
              >Dashboard</NavLink>
            </li>
            {projects != null ? Object.entries(projects).map(([key, value]) => (
              <li key={key}>
                <NavLink to={key}
                  className={({ isActive, isPending }) =>
                    `${isPending ? "bg-red-50" : ""}
                ${isActive ? "bg-cyan-500 hover:bg-cyan-400 dark:hover:bg-cyan-400 text-slate-600" : "hover:bg-slate-200 dark:hover:bg-slate-800 lg:block"}
                    p-2 pe-2 w-full lg:rounded-e-2xl border-l-2 border-l-slate-700 hover:border-l-cyan-400 relative flex items-center justify-between ps-5 font-bold`
                  }
                >{value.name != null ? value.name : key}</NavLink>
              </li>
            )) : null}
          </ul>
        </nav>
      )}
    </div>


  )
}