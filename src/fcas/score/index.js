import { h, Component } from "preact";
import Data from "./Data";
import DataMini from "./DataMini";
import "./styles.scss";

function round(value) {
  if (!value) {
    return value;
  }
  return Math.round(value * 100) / 100;
}

export default class Score extends Component {
  render({ opts, symbol, metric }, { showTooltip }) {
    let rank;
    if (metric.fcas <= 500) {
      rank = "f";
    } else if (metric.fcas <= 649) {
      rank = "c";
    } else if (metric.fcas <= 749) {
      rank = "b";
    } else if (metric.fcas <= 899) {
      rank = "a";
    } else {
      rank = "s";
    }

    let wrapperClass = "fs-score";
    if (opts.dark) wrapperClass += " fs-score--dark";
    if (opts.mini) wrapperClass += " fs-score--mini";

    const DataComponent = opts.mini ? DataMini : Data;

    return (
      <div class={wrapperClass}>
        {opts.header && (
          <header class="fs-token">
            {opts.logo && (
              <img
                class="fs-token__logo"
                src={`https://s3.amazonaws.com/fsc-crypto-icons/svg/color/${symbol}.svg`}
              />
            )}
            <h1 class="fs-token__name">
              {metric.name}
              {opts.symbol && <span class="fs-token__sym">{symbol}</span>}
            </h1>
          </header>
        )}

        <DataComponent opts={opts} metric={metric} rank={rank} />
      </div>
    );
  }
}
