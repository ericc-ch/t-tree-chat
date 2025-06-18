# T🌳 Chat: Your AI Conversation Tree

T-Tree chat, because conversation is basically a tree graph.

## Getting Started

1.  Install dependencies:
    ```bash
    bun install
    ```
2.  Run the development server:
    ```bash
    bun run dev
    ```

## Self-Hosting

This application is designed for self-hosting on [Fly.io](https://fly.io), which manages both the application and the PocketBase backend.

To deploy your own instance:

1.  **Install `flyctl` and log in:** Follow the instructions on the [Fly.io website](https://fly.io/docs/hands-on/install-flyctl/) and run `fly auth login`.
2.  **Clone the repository.**
3.  **Choose an app name** for your deployment (e.g., `my-cool-chat`).
4.  **Update `fly.toml`:**
    - Set `app` to your chosen app name.
    - Update `VITE_POCKETBASE_BASE_URL` to `https://<your-app-name>.fly.dev`.
    - Change `source` under `[[mounts]]` to a new name for your data volume (e.g., `my_cool_chat_data`).
5.  **Create the Fly.io app:**
    ```bash
    fly apps create <your-app-name>
    ```
6.  **Create a volume for PocketBase data:**
    ```bash
    fly volumes create <volume_name_from_mounts>
    ```
    Make sure the volume name matches the `source` in `fly.toml`.
7.  **Deploy the application:**
    ```bash
    fly deploy
    ```

---

## Acknowledgments

Thank you to Theo, Mark, Julius, and the entire T3.chat team for organizing this insightful Cloneathon.
