/**
 * Shortcut Core
 *
 * A framework-agnostic JavaScript core to enable definition and management of custom keyboard shortcuts (hotkeys)
 * that execute user-provided functions when specific key combinations are pressed.
 *
 * ## Types
 * @typedef {Object} OnShortPressedItem
 * @property {string} key - The key that triggers the shortcut (e.g., "s", "Enter").
 * @property {boolean} [ctrlKey] - Requires the Control key. Default: false.
 * @property {boolean} [shiftKey] - Requires the Shift key. Default: false.
 * @property {boolean} [altKey] - Requires the Alt key. Default: false.
 * @property {boolean} [metaKey] - Requires the Meta key (⌘ on Mac, Windows key on PC). Default: false.
 * @property {boolean} [allowInputs] - Allow the command to execute even if focus is in input fields.
 * @property {(e: KeyboardEvent) => void} onPress - Function executed when the shortcut is triggered.
 *
 * ## Usage Example:
 * ```js
 * import { addShortcuts, removeShortcuts } from "pure-shortcut/core/Shortcut";
 * const handler = (e) => { e.preventDefault(); alert("Saved!"); };
 * const shortcuts = [
 *   { key: "s", ctrlKey: true, onPress: handler }
 * ];
 * const remove = addShortcuts(shortcuts);
 * // Later:
 * remove(); // Removes those shortcuts.
 * ```
 */

export type OnShortPressedItem = {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  allowInputs?: boolean;
  onPress: (e: KeyboardEvent) => void;
};

export type ShortcutScopeId = string;

type ShortcutRegistry = {
  shortcuts: OnShortPressedItem[];
  scopeId?: ShortcutScopeId;
  enabled: boolean;
};

/**
 * A registry that tracks all currently registered shortcuts.
 * Each registry entry: { shortcuts: OnShortPressedItem[] }
 */
const _shortcutRegistries: ShortcutRegistry[] = [];

/**
 * Helper to determine if the event originated from an input, textarea,
 * or contentEditable element (should ignore these for keyboard shortcuts).
 * @param {EventTarget | null} target
 * @returns {boolean}
 */
function _isFromTextInput(target: EventTarget | null): boolean {
  if (!target || typeof target !== "object" || !("tagName" in target)) return false;
  // @ts-ignore
  const tag = target.tagName.toLowerCase ? target.tagName.toLowerCase() : "";
  // @ts-ignore
  const isEditable =
    tag === "input" ||
    tag === "textarea" ||
    // @ts-ignore - safe on HTMLElement
    (typeof target.isContentEditable === "boolean" && target.isContentEditable);
  return isEditable;
}

/**
 * Core global keydown event handler. Iterates through all registered shortcut lists.
 * For each shortcut matched, checks allowInputs: if false/undefined and the target is an input-type, do not run.
 * @param {KeyboardEvent} event
 */
function _handleKeyDown(event: KeyboardEvent) {
  for (const registry of _shortcutRegistries) {
    if (!registry.enabled) continue;
    const shortcuts = registry.shortcuts;
    for (const shortcut of shortcuts) {
      const {
        key,
        ctrlKey = false,
        shiftKey = false,
        altKey = false,
        metaKey = false,
        allowInputs = false,
      } = shortcut;
      const keyMatch =
        key.length === 1
          ? event.key && event.key.toLowerCase() === key.toLowerCase()
          : event.key === key;
      // If not allowed on input fields, and the event target IS an input/textarea/contentEditable, skip
      if (
        keyMatch &&
        event.ctrlKey === ctrlKey &&
        event.shiftKey === shiftKey &&
        event.altKey === altKey &&
        event.metaKey === metaKey
      ) {
        if (!allowInputs && _isFromTextInput(event.target)) {
          continue;
        }
        shortcut.onPress(event);
      }
    }
  }
}

/**
 * Registers one or more shortcuts (global by default).
 * Returns a function which, when called, unregisters those shortcuts.
 *
 * @param {OnShortPressedItem[]} shortcuts
 * @returns {() => void} Unregister function
 */
export function addShortcuts(
  shortcuts: OnShortPressedItem[],
  options?: { scopeId?: ShortcutScopeId },
): () => void {
  if (!Array.isArray(shortcuts)) {
    throw new Error("addShortcuts: shortcuts must be an array");
  }

  const registry: ShortcutRegistry = {
    shortcuts,
    scopeId: options?.scopeId,
    enabled: true,
  };
  _shortcutRegistries.push(registry);

  // If this is the first shortcut being registered, start listening.
  if (_shortcutRegistries.length === 1) {
    window.addEventListener("keydown", _handleKeyDown);
  }

  // Return disposer
  return function remove() {
    const index = _shortcutRegistries.indexOf(registry);
    if (index !== -1) {
      _shortcutRegistries.splice(index, 1);
    }
    if (_shortcutRegistries.length === 0) {
      window.removeEventListener("keydown", _handleKeyDown);
    }
  };
}

/**
 * Removes all registered shortcuts (clears all).
 * Use with caution!
 */
export function removeShortcuts(): void {
  _shortcutRegistries.length = 0;
  window.removeEventListener("keydown", _handleKeyDown);
}

/**
 * Enables all shortcuts associated with a given scopeId.
 */
export function enableScope(scopeId: ShortcutScopeId): void {
  _shortcutRegistries.forEach((registry) => {
    if (registry.scopeId === scopeId) {
      registry.enabled = true;
    }
  });
}

/**
 * Disables all shortcuts associated with a given scopeId.
 * Shortcuts remain registered but will not fire while disabled.
 */
export function disableScope(scopeId: ShortcutScopeId): void {
  _shortcutRegistries.forEach((registry) => {
    if (registry.scopeId === scopeId) {
      registry.enabled = false;
    }
  });
}
