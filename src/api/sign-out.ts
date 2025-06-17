import { useMutation, useQueryClient } from "@tanstack/react-query"
import { signOut } from "firebase/auth"

import { auth } from "../lib/firebase"
import { getUser } from "./get-user"

export const useSignOut = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await signOut(auth)
    },
    onSuccess: () => {
      void queryClient.resetQueries(getUser)
    },
  })
}
