/**
 * Shortcut (HOTKEYS) - Pure JavaScript Utility
 *
 * Allows you to define custom keyboard shortcuts (hotkeys) to execute functions
 * when specific key combinations are pressed.
 *
 * ## Usage in JavaScript (ES6+):
 *
 * ```js
 * import { addShortcuts, removeShortcuts } from "./Shortcut";
 *
 * const handler = (e) => { e.preventDefault(); alert("Saved!"); };
 * addShortcuts([
 *   { key: "s", ctrlKey: true, onPress: handler }
 * ]);
 *
 * // To remove all shortcuts later:
 * removeShortcuts();
 * ```
 *
 * ## Direct HTML Usage:
 * ```html
 * <script src="Shortcut.js"></script>
 * <script>
 *   addShortcuts([
 *     { key: "n", ctrlKey: true, altKey: true, onPress: function(e) { alert('Ctrl+Alt+N!'); } }
 *   ]);
 * </script>
 * ```
 *
 * ## Type Definition
 * @typedef {Object} ShortPressedItem
 * @property {string} key - The key to detect (e.g., "s" or "Enter").
 * @property {boolean} [ctrlKey] - Requires Control key. Default: false.
 * @property {boolean} [shiftKey] - Requires Shift key. Default: false.
 * @property {boolean} [altKey] - Requires Alt key. Default: false.
 * @property {boolean} [metaKey] - Requires Meta/Super key (⌘, Windows). Default: false.
 * @property {(e: KeyboardEvent) => void} onPress - Function to execute when shortcut is triggered.
 */

// --- TypeScript Types ---
// See README for full typings and examples.

type ShortPressedItem = {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  onPress: (e: KeyboardEvent) => void;
};

let _shortcutList: ShortPressedItem[] = [];
let _handlerRegistered = false;

/**
 * Determines if the event originated from an input, textarea, or contentEditable element.
 * @param {EventTarget | null} target
 * @returns {boolean}
 */
function isFromTextInput(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    (target as HTMLElement).isContentEditable === true
  );
}

/**
 * Global keydown event handler for registered shortcuts.
 * @param {KeyboardEvent} event
 */
function _shortcutKeyDownHandler(event: KeyboardEvent) {
  if (isFromTextInput(event.target)) return;
  _shortcutList.forEach(function (shortcut) {
    const {
      key,
      ctrlKey = false,
      shiftKey = false,
      altKey = false,
      metaKey = false,
      onPress,
    } = shortcut;

    // Case-insensitive comparison for single-character keys
    const keyMatch =
      key.length === 1
        ? event.key && event.key.toLowerCase() === key.toLowerCase()
        : event.key === key;

    if (
      keyMatch &&
      !!event.ctrlKey === !!ctrlKey &&
      !!event.shiftKey === !!shiftKey &&
      !!event.altKey === !!altKey &&
      !!event.metaKey === !!metaKey
    ) {
      if (typeof onPress === "function") onPress(event);
    }
  });
}

/**
 * Register global keyboard shortcuts.
 * @param {ShortPressedItem[]} shortcuts
 */
export function addShortcuts(shortcuts: ShortPressedItem[]) {
  if (!Array.isArray(shortcuts)) return;
  _shortcutList = shortcuts;
  if (!_handlerRegistered) {
    window.addEventListener("keydown", _shortcutKeyDownHandler);
    _handlerRegistered = true;
  }
}

/**
 * Remove all currently active keyboard shortcuts.
 */
export function removeShortcuts() {
  window.removeEventListener("keydown", _shortcutKeyDownHandler);
  _shortcutList = [];
  _handlerRegistered = false;
}

// Augment the Window interface to support direct usage via window.addShortcuts/removeShortcuts
declare global {
  interface Window {
    addShortcuts?: typeof addShortcuts;
    removeShortcuts?: typeof removeShortcuts;
  }
}

if (typeof window !== "undefined") {
  window.addShortcuts = addShortcuts;
  window.removeShortcuts = removeShortcuts;
}