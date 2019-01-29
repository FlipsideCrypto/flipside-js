import { h } from "preact";
import "./style.scss";

type Props = {
  score: number;
};

const Rank = (props: Props) => {
  let rank;
  if (props.score <= 500) {
    rank = "f";
  } else if (props.score <= 649) {
    rank = "c";
  } else if (props.score <= 749) {
    rank = "b";
  } else if (props.score <= 899) {
    rank = "a";
  } else {
    rank = "s";
  }

  return <span class={`fs-rank fs-rank-${rank}`} />;
};

export default Rank;
