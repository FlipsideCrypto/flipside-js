import { h } from "preact";
import "./style.scss";

type Props = {
  change: number;
  value: number;
};

const Trend = (props: Props) => {
  let direction, icon;
  if (props.change < 0) {
    direction = "down";
    icon = require("./images/down.svg");
  } else {
    direction = "up";
    icon = require("./images/up.svg");
  }
  const difference = Math.round(Math.abs(props.value * (props.change / 100)));
  return (
    <span class={`fs-trend fs-trend-${direction}`}>
      <img src={icon} />
      {difference}
    </span>
  );
};

export default Trend;
