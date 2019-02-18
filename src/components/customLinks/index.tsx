import { h, Component, render } from "preact";
import API, { WidgetLinksLink } from "../../api";
import find from "lodash/find";
import classNames from "classnames";
import * as css from "./style.css";

type Props = {
  widget: "spectrum" | "multi-table" | "table" | "score" | "chart";
  api: API;
  style?: any;
  linkClass?: string;
  linkBootstrap?: WidgetLinksLink[];
};

type State = {
  links: WidgetLinksLink[];
};

class CustomLinks extends Component<Props, State> {
  state: State = {
    links: []
  };

  async componentDidMount() {
    if (this.props.linkBootstrap) {
      this.setState({ links: this.props.linkBootstrap });
      return;
    }
    const res = await this.props.api.fetchWidgetLinks(this.props.widget);
    this.setState({ links: res.data });
  }

  render(props: Props, state: State) {
    const linkClass = classNames(css.link, props.linkClass);
    if (state.links.length === 0) {
      return (
        <div class={css.wrapper} style={props.style}>
          <span class={linkClass}>
            <a href="https://flipsidecrypto.com/fcas">What's this?</a>
          </span>
        </div>
      );
    }

    const leftLink = find(state.links, { name: "left_link" });
    const rightLink = find(state.links, { name: "right_link" });
    return (
      <div class={css.wrapper} style={props.style}>
        {leftLink && (
          <span
            class={linkClass}
            dangerouslySetInnerHTML={{ __html: leftLink.link_html }}
          />
        )}
        {rightLink && (
          <span
            class={linkClass}
            dangerouslySetInnerHTML={{ __html: rightLink.link_html }}
          />
        )}
      </div>
    );
  }
}

export default CustomLinks;
