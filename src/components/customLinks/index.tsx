import { h, Component, render } from "preact";
import API, { WidgetLinksLink } from "../../api";
import find = require("lodash/find");
import * as css from "./style.css";

type Props = {
  widget: "spectrum" | "multi-table" | "table";
  api: API;
};

type State = {
  links: WidgetLinksLink[];
};

class CustomLinks extends Component<Props, State> {
  state: State = {
    links: []
  };

  async componentDidMount() {
    const res = await this.props.api.fetchWidgetLinks(this.props.widget);
    this.setState({ links: res.data });
  }

  render(_: Props, state: State) {
    const leftLink = find(state.links, { name: "left_link" });
    const rightLink = find(state.links, { name: "right_link" });
    return (
      <div class={css.wrapper}>
        {leftLink && (
          <span
            class={css.link}
            dangerouslySetInnerHTML={{ __html: leftLink.link_html }}
          />
        )}
        {rightLink && (
          <span
            class={css.link}
            dangerouslySetInnerHTML={{ __html: rightLink.link_html }}
          />
        )}
      </div>
    );
  }
}

export default CustomLinks;
