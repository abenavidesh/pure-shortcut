# pure-shortcut

[![npm version](https://img.shields.io/npm/v/pure-shortcut.svg?style=flat)](https://www.npmjs.com/package/pure-shortcut)
[![npm downloads](https://img.shields.io/npm/dm/pure-shortcut.svg?style=flat)](https://www.npmjs.com/package/pure-shortcut)
[![license](https://img.shields.io/github/license/abenavidesh/pure-shortcut?style=flat)](./LICENSE)

> **A modern, flexible, and dependency-free keyboard shortcut handler for React and plain JavaScript/TypeScript—packed with accessibility and productivity features.**

---

## 📑 Table of Contents

- [Project Overview](#project-overview)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Basic Usage](#basic-usage)
- [API Reference](#api-reference)
- [Advanced Usage](#advanced-usage)
- [Events System](#events-system)
- [Examples](#examples)
- [Contributing & Feedback](#contributing--feedback)
- [License](#license)
- [Author](#author)

---

## 💡 Project Overview

**pure-shortcut** enables developers to easily add and manage global or scoped keyboard shortcuts ("hotkeys") for React applications and plain JS/TS projects. Designed for accessibility, flexibility, and a frictionless developer experience, it's perfect for triggering commands, managing dashboards, navigation, CRUD operations, and more.

- **Universal**: Use as a React component or standalone vanilla utility.
- **Input-aware**: Automatically ignores `<input>`, `<textarea>`, and `contentEditable` fields to prevent user interference—unless you set `allowInputs: true` on a shortcut.
- **Lightweight**: No runtime dependencies for core JS usage.
- **Type-safe**: Provides full TypeScript support.

---

## ⚙️ Installation

```bash
# With npm
npm install pure-shortcut

# With yarn
yarn add pure-shortcut
```

---

## 📦 Dependencies

- **React** (v18+) is required only if you use the `Shortcut` React component.
- **No dependencies** are required when using the standalone core API (`addShortcuts`, `removeShortcuts`).

---

## 🚀 Basic Usage

### React - Using the Shortcut Component

```tsx
import React from "react";
import { Shortcut, type OnShortPressedItem } from "pure-shortcut";

const shortcuts: OnShortPressedItem[] = [
  {
    key: "s",
    ctrlKey: true,
    onPress: (e) => {
      e.preventDefault();
      alert("Saved!");
    },
  },
  {
    key: "x",
    altKey: true,
    allowInputs: true, // This shortcut works even when an input is focused!
    onPress: (e) => {
      e.preventDefault();
      alert("Detected ALT+X combination, even in an input box");
    },
  },
];

function App() {
  return (
    <Shortcut onShortPressed={shortcuts}>
      <input placeholder="Press Ctrl+S to save or Alt+X for another action (try in input)" />
    </Shortcut>
  );
}

export default App;
```

### Plain JavaScript/TypeScript (with bundler)

```ts
import { addShortcuts, removeShortcuts } from "pure-shortcut";

const handler = (e: KeyboardEvent) => {
  e.preventDefault();
  alert("Saved!");
};

const remove = addShortcuts([
  { key: "s", ctrlKey: true, onPress: handler },
  { key: "z", ctrlKey: true, allowInputs: true, onPress: () => alert("Ctrl+Z works anywhere!") }
]);

// Later, when you want to clean up:
// remove(); // Removes only these shortcuts
// removeShortcuts(); // Removes all registered shortcuts
```

### Directly in Browser (No Bundler, Core Bundle)

After running `npm run build:core`, you can use the ESM core bundle:

```html
<script type="module">
  import { addShortcuts, removeShortcuts } from "./dist-core/core.js";

  const handler = (e) => {
    e.preventDefault();
    alert("Saved from vanilla!");
  };

  const remove = addShortcuts([
    { key: "s", ctrlKey: true, onPress: handler },
    { key: "x", allowInputs: true, onPress: () => alert("X pressed even in input!") }
  ]);

  window.addEventListener("beforeunload", () => remove());
</script>
```

---

## 🛠️ API Reference

### `<Shortcut />` React Component

| Prop             | Type                   | Required | Description                                                |
| ---------------- | ---------------------- | -------- | ---------------------------------------------------------- |
| `children`       | `ReactNode`            | Yes      | The React content to wrap and enable shortcut handling on. |
| `onShortPressed` | `OnShortPressedItem[]` | Yes      | Array of shortcut definitions. See structure below.        |
| `className`      | `string`               | No       | Optional CSS class to apply to the wrapper `<div>`.        |

#### **OnShortPressedItem Structure**

```ts
{
  key: string;                  // Keyboard key to listen for (e.g., "s", "Enter", "ArrowUp")
  ctrlKey?: boolean;            // If true, Ctrl key is required (optional)
  shiftKey?: boolean;           // If true, Shift key is required (optional)
  altKey?: boolean;             // If true, Alt key is required (optional)
  metaKey?: boolean;            // If true, Meta (⌘ on Mac, Windows on PC) is required (optional)
  allowInputs?: boolean;        // If true, shortcut is triggered even in <input>, <textarea>, or contentEditable
  onPress: (e: KeyboardEvent) => void; // Callback executed on shortcut activation
}
```

##### Example

```tsx
onShortPressed={[
  { key: "s", ctrlKey: true, onPress: (e) => { e.preventDefault(); alert("Saved!"); } },
  { key: "q", allowInputs: true, onPress: () => alert("Q works anywhere!") }
]}
```

---

## ⚡ Advanced Usage

### Global Shortcuts with JavaScript Utility API

You can use pure JavaScript or TypeScript for global or non-React shortcut handling:

```ts
import { addShortcuts, removeShortcuts, type OnShortPressedItem } from "pure-shortcut";

const shortcuts: OnShortPressedItem[] = [
  { key: "s", ctrlKey: true, onPress: (e) => { e.preventDefault(); alert("Saved!"); } },
  // The following allows working in input fields as well:
  { key: "y", altKey: true, allowInputs: true, onPress: () => alert("Alt+Y works in input!") }
];

const remove = addShortcuts(shortcuts);

// To clean up:
remove();          // Removes only these shortcuts
removeShortcuts(); // Removes all registered shortcuts
```

**Direct HTML usage:**  
Reference the ESM bundle at `dist-core/core.js` from your HTML directly after running `npm run build:core` (see above).

---

## 🎯 Events System

- **Key Events:** All registered shortcut handlers receive the native `KeyboardEvent` object as an argument.
- **Input Safety:** By default, shortcuts are ignored when the focus is on `<input>`, `<textarea>`, or any `contentEditable` element, ensuring text entry is never interrupted.  
  If you want a shortcut to trigger even when a text field is focused, set the `allowInputs` property to `true` for that shortcut.

---

## 💻 Examples

### Basic Example

```tsx
<Shortcut
  onShortPressed={[
    { key: "s", ctrlKey: true, onPress: (e) => { e.preventDefault(); alert("Saved!"); } },
    { key: "l", allowInputs: true, onPress: () => alert("L pressed anywhere!") }
  ]}
>
  <input />
</Shortcut>
```

### Styled Example

```tsx
import Shortcut from "pure-shortcut";

function Demo() {
  return (
    <Shortcut
      className="bg-gray-100 p-4 rounded"
      onShortPressed={[
        { key: "s", ctrlKey: true, onPress: (e) => { e.preventDefault(); alert("Saved"); } },
        { key: "u", shiftKey: true, onPress: (e) => { e.preventDefault(); alert("Shift+U"); } },
        { key: "k", allowInputs: true, onPress: () => alert("K works even in <input>!") }
      ]}
    >
      <input placeholder="Try the shortcuts (Ctrl+S, Shift+U, K)" />
    </Shortcut>
  );
}
```
## 🙌 Contributing & Feedback

We welcome contributions, feedback, and bug reports!

- **To contribute:** Fork the repository, create a feature branch, and submit a pull request.
- **Feedback or feature requests:** Open an [issue](https://github.com/abenavidesh/pure-shortcut/issues) on GitHub or reach out to the author below.

---

## 📄 License

Distributed under the [MIT License](./LICENSE).

---

## 👤 Author

Developed and maintained by Antonio Benavides H.
