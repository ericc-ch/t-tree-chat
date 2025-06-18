import { useMutation, useQuery } from "@tanstack/react-query"
import { ofetch } from "ofetch"
import { ClientResponseError } from "pocketbase"
import invariant from "tiny-invariant"

import { compress, decompress } from "~/src/lib/compression"
import { pb } from "~/src/lib/pocketbase"
import { objToFormData } from "~/src/lib/utils"

import { queryClient } from "../lib/query"
import { useFlowStore } from "../stores/flow"
import { useUIStore } from "../stores/ui"
import { getUser } from "./get-user"

interface SyncOptions {
  pull?: boolean
}

export const useSync = () => {
  const userQuery = useQuery(getUser)
  const setSyncing = useUIStore((store) => store.setSyncing)
  const exportJSON = useFlowStore((state) => state.exportJSON)
  const importJSON = useFlowStore((state) => state.importJSON)

  const mutationFn = async (options?: SyncOptions) => {
    setSyncing(true)

    try {
      const user = userQuery.data
      invariant(user, "Cannot sync when not logged in")

      const createFlow = async (json: string) => {
        const compressed = await compress(json, "flow.gz")
        const formData = objToFormData({
          user: user.id,
          flow: compressed,
        })

        return pb.collection("flows").create(formData)
      }

      const updateFlow = async (id: string, json: string) => {
        const compressed = await compress(json, "flow.gz")
        const formData = objToFormData({
          user: user.id,
          flow: compressed,
        })

        return pb.collection("flows").update(id, formData)
      }

      let remoteFlow
      try {
        remoteFlow = await pb
          .collection("flows")
          .getFirstListItem(`user = "${user.id}"`)
      } catch (error) {
        if (error instanceof ClientResponseError && error.status === 404) {
          // Not found, create it
          const flowJSON = exportJSON()
          return await createFlow(flowJSON)
        }
        throw error // Other errors
      }

      // If we are here, remoteFlow exists.
      if (options?.pull) {
        const fileUrl = pb.files.getURL(remoteFlow, remoteFlow.flow as string)
        const response = await ofetch(fileUrl, { responseType: "blob" })
        const json = await decompress(new File([response], "flow.gz"))
        const merged = importJSON(json)
        return await updateFlow(remoteFlow.id, merged)
      } else {
        // Just upload
        const flowJSON = exportJSON()
        return await updateFlow(remoteFlow.id, flowJSON)
      }
    } finally {
      setSyncing(false)
    }
  }

  return useMutation({
    mutationFn,
  })
}

// Non hook version
export const syncConversation = async (options?: SyncOptions) => {
  const { setSyncing } = useUIStore.getState()
  const { exportJSON, importJSON } = useFlowStore.getState()

  try {
    setSyncing(true)

    const user = await queryClient.ensureQueryData(getUser)
    invariant(user, "Cannot sync when not logged in.")

    const createFlow = async (json: string) => {
      const compressed = await compress(json, "flow.gz")
      const formData = objToFormData({
        user: user.id,
        flow: compressed,
      })

      return pb.collection("flows").create(formData)
    }

    const updateFlow = async (id: string, json: string) => {
      const compressed = await compress(json, "flow.gz")
      const formData = objToFormData({
        user: user.id,
        flow: compressed,
      })

      return pb.collection("flows").update(id, formData)
    }

    let remoteFlow
    try {
      remoteFlow = await pb
        .collection("flows")
        .getFirstListItem(`user = "${user.id}"`)
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        // Not found, create it
        const flowJSON = exportJSON()
        return await createFlow(flowJSON)
      }
      throw error // Other errors
    }

    // If we are here, remoteFlow exists.
    if (options?.pull) {
      const fileUrl = pb.files.getURL(remoteFlow, remoteFlow.flow as string)
      const response = await ofetch(fileUrl, { responseType: "blob" })
      const json = await decompress(new File([response], "flow.gz"))
      const merged = importJSON(json)
      return await updateFlow(remoteFlow.id, merged)
    } else {
      // Just upload
      const flowJSON = exportJSON()
      return await updateFlow(remoteFlow.id, flowJSON)
    }
  } finally {
    setSyncing(false)
  }
}
