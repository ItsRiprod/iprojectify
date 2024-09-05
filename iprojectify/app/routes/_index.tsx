import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { getSession } from "../sessions";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }) {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  let user = "";
  if (session.has("userId")) {
    // Redirect to the home page if they are already signed in.
    console.log("Already Logged In!")
    user = session.get("userId") as string;
    
  }


  return user
}

export default function Index() {
  const user = useLoaderData() as string;


  return (
    <div className="">
      <p>{user ? `Logged In As: ${user}` : `Not logged in`}</p>
      <div className="py-16 h-full w-full flex items-center justify-center flex-col">
        <h1 className="text-cyan-500 text-5xl">Welcome to iProjectify!</h1>
        <div className="text-white italic text-lg flex flex-col items-center justify-center">
          <p>The place where things get done</p>
        </div>
      </div>
      <div className="w-full flex gap-5 items-center justify-center flex-col p-5">
        <div className="p-5 rounded-lg w-fit dark:border dark:bg-transparent dark:border-gray-500 bg-gray-300">
          <p className="dark:text-white font-semibold">All your project needs in one location</p>
        </div>
        <div className="p-5 rounded-lg w-fit dark:border dark:bg-transparent dark:border-gray-500 bg-gray-300">
          <p className="dark:text-white font-semibold">Entirely controlled by YOU</p>
        </div>
      </div>
    </div>
  );
}
