// /app/actions/loginAction.ts
"use server";

import { auth } from "../auth";


//  Just and example of a what is an action.
// how to use ths file?
/*
const handleLogin = async () => {
    try {
      const user = await loginAction();
      console.log("User logged in:", user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

*/

export const loginAction = async () => {
  const session = await auth();
  if (session) {
    return { user: session.user };
  } else {
    throw new Error("Authentication failed");
  }
};