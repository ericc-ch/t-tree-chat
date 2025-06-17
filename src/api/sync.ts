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

export const useSync = () => {
  const userQuery = useQuery(getUser)
  const setSyncing = useUIStore((store) => store.setSyncing)
  const exportJSON = useFlowStore((state) => state.exportJSON)
  const importJSON = useFlowStore((state) => state.importJSON)

  const mutationFn = async () => {
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

        return await pb.collection("flows").create(formData)
      }

      const flowJSON = exportJSON()

      const remoteFlow = await pb
        .collection("flows")
        .getFirstListItem(`user = "${user.id}"`)
        .catch((error: unknown) => {
          if (error instanceof ClientResponseError && error.status === 404) {
            return createFlow(flowJSON)
          }

          throw error
        })

      const fileUrl = pb.files.getURL(remoteFlow, remoteFlow.flow as string)
      const response = await ofetch(fileUrl, { responseType: "blob" })

      const json = await decompress(new File([response], "flow.gz"))
      const merged = importJSON(json)

      const updateFlow = async () => {
        const compressed = await compress(merged, "flow.gz")
        const formData = objToFormData({
          user: user.id,
          flow: compressed,
        })

        return await pb.collection("flows").update(remoteFlow.id, formData)
      }

      return await updateFlow()
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

      return await pb.collection("flows").create(formData)
    }

    const flowJSON = exportJSON()

    const remoteFlow = await pb
      .collection("flows")
      .getFirstListItem(`user = "${user.id}"`)
      .catch((error: unknown) => {
        if (error instanceof ClientResponseError && error.status === 404) {
          return createFlow(flowJSON)
        }

        throw error
      })

    const fileUrl = pb.files.getURL(remoteFlow, remoteFlow.flow as string)
    const response = await ofetch(fileUrl, { responseType: "blob" })

    const json = await decompress(new File([response], "flow.gz"))
    const merged = importJSON(json)

    const updateFlow = async () => {
      const compressed = await compress(merged, "flow.gz")
      const formData = objToFormData({
        user: user.id,
        flow: compressed,
      })

      return await pb.collection("flows").update(remoteFlow.id, formData)
    }

    return await updateFlow()
  } finally {
    setSyncing(false)
  }
}
