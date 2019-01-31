import { h, Component } from "preact";
import "./style.scss";

type Props = {
  score: number;
};

type State = {
  showTooltip: boolean;
};

export default class Rank extends Component<Props, State> {
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
  }
}
