import { Form } from "@remix-run/react"

import { createUserSession } from "~/session.server"
import { verifyLogin } from "~/models/user.server";

export async function action({ request }: ActionArgs) {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    const user = await verifyLogin(email, password);

    return createUserSession( {request, userId: user.id,});
}

export default function LoginPage() {
    return (
        <Form method="post">
            <label htmlFor="email">Email Address</label>
            <input
                id="email"
                required
                name="email"
                type="email"
                autoComplete="email"
            />
            
            <label htmlFor="password">Password</label>
            <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
            />

            <button type="submit">Log in</button>
            
        </Form>
    )
}