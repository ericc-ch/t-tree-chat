import { queryOptions } from "@tanstack/react-query"

import { auth } from "../lib/firebase"

export const getUser = queryOptions({
  queryKey: ["user"],
  queryFn: () => {
    const user = auth.currentUser
    if (!user) throw new AuthError("Not logged in", { type: "not_logged_in" })

    return user
  },
})

export class AuthError extends Error {
  type: string

  constructor(message: string, { type }: { type: string }) {
    super(message)
    this.name = "AuthError"
    this.type = type
  }
}
