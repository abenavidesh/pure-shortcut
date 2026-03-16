export { default as Shortcut } from "./react/Shortcut";
export {
  addShortcuts,
  removeShortcuts,
  enableScope,
  disableScope,
} from "./core/Shortcut";
export type { ShortcutProps } from "./react/Shortcut";
export type { OnShortPressedItem, ShortcutScopeId } from "./core/Shortcut";