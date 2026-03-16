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

import React, { ReactNode, useEffect } from "react";
import {
  addShortcuts,
  removeShortcuts,
  type OnShortPressedItem,
  type ShortcutScopeId,
} from "../core/Shortcut";

export interface ShortcutProps {
  children: ReactNode;
  onShortPressed: OnShortPressedItem[];
  className?: string;
  /**
   * Identificador opcional de scope para agrupar atajos.
   * Permite habilitar/deshabilitar todos los atajos asociados a este scope desde el core.
   */
  scopeId?: ShortcutScopeId;
  /**
   * Si es false, no registra atajos aunque se haya definido onShortPressed.
   * Por defecto true.
   */
  enabled?: boolean;
}

/**
 * Shortcut: React component that registers and disposes keyboard shortcuts on mount/unmount,
 * using the pure core registration logic for reliable shortcut handling.
 */
const Shortcut: React.FC<ShortcutProps> = ({
  children,
  onShortPressed,
  className,
  scopeId,
  enabled = true,
}) => {
  useEffect(() => {
    if (!enabled || onShortPressed.length === 0) {
      return;
    }

    const remove = addShortcuts(onShortPressed, { scopeId });
    return () => {
      remove();
    };
  }, [enabled, onShortPressed, scopeId]);

  return <div className={className}>{children}</div>;
};

export default Shortcut;
