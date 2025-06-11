import invariant from "tiny-invariant"

import { MENU_TARGET } from "./constants"

export const getMenuTarget = () => {
  const menuTarget = document.querySelector<HTMLDivElement>("." + MENU_TARGET)
  invariant(menuTarget, "Menu target not found")

  return menuTarget
}
