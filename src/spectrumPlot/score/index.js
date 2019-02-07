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
  render(props, { showTooltip }) {
    let rank;
    if (props.metric.fcas <= 500) {
      rank = "f";
    } else if (props.metric.fcas <= 649) {
      rank = "c";
    } else if (props.metric.fcas <= 749) {
      rank = "b";
    } else if (props.metric.fcas <= 899) {
      rank = "a";
    } else {
      rank = "s";
    }

    let wrapperClass = "fs-score";
    if (props.mode === "dark") wrapperClass += " fs-score--dark";
    if (props.mini) wrapperClass += " fs-score--mini";

    const DataComponent = props.mini ? DataMini : Data;

    return (
      <div class={wrapperClass}>
        <header class="fs-token">
          {props.icon.enabled && (
            <img
              class="fs-token__logo"
              src={`https://d301yvow08hyfu.cloudfront.net/svg/color/${props.asset.symbol.toLowerCase()}.svg`}
            />
          )}
          <h1 class="fs-token__name">
            <span style={props.name.style}>
              {props.name.enabled && props.metric.name}
            </span>
            {props.asset && (
              <span class="fs-token__sym">{props.asset.symbol}</span>
            )}
          </h1>
        </header>

        {props.rank.enabled && <DataComponent {...props} rank={rank} />}
      </div>
    );
  }
}
