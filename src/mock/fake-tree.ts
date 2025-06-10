import type { UserPrompt } from "../components/nodes/user-prompt"

export const fakeChatTree: UserPrompt = {
  id: "prompt-root-01",
  message:
    "What are the most effective strategies for learning a new programming language in 2025?",
  role: "user",
  config: {
    model: "gemini-1.5-pro",
    system:
      "You are a helpful assistant providing advice for software developers.",
  },
  branches: [
    // --- Branch 1 ---
    {
      id: "prompt-branch-1a",
      message:
        "Can you focus specifically on project-based learning? Give me some project ideas for a beginner learning Python.",
      role: "user",
      config: {
        model: "gemini-1.5-pro",
        system:
          "You are a helpful assistant providing advice for software developers. The user is asking for beginner Python project ideas.",
      },
      branches: [
        // --- Sub-branch 1 from Branch 1 ---
        {
          id: "prompt-sub-branch-1aa",
          message:
            'Okay, for the "Personal Finance Tracker", what libraries would I need?',
          role: "user",
          config: {
            model: "gemini-1.5-flash", // User might switch models
            system:
              "You are a helpful assistant providing advice for software developers. The user is asking about Python libraries for a finance app.",
          },
          branches: [], // End of this branch
        },
      ],
    },
    // --- Branch 2 ---
    {
      id: "prompt-branch-1b",
      message:
        'Tell me more about the "immersive learning" strategy. What tools or platforms do you recommend?',
      role: "user",
      config: {
        model: "gemini-1.5-pro",
        system:
          "You are a helpful assistant providing advice for software developers. The user is asking about immersive learning tools.",
      },
      branches: [], // End of this branch
    },
  ],
}
