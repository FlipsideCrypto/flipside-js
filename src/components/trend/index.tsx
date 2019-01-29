import { h } from "preact";
import "./style.scss";

type Props = {
  change: number;
  value: number;
};

export function calculateTrendDiff(value: number, percent: number): number {
  return Math.round(Math.abs(value * (percent / 100)));
}

const Trend = (props: Props) => {
  let direction, icon;
  if (props.change < 0) {
    direction = "down";
    icon = require("./images/down.svg");
  } else {
    direction = "up";
    icon = require("./images/up.svg");
  }
  const difference = calculateTrendDiff(props.value, props.change);
  return (
    <span class={`fs-trend fs-trend-${direction}`}>
      <img src={icon} />
      {difference}
    </span>
  );
};

export default Trend;
