import { createAuthClient } from "better-auth/svelte"
import { PUBLIC_BASE_URL } from "$env/static/public"

export const authClient = createAuthClient({
    baseURL: PUBLIC_BASE_URL
})
