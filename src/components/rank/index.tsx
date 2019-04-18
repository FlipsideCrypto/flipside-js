import { h, Component } from "preact";
import classNames from "classnames";
import * as css from "./style.css";

type Props = {
  score: number;
  grade?: string;
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
    let css_: any = css;
    if (props.grade) {
      rankClass = css_[props.grade.toLowerCase()];
    } else {
      if (props.score <= 500) {
        rankClass = css_.f;
      } else if (props.score <= 649) {
        rankClass = css_.c;
      } else if (props.score <= 749) {
        rankClass = css_.b;
      } else if (props.score <= 899) {
        rankClass = css_.a;
      } else {
        rankClass = css_.s;
      }
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
