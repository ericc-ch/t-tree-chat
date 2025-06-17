import { Account, Client, Storage } from "appwrite"

export const appwrite = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

export const account = new Account(appwrite)
export const storage = new Storage(appwrite)
