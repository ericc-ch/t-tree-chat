import { useMutation, useQuery } from "@tanstack/react-query"

import { pb } from "../lib/pocketbase"
import { objToFormData } from "../lib/utils"
import { getUser } from "./get-user"

const UPLOAD_TIMEOUT = 10_000

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

      const uploadPromise = pb.collection("uploads").create(formData)

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error("Upload timed out"))
        }, UPLOAD_TIMEOUT)
      })

      return Promise.race([uploadPromise, timeoutPromise])
    },
  })
}
