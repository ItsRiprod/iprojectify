import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { getSession } from "../sessions";
import { getDBUser } from "../utils/db.firebase.server";
import { User } from "../types/users";

export const meta: MetaFunction = () => {
  return [
    { title: "iProjectify App" },
    { name: "description", content: "The project management software that caters to you!" },
  ];
};

export async function loader({ request }: { request: Request }) {
  try {

    const session = await getSession(
      request.headers.get("Cookie")
    );
    let user = null;
    if (session.has("userId")) {
      // Redirect to the home page if they are already signed in.
      console.log("Already Logged In!")
      const userId = session.get("userId") as string;
      user = await getDBUser(userId);
      return { user }
    } else {
      console.log("Not Logged In or Session Expired!")
      return { user: null };
    }
  } catch (error) {
    console.error(error);
    return { user: null };
  }


}
export default function Index() {
  const { user } = useLoaderData<{ user: User | null}>();


  return (
    <div className="">
      <p>{user ? `Logged In As: ${user.displayName || user.email || user.uid}` : `Not logged in`}</p>
      <div className="py-16 h-full w-full flex items-center justify-center flex-col">
        <h1 className="text-cyan-500 text-5xl">Welcome to iProjectify!</h1>
        <div className="dark:text-white italic text-lg flex flex-col items-center justify-center">
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
