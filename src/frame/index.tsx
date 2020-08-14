import { h, Component } from "preact";
import API from "../api";

type Props = {
  api: any;
  url: string;
  width?: number;
  height?: number;
};

type State = {};

export default class Frame extends Component<Props, State> {
  static defaultProps = {
    width: "100%",
    height: "100%",
  };

  render(props: Props, state: State) {
    return (
      <iframe
        src={props.url}
        width={props.width}
        height={props.height}
        frameBorder={0}
      />
    );
  }
}
