/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_PROJECT_ID: string
  readonly VITE_APPWRITE_ENDPOINT: string

  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_API_KEY: string

  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string

  readonly VITE_AUTH_REDIRECT_SUCCESS: string
  readonly VITE_AUTH_REDIRECT_ERROR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
