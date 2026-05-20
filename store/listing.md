# Chrome Web Store 上架文案 / Store Listing Copy

本文件汇总提交到 Chrome Web Store 时需要填写的文案，供复制粘贴使用。

---

## 1. 基本信息 / Basic Info

| 字段 | 值 |
|------|----|
| 名称 / Name | Exchange Calc Chrome |
| 分类 / Category | 工具 (Tools) |
| 语言 / Language | 中文（简体）、English |

---

## 2. 简短描述 / Short Description

> 商店限制 132 字符以内。

**English**

```
Select any price on a web page and instantly convert it between CNY, USD, and RUB from the right-click menu.
```

**中文**

```
选中网页上的任意金额，通过右键菜单一键在人民币、美元、卢布之间换算。
```

---

## 3. 详细描述 / Detailed Description

**English**

```
Exchange Calc turns any price on the web into the currencies you care about — without leaving the page.

HOW IT WORKS
1. Select a price on any web page (for example ¥2, $2.15, ₽300, or "CNY 12").
2. Open the right-click menu — the conversion to CNY / USD / RUB is shown right there.
3. Click the menu item to copy the full result to your clipboard.

FEATURES
• Recognizes common price formats: ¥, $, ₽ symbols and CNY / USD / RUB codes.
• Plain numbers are treated as a configurable default currency.
• Live conversion shown directly in the context-menu title.
• One-click copy of the full conversion result.
• A toolbar popup for manual input or reading the current selection.
• Exchange rates are cached locally for up to one hour; if the rate service is unreachable the cached rates are reused.
• Options page to set the default currency for plain numbers and the cache duration.

PRIVACY
Exchange Calc does not collect, store, or transmit any personal data. Selected text is parsed entirely on your device. The only network requests are to public exchange-rate APIs and contain no user information. See the privacy policy for details.

Supported currencies: CNY, USD, RUB.
```

**中文**

```
Exchange Calc 让你在不离开当前页面的情况下，把网页上的任意价格换算成你关心的货币。

使用方法
1. 在任意网页选中一个金额（例如 ¥2、$2.15、₽300 或 “CNY 12”）。
2. 打开右键菜单——人民币 / 美元 / 卢布的换算结果会直接显示在菜单里。
3. 点击该菜单项，即可把完整结果复制到剪贴板。

功能特点
• 识别常见金额格式：¥、$、₽ 符号以及 CNY / USD / RUB 代码。
• 纯数字按可配置的默认币种处理。
• 换算结果实时显示在右键菜单标题上。
• 一键复制完整换算结果。
• 提供工具栏弹窗，可手动输入或读取当前选中内容。
• 汇率在本地缓存最长 1 小时；汇率服务不可用时自动回退到缓存。
• 提供设置页，可配置纯数字的默认币种和汇率缓存时长。

隐私说明
Exchange Calc 不收集、不存储、不上传任何个人数据。选中的文本完全在你的设备本地解析。唯一的网络请求是访问公开的汇率接口，且不包含任何用户信息。详见隐私政策。

支持的货币：人民币 (CNY)、美元 (USD)、卢布 (RUB)。
```

---

## 4. 单一用途说明 / Single Purpose

> 控制台要求用一句话说明扩展的唯一用途。

**English**

```
Exchange Calc converts a monetary amount selected on a web page between CNY, USD, and RUB.
```

**中文**

```
Exchange Calc 的唯一用途是把网页中选中的金额在人民币、美元、卢布之间换算。
```

---

## 5. 权限说明 / Permission Justifications

> Chrome Web Store 的 "Privacy practices" 标签要求逐条解释每个权限。

| 权限 / Permission | 说明文案（英文）|
|-------------------|----------------|
| `contextMenus` | Used to add the conversion entry to the right-click menu and show the converted result in the menu title. |
| `notifications` | Used to show the full conversion result in a system notification after the user clicks the menu item. |
| `storage` | Used to cache the most recently fetched exchange rates locally (up to one hour) and to store the user's options. |
| `scripting` | Used to inject a small script into the active tab to read the user's selected text and write the conversion result to the clipboard. |
| `activeTab` | Used to access the current tab only when the user actively triggers the extension (clicking the menu item or a popup button). |
| Host permission `open.er-api.com` | Used to fetch the latest currency exchange rates. Requests contain no user data. |
| Host permission `api.exchangerate-api.com` | Used as a fallback source for the latest exchange rates when the primary service is unavailable. Requests contain no user data. |
| Content script on `<all_urls>` | A lightweight content script runs on pages to detect when the user selects text, so the menu can preview the conversion. It only reads the current text selection and sends no data anywhere except the extension's own background service worker. |

**权限说明（中文，可填入中文区域）**

- `contextMenus`：在网页右键菜单中添加换算入口，并在菜单标题上显示换算结果。
- `notifications`：用户点击菜单项后，通过系统通知展示完整换算结果。
- `storage`：在本地缓存最近一次获取的汇率（最长 1 小时），并保存用户的设置。
- `scripting`：向当前标签页注入小段脚本，以读取用户选中的文本并把换算结果写入剪贴板。
- `activeTab`：仅在用户主动触发扩展（点击菜单项或弹窗按钮）时访问当前标签页。
- 主机权限 `open.er-api.com`：获取最新汇率数据，请求中不包含任何用户信息。
- 主机权限 `api.exchangerate-api.com`：当主汇率服务不可用时作为备用汇率来源，请求中不包含任何用户信息。
- 作用于 `<all_urls>` 的内容脚本：在网页中运行一个轻量脚本，用于检测用户何时选中文本，从而预览换算结果。它只读取当前文本选区，且仅把数据发送给扩展自身的后台服务。

---

## 6. 数据使用声明 / Data Usage Disclosures

在控制台的数据使用问卷中，按以下方式勾选：

- 是否收集或使用用户数据？**否 (No)** — 扩展不收集任何个人或敏感用户数据。
- 是否出售用户数据？**否 (No)**
- 是否将数据用于与核心功能无关的用途？**否 (No)**
- 是否将数据用于判定信用资格或贷款？**否 (No)**

隐私政策网址（启用 GitHub Pages 后）：

```
https://yezoai.github.io/exchange-calc-chrome/privacy-policy.html
```
