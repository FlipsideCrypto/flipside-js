import { h } from "preact";
import classNames from "classnames";
import * as css from "./style.css";

type Props = {
  change?: number;
  pointChange?: number;
  value: number;
  class?: string;
};

export function calculateTrendDiff(value: number, percent: number): number {
  return Math.round(Math.abs(value * (percent / 100)));
}

const Trend = (props: Props) => {
  let directionClass, icon;
  let changeDeterminate = props.pointChange ? props.pointChange : props.change;
  if (changeDeterminate < 0) {
    directionClass = css.down;
    icon = require("./images/down.svg");
  } else if (changeDeterminate > 0) {
    directionClass = css.up;
    icon = require("./images/up.svg");
  }

  let difference;
  if (props.pointChange) {
    difference = props.pointChange;
  } else {
    difference = calculateTrendDiff(props.value, props.change);
  }

  if (!difference || difference === 0) {
    return <span />;
  }

  const classes = classNames(css.wrapper, directionClass, props.class);

  return (
    <span class={classes}>
      <img class={css.icon} src={icon} />
      {difference}
    </span>
  );
};

export default Trend;
