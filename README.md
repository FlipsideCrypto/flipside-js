# FlipsideJS

FlipsideJS provides a library of embeddable widgets that display data from the Flipside Platform API, including FCAS.

To get started, request an API Key: api@flipsidecrypto.com.

## Example

[View Live FCAS Widget Example](https://jsfiddle.net/flipsidejim/f7zpd0uj/17/)

## Install

The FlipsideJS library is made available over our CDN to ensure a speedy response time.

```html
<script src="https://d3sek7b10w79kp.cloudfront.net/flipside-v1.1.0.js"></script>
```

## Usage

```html
<div id="container"></div>
<script>
  var flipside = new Flipside(YOUR_FLIPSIDE_API_KEY);
  // To render an FCAS widget
  flipside.createFCAS("container", "ZEC");
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

## Building

```
$ yarn run build
```
