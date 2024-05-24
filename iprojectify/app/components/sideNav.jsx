import {
    NavLink,
    useLoaderData
} from "@remix-run/react";

export default function Main() {
    const { projects } = useLoaderData();

    return(
      <div className="hidden lg:block fixed z-20 inset-0 top-[3.8125rem] left-[0px] right-auto w-[19rem] pb-10 pl-8 pr-6 overflow-y-auto">

        <nav aria-label="Side navigation" className="navElements">
          <ul>
            <li>
              <NavLink to="/portal"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >Dashboard</NavLink>
            </li>
            {projects != null ? Object.entries(projects).map(([key, value]) => (

              <li key={key}>
                <NavLink to={key}
                className={({ isActive, isPending }) =>
                  isPending ? "bg-red-50" : isActive ? "active" : ""
              }
              >{value.name != null ? value.name : key}</NavLink>
              </li>
            )) : null}            
            
            
          </ul>
        </nav>
      </div>
    )
}