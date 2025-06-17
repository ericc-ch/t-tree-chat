import { useMutation, useQueryClient } from "@tanstack/react-query"
import { signInWithPopup, type AuthProvider } from "firebase/auth"

import { auth } from "../lib/firebase"
import { getUser } from "./get-user"

export const useSignIn = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (provider: AuthProvider) => {
      return await signInWithPopup(auth, provider)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(getUser.queryKey, data.user)
    },
  })
}
