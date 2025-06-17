import { useMutation, useQuery } from "@tanstack/react-query"
import { AppwriteException } from "appwrite"
import invariant from "tiny-invariant"

import { storage } from "../lib/appwrite"
import { APPWRITE_BUCKET_ID } from "../lib/constants"
import { queryClient } from "../lib/query"
import { stringToFile } from "../lib/utils"
import { useFlowStore } from "../stores/flow"
import { useUIStore } from "../stores/ui"
import { getUser } from "./get-user"

export const useSync = () => {
  const userQuery = useQuery(getUser)
  const setSyncing = useUIStore((store) => store.setSyncing)
  const exportJSON = useFlowStore((store) => store.exportJSON)

  const mutationFn = async () => {
    setSyncing(true)

    const user = userQuery.data
    invariant(user, "Cannot sync when not logged in")

    const flowJSON = exportJSON()
    const fileId = user.$id
    const file = stringToFile(flowJSON, `${fileId}.json`)

    try {
      const uploadFile = () =>
        storage.createFile(APPWRITE_BUCKET_ID.SYNC, fileId, file)

      // TODO: Implement real syncing solution, I don't want to use appwrite database though
      // We're gonna delete then reupload
      // Ultra high IQ I know
      // I also somehow find .then().catch() easier to read
      await storage
        .deleteFile(APPWRITE_BUCKET_ID.SYNC, fileId)
        .then(uploadFile)
        .catch((error: unknown) => {
          if ((error as AppwriteException).type === "storage_file_not_found")
            return storage.createFile(APPWRITE_BUCKET_ID.SYNC, fileId, file)

          throw error
        })
    } finally {
      setSyncing(false)
    }
  }

  return useMutation({
    mutationFn,
  })
}

// Non hook version
export const syncConversation = async () => {
  const { setSyncing } = useUIStore.getState()
  setSyncing(true)

  const user = await queryClient.ensureQueryData(getUser)
  invariant(user, "Cannot sync when not logged in. User not found in cache.")

  const { exportJSON } = useFlowStore.getState()
  const flowJSON = exportJSON()

  const fileId = user.$id
  const file = stringToFile(flowJSON, `${fileId}.json`)

  try {
    const uploadFile = () =>
      storage.createFile(APPWRITE_BUCKET_ID.SYNC, fileId, file)

    // TODO: Implement real syncing solution, I don't want to use appwrite database though
    // We're gonna delete then reupload
    // Ultra high IQ I know
    // I also somehow find .then().catch() easier to read
    await storage
      .deleteFile(APPWRITE_BUCKET_ID.SYNC, fileId)
      .then(uploadFile)
      .catch((error: unknown) => {
        if ((error as AppwriteException).type === "storage_file_not_found")
          return storage.createFile(APPWRITE_BUCKET_ID.SYNC, fileId, file)

        throw error
      })
  } finally {
    setSyncing(false)
  }
}
