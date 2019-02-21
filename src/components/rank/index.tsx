import { h, Component } from "preact";
import classNames from "classnames";
import * as css from "./style.css";

type Props = {
  score: number;
  kind?: "slim" | "normal" | "large";
  class?: string;
};

type State = {
  showTooltip: boolean;
};

export default class Rank extends Component<Props, State> {
  static defaultProps = {
    kind: "slim"
  };

  state: State = {
    showTooltip: false
  };

  showTooltip = () => {
    this.setState({ showTooltip: true });
  };

  hideTooltip = () => {
    this.setState({ showTooltip: false });
  };

  render(props: Props) {
    let rankClass;
    if (props.score <= 500) {
      rankClass = css.f;
    } else if (props.score <= 649) {
      rankClass = css.c;
    } else if (props.score <= 749) {
      rankClass = css.b;
    } else if (props.score <= 899) {
      rankClass = css.a;
    } else {
      rankClass = css.s;
    }

    let kindClass = css[props.kind];

    const classes = classNames(css.rank, rankClass, kindClass);
    return (
      <div class={css.wrapper}>
        {props.kind === "large" && "Rank"}
        <span class={classes} />
      </div>
    );
    // return <span class={`fs-rank fs-rank-${rank}`} />;
  }
}
