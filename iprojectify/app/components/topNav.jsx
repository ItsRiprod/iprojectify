import {
    NavLink, useLoaderData
} from "@remix-run/react";
import { getSession, } from "../sessions.ts";
import NightModeIcon from "./NightModeIcon";
import { useState } from "react";

export const loader = async ({ request }) => {
  let loggedIn = false;
  const session = await getSession(
    request.headers.get("Cookie")
  );
  if (session.has("userId")) {
    loggedIn = true;
  }
  console.log(loggedIn);
  return { loggedIn };
};



  
export default function Main() {
  const { loggedIn } = useLoaderData();
    return(
      <div className="sticky top-0 z-40 h-[3.8125rem] w-full content-center backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-slate-100 supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75">
        <div className="max-w-8xl mx-auto">
          <div className="relative flex px-5 w-full">
              <NavLink to="/"
                className={({ isActive, isPending }) =>
                  `${isPending ? "text-slate-700 dark:text-slate-200" : ""}
                ${isActive ? "text-amber-500 dark:text-amber-150" : ""}
                  mr-3 flex-none w-[2.0625rem] overflow-hidden md:w-auto`
                }
                >
                <span className="sr-only">iProjectify home page</span>
                <p className="first-letter:text-slate-400 hover:text-amber-500 font-serif">iProjectify</p>
              
              </NavLink>
              <nav className="text-sm font-semibold text-slate-700 dark:text-slate-200 ml-auto">
                <ul className="flex space-x-8 place-content-around ">
                  <li>
                      <NavLink to="/portal"
                        className={({ isActive, isPending }) =>
                          `${isPending ? "text-slate-700 dark:text-slate-200" : ""}
                        ${isActive ? "text-amber-500 dark:text-amber-150" : ""}
                        hover:text-amber-600 dark:hover:text-amber-300`
                      }
                      >Portal</NavLink>
                  </li>
                  <li>
                      <NavLink to="/admin"
                        className={({ isActive, isPending }) =>
                          `${isPending ? "text-slate-700 dark:text-slate-200" : ""}
                          ${isActive ? "text-amber-500 dark:text-amber-150" : ""}
                          hover:text-amber-600 dark:hover:text-amber-300`
                        }
                        >Admin</NavLink>
                  </li>
                  <li>
                      <NavLink to={`/${loggedIn ? "logout" : "login"}`}
                        className={({ isActive, isPending }) =>
                          `${isPending ? "text-slate-700 dark:text-slate-200" : ""}
                          ${isActive ? "text-amber-500 dark:text-amber-150" : ""}
                          hover:text-amber-600 dark:hover:text-amber-300`
                        }
                    >{loggedIn ? "Logout" : "Login"}</NavLink>
                  </li>
                  <li>
                      <NightModeIcon />
                      
                  </li>
                  </ul>
              </nav>
          </div>
        </div>
      </div>
    )
}