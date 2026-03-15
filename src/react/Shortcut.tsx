/**
 * Shortcut
 *
 * React component to enable custom keyboard shortcuts (hotkeys) for any part of your UI,
 * using the core logic from @packages/utils/Shortcut/src/core/Shortcut.ts.
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
 */

import React, { ReactNode, useEffect, useRef } from "react";
import { addShortcuts, removeShortcuts, OnShortPressedItem } from "../core/Shortcut";

export interface ShortcutProps {
  children: ReactNode;
  onShortPressed: OnShortPressedItem[];
  className?: string;
}

/**
 * Shortcut: React component that registers and disposes keyboard shortcuts on mount/unmount,
 * using the pure core registration logic for reliable shortcut handling.
 */
const Shortcut: React.FC<ShortcutProps> = ({
  children,
  onShortPressed,
  className,
}) => {
  // Keep a ref to always use latest onShortPressed handlers
  const shortcutsRef = useRef(onShortPressed);

  useEffect(() => {
    shortcutsRef.current = onShortPressed;
  }, [onShortPressed]);

  useEffect(() => {
    // Register the current shortcuts using the core utility
    // Re-register if the shortcut list changes
    const remove = addShortcuts(shortcutsRef.current);
    return () => {
      remove();
    };
  }, [onShortPressed]);

  return <div className={className}>{children}</div>;
};

export default Shortcut;
