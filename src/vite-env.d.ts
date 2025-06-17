/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POCKETBASE_BASE_URL: string

  readonly VITE_OAUTH_REDIRECT_SUCCESS: string
  readonly VITE_OAUTH_REDIRECT_ERROR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
