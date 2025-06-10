import config from "@echristian/eslint-config"

export default config({
  jsx: {
    enabled: true,
    a11y: true
  },
  react: {
    enabled: true,
  },
  reactHooks: {
    enabled: true
  },
  prettier: {
    plugins: ["prettier-plugin-packagejson"],
  },
})
