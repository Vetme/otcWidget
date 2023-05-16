# Vetme Widgets

The `@vetme/widgets` package is an [npm package](https://www.npmjs.com/package/@vetme/widgets) of React components used to provide subsets of the vetme Protocol functionality in a small and configurable user interface element.

# Vetme Widget

Vetme widget provides users of your website with a handy tool for otc trading.

You can customize the theme (colors, fonts, border radius, and more) to match the style of your application. You can also configure your own default token list through the widget on your site.

## Installation

Install the widgets library via `npm` or `yarn`.

```js
yarn add @vetme/widgets
```

```js
npm i --save @vetme/widgets
```

## Adding the Swap widget to your app

Embed the React component in your application with this piece of code:

```js
import { Widget } from "@vetme/widgets";

<Widget
  client="yourCompanyNameHere"
  theme={theme}
  provider={ethersProvider}
  defaultTokenName="VetMe"
/>;
```

## Customizing The VetMe Widget

## Overview

Here are a few examples that demonstrate how you can personalize the widget theme to align with the appearance and ambiance of your dApp. You can seamlessly incorporate any of these examples into your code using the provided snippet, allowing you to define your preferred theme.

```js
const defaultTheme = {
  primary: "#fff",
  secondary: "#fcf9ff",
  dialog: "#fcf9ff",
  borderRadius: "10px",
  inputRadius: "10px",
  buttonRadius: "100px",
  stroke: "#170728",
  interactive: "#BEFECD",
  interactiveHover: "#9ce4ad",
  active: "#170728",
  activeText: "#fff",
  accent: "#28E0B9",
  success: "#189470",
  warning: "#FF9901",
  error: "#FF537B",
  text: "#170728",
  subtext: "#340e5c",
  fontFamily: "Space Grotesk",
};

const yourTheme = {
    // Your Theme here
}

<Widget
  client="yourCompanyNameHere"
  theme={yourTheme}
  provider={ethersProvider}
  defaultTokenName="VetMe"
/>;
```
