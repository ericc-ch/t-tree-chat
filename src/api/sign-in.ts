import { useMutation, useQueryClient } from "@tanstack/react-query"

import { pb } from "../lib/pocketbase"
import { getUser } from "./get-user"
import { useSync } from "./sync"

export const useSignIn = () => {
  const queryClient = useQueryClient()
  const sync = useSync()

  return useMutation({
    mutationFn: async (provider: string) => {
      return await pb.collection("users").authWithOAuth2({ provider })
    },
    onSuccess: (data) => {
      queryClient.setQueryData(getUser.queryKey, data.record)
      sync.mutate()
    },
  })
}
