import config from "@echristian/eslint-config"
import pluginQuery from "@tanstack/eslint-plugin-query"

export default config(
  {
    jsx: {
      enabled: true,
      a11y: true,
    },
    react: {
      enabled: true,
    },
    reactHooks: {
      enabled: true,
    },
    prettier: {
      plugins: ["prettier-plugin-packagejson"],
    },
  },
  {
    rules: {
      "max-lines-per-function": "off",
    },
  },
  {
    extends: [...pluginQuery.configs["flat/recommended"]],
  },
)
