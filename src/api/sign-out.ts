import { pb } from "~/src/lib/pocketbase"
import { queryClient } from "~/src/lib/query"

import { getUser } from "./get-user"

export const signOut = async () => {
  pb.authStore.clear()
  await queryClient.resetQueries(getUser)
}
