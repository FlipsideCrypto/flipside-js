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
              src={`https://s3.amazonaws.com/fsc-crypto-icons/svg/color/${
                props.asset
              }.svg`}
            />
          )}
          <h1 class="fs-token__name">
            {props.metric.name}
            {props.asset && <span class="fs-token__sym">{props.asset}</span>}
          </h1>
        </header>

        <DataComponent {...props} rank={rank} />
      </div>
    );
  }
}