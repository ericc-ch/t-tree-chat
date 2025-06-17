import { queryOptions } from "@tanstack/react-query"

import { pb } from "../lib/pocketbase"

export const getUser = queryOptions({
  queryKey: ["user"],
  queryFn: () => {
    const user = pb.authStore.record
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
