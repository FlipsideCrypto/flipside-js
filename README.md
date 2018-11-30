# FlipsideJS

FlipsideJS provides a library embeddable widgets that display data from the Flipside Platform API, including FCAS.

## Install

```html
<script src="https://js.flipsidecrypto.com/flipside-v1.0.0.js"></script>
```

## Usage

```html
<div id="container"></div>
<script>
  var flipside = new Flipside(YOUR_FLIPSIDE_API_KEY);
  flipside.create("container", "BTC");
</script>
```

## API

_create(id: string, symbol: string, options: object)_
Creates an FCAS widget in the given element ID.

#### Parameters

- _id_: ID of the element in which to create the widget.
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
flipside.create("container", "ETH", {
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

## Development

```
$ yarn run dev
```
