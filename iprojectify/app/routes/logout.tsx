import { redirect  } from "@remix-run/node";
import { getSession, destroySession } from "../sessions";

export async function loader({ request }: { request: Request }) {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (session.has("userId")) {
    console.log("Logging Out")
    const session = await getSession(
      request.headers.get("Cookie")
    );
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  return redirect("/login");
  //return null;
}


export default function Logout() {
 
  return (
    <div className="container rounded-lg m-auto my-12 max-w-sm p-5 bg-slate-100 dark:bg-slate-800">
     <p>Logging Out...</p>
    </div>
  );
}