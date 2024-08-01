"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  //for other functions that will run before logout
  await signOut();
};
