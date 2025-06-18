import { useMutation, useQuery } from "@tanstack/react-query"

import { pb } from "../lib/pocketbase"
import { objToFormData } from "../lib/utils"
import { getUser } from "./get-user"

export const useUpload = () => {
  const userQuery = useQuery(getUser)

  return useMutation({
    mutationFn: async (file: File) => {
      const user = userQuery.data
      if (!user) throw new Error("You need to be logged in to upload files")

      const formData = objToFormData({
        user: user.id,
        upload: file,
      })

      return await pb.collection("uploads").create(formData)
    },
  })
}
