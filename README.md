# FlipsideJS

FlipsideJS is a library of embeddable widgets that display data from the Flipside Platform API, including FCAS.

To get started, request an API Key: api@flipsidecrypto.com.

## Live Examples

[View Live FCAS Widget Example](https://jsfiddle.net/flipsidejim/f7zpd0uj/24/)
<br>
[View Live Table Widget Example](https://jsfiddle.net/flipsidejim/vsh5dq9y/7/)

## Install

The FlipsideJS library is made available over our CDN to ensure a speedy response time.

```html
<script src="https://d3sek7b10w79kp.cloudfront.net/flipside-v1.5.2.js"></script>
```

## Usage

To render an FCAS widget:

```html
<div id="container"></div>
<script>
  var flipside = new Flipside(YOUR_FLIPSIDE_API_KEY);
  // To render an FCAS widget
  flipside.createFCAS("container", "ZEC");
</script>
```

To render a Table Widget:

```html
<div id="container"></div>
<script>
  var flipside = new Flipside(YOUR_FLIPSIDE_API_KEY);
  // To render an FCAS widget
  flipside.createTable("container", "ZEC", {
    dark: true
  });
</script>
```

## API

_createFCAS(id: string, symbol: string, options: object)_
Creates an FCAS widget in the given DOM element ID.

#### Parameters

- _id_: ID of the DOM element in which to create the widget.
- _symbol_: Symbol of the asset. e.g "BTC"
- _opts_: Display options for the widget

#### Options

- `score: boolean`: Show/hide the score section.
- `plot: boolean`: Show/hide the plot graph.
- `logo: boolean`: Show/hide the asset's logo.
- `symbol: boolean`: Show/hide the asset's symbol.
- `trend: boolean`: Show/hide the 7 day trend.
- `rank: boolean`: Show/hide the FCAS rank.
- `dark: boolean`: Renders the widget with white text.
- `mini: boolean`: Renders a smaller version of the asset's symbol and score.

#### Default options

```js
flipside.createFCAS("container", "ZEC", {
  score: true,
  plot: true,
  logo: true,
  symbol: true,
  trend: true,
  rank: true
});
```

_creatTable(id: string, symbol: string, options: object)_
Creates a Table widget in the given DOM element ID. Widget background is transparent in order to inherit the page background color.

#### Parameters

- _id_: ID of the DOM element in which to create the widget.
- _symbol_: Symbol of the asset. e.g "BTC"
- _opts_: Display options for the widget

#### Options

- `dark: boolean`: Renders the widget with white text.
- `borderColor: string`: Hexcode of the border table border color. Defaults to "#737e8d".

#### Default options

```js
flipside.createTable("container", "ZEC", {
  dark: true,
  borderColor: "#737e8d"
});
```

## Building

```
$ yarn run build
```

## Current Build Status

[ ![Codeship Status for FlipsideCrypto/flipside-js](https://app.codeship.com/projects/90a5caa0-d718-0136-0d76-3af8ab8e471d/status?branch=master)](https://app.codeship.com/projects/317100)
