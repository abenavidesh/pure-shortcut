/**
 * Shortcut
 *
 * This React component enables you to define custom keyboard shortcuts (hotkeys)
 * to wrap any part of your UI and execute specific functions when certain key combinations are pressed.
 *
 * ## Props
 * @typedef {Object} OnShortPressedItem
 * @property {string} key - The key that triggers the shortcut (e.g., "s", "Enter").
 * @property {boolean} [ctrlKey] - Requires the Control key. Default: false.
 * @property {boolean} [shiftKey] - Requires the Shift key. Default: false.
 * @property {boolean} [altKey] - Requires the Alt key. Default: false.
 * @property {boolean} [metaKey] - Requires the Meta key (⌘ on Mac, Windows key on PC). Default: false.
 * @property {(e: KeyboardEvent) => void} onPress - Function executed when the shortcut is triggered.
 *
 * @typedef {Object} ShortcutProps
 * @property {ReactNode} children - The content to render within Shortcut.
 * @property {OnShortPressedItem[]} onShortPressed - Array of shortcuts and actions.
 * @property {string} [className] - Optional CSS class for the container.
 *
 * ## Usage Example:
 * ```tsx
 * <Shortcut
 *   onShortPressed={[
 *     { key: "s", ctrlKey: true, onPress: (e) => { e.preventDefault(); alert("Saved"); } }
 *   ]}
 * >
 *   <input placeholder="Press Ctrl+S to save" />
 * </Shortcut>
 * ```
 * When "Ctrl+S" is pressed, the handler defined in onPress will be executed.
 */

import React, { ReactNode, useEffect, useRef } from "react";

export interface OnShortPressedItem {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  onPress: (e: KeyboardEvent) => void;
}

export interface ShortcutProps {
  children: ReactNode;
  onShortPressed: OnShortPressedItem[];
  className?: string;
}

/**
 * Shortcut: Component to handle custom keyboard shortcuts.
 * Improvements: 
 * - Uses ref to always have freshest onShortPressed handler.
 * - Case-insensitive key support.
 * - Ignores events from input, textarea, or contentEditable by default for better UX.
 */
const Shortcut: React.FC<ShortcutProps> = ({
  children,
  onShortPressed,
  className,
}) => {
  const shortcutsRef = useRef(onShortPressed);

  useEffect(() => {
    shortcutsRef.current = onShortPressed;
  }, [onShortPressed]);

  useEffect(() => {
    const isFromTextInput = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      const isEditable =
        tag === "input" ||
        tag === "textarea" ||
        (target as HTMLElement).isContentEditable;
      return isEditable;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcut handling in input fields/contenteditable by default
      if (isFromTextInput(event.target)) return;

      shortcutsRef.current.forEach((shortcut) => {
        const {
          key,
          ctrlKey = false,
          shiftKey = false,
          altKey = false,
          metaKey = false,
        } = shortcut;

        // Uses event.key, compare case-insensitively for single chars
        const keyMatch =
          key.length === 1
            ? event.key.toLowerCase() === key.toLowerCase()
            : event.key === key;

        if (
          keyMatch &&
          event.ctrlKey === ctrlKey &&
          event.shiftKey === shiftKey &&
          event.altKey === altKey &&
          event.metaKey === metaKey
        ) {
          shortcut.onPress(event);
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <div className={className}>{children}</div>;
};

export default Shortcut;
