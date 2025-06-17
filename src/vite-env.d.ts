/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_PROJECT_ID: string
  readonly VITE_APPWRITE_ENDPOINT: string

  readonly VITE_AUTH_REDIRECT_SUCCESS: string
  readonly VITE_AUTH_REDIRECT_ERROR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
