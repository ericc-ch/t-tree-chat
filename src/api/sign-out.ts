import { useMutation, useQueryClient } from "@tanstack/react-query"

import { account } from "../lib/appwrite"
import { getUser } from "./get-user"

export const useSignOut = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await account.deleteSession("current")
    },
    onSuccess: () => {
      void queryClient.resetQueries(getUser)
    },
  })
}
