import { h } from "preact";
import classNames from "classnames";
import * as css from "./style.css";

type Props = {
  change: number;
  value: number;
  class?: string;
};

export function calculateTrendDiff(value: number, percent: number): number {
  return Math.round(Math.abs(value * (percent / 100)));
}

const Trend = (props: Props) => {
  let directionClass, icon;
  if (props.change < 0) {
    directionClass = css.down;
    icon = require("./images/down.svg");
  } else {
    directionClass = css.up;
    icon = require("./images/up.svg");
  }

  const difference = calculateTrendDiff(props.value, props.change);
  const classes = classNames(directionClass, props.class);

  return (
    <span class={classes}>
      <img class={css.icon} src={icon} />
      {difference}
    </span>
  );
};

export default Trend;
