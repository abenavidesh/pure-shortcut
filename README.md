# pure-shortcut

[npm version](https://www.npmjs.com/package/pure-shortcut)
[npm downloads](https://www.npmjs.com/package/pure-shortcut)
[license](LICENSE)

> **Elegant, customizable keyboard shortcut provider for React components (with pure JS support).**

---

## 📚 Table of Contents

- [Project Description](#project-description)
- [Demo](#demo)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Advanced Usage](#advanced-usage)
  - [Global Shortcuts with JavaScript](#global-shortcuts-with-javascript)
- [Events System](#events-system)
- [Examples](#examples)
- [Contributing & Feedback](#contributing--feedback)
- [License](#license)
- [Author](#author)

---

## 📝 Project Description

**pure-shortcut** is a React component and TypeScript utility enabling easy creation and management of global or scoped keyboard shortcuts (hotkeys). Designed for accessibility and productivity, it lets you assign one or more key combinations to any UI part—ideal for commands, CRUD, navigation, and dashboards. 

- Supports both React (via the Shortcut component) and vanilla JS/TS (addShortcuts/removeShortcuts).
- Ignores input, textarea, and contentEditable by default to avoid interfering with user text input.

---

## 🔗 Dependencies

- **React** (version 18+)
- **TailwindCSS** (optional; only if you utilize `className` for styling)
- **@iconify/react** (optional; only if your children require these icons)

---

## 🚀 Quick Start

```tsx
import React from "react";
import Shortcut from "pure-shortcut";

function App() {
  return (
    <Shortcut
      onShortPressed={[
        {
          key: "s",
          ctrlKey: true,
          onPress: (e) => {
            e.preventDefault();
            alert("Saved!");
          }
        },
        {
          key: "x",
          altKey: true,
          onPress: (e) => {
            e.preventDefault();
            alert("Detected ALT+X combination");
          }
        }
      ]}
    >
      <input placeholder="Press Ctrl+S to save or Alt+X for another action" />
    </Shortcut>
  );
}

export default App;
```

---

## 🛠️ API Reference

### `<Shortcut />` Component


| Prop             | Type                   | Required | Description                                                 |
| ---------------- | ---------------------- | -------- | ----------------------------------------------------------- |
| `children`       | `ReactNode`            | Yes      | The React content to wrap and enable shortcut listening on. |
| `onShortPressed` | `OnShortPressedItem[]` | Yes      | Array of shortcut definitions. See below for details.       |
| `className`      | `string`               | No       | Optional CSS class for the wrapping `<div>`.                |


#### **OnShortPressedItem**

```ts
{
  key: string;                  // The key to listen for (e.g., "s", "Enter", "ArrowUp")
  ctrlKey?: boolean;            // Requires Ctrl key (optional)
  shiftKey?: boolean;           // Requires Shift key (optional)
  altKey?: boolean;             // Requires Alt key (optional)
  metaKey?: boolean;            // Requires Meta (⌘ on Mac, Windows key on PC) (optional)
  onPress: (e: KeyboardEvent) => void; // Callback executed when the shortcut triggers
}
```

##### Example:

```tsx
onShortPressed={[
  { key: "s", ctrlKey: true, onPress: (e) => { e.preventDefault(); alert("Saved!"); } }
]}
```

---

## ⚡️ Advanced Usage

### Global Shortcuts with JavaScript (Utility API)

You can also use pure JavaScript/TypeScript—for instance, in non-React contexts or for global shortcuts:

```js
import { addShortcuts, removeShortcuts } from "pure-shortcut";

const handler = (e) => { e.preventDefault(); alert("Saved!"); };

addShortcuts([
  { key: "s", ctrlKey: true, onPress: handler }
]);

// Later, when you want to clean up:
removeShortcuts();
```

You can also use in HTML directly:

```html
<script src="Shortcut.js"></script>
<script>
  addShortcuts([
    { key: "n", ctrlKey: true, altKey: true, onPress: function(e) { alert('Ctrl+Alt+N!'); } }
  ]);
</script>
```

---

## 🎯 Events System

- **Key Events**: All registered shortcuts receive the native `KeyboardEvent` object.
- **Input Safety**: Shortcuts are ignored when typing in `<input>`, `<textarea>`, or content-editable elements by default (for UX).

---

## 💡 Examples

### Basic Example

```tsx
<Shortcut
  onShortPressed={[
    { key: "s", ctrlKey: true, onPress: (e) => { e.preventDefault(); alert("Saved!"); } }
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
        { key: "u", shiftKey: true, onPress: (e) => { e.preventDefault(); alert("Shift+U"); } }
      ]}
    >
      <input placeholder="Try the shortcuts (Ctrl+S, Shift+U)" />
    </Shortcut>
  );
}
```

---

## 🙌 Contributing / Feedback

Feedback, issues, and PRs are welcome!  
Please open an [issue](https://github.com/your-repo/issues) or submit a pull request.

- To contribute, fork the repo, create your feature branch, and submit a pull request.
- For questions or feature requests, contact the author below.

---

## 📄 License

Distributed under the [MIT License](./LICENSE).

---

## 👤 Author

Developed and maintained by [Antonio Benavides H.](mailto:your-email@example.com)