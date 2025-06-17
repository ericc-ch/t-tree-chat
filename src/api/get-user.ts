import { queryOptions } from "@tanstack/react-query"

import { account } from "../lib/appwrite"

export const getUser = queryOptions({
  queryKey: ["user"],
  queryFn: async () => {
    return await account.get()
  },
})
