import { h, Component, render } from "preact";
import "./style.scss";
import API, { WidgetLinksLink } from "../../api";
import find = require("lodash/find");

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
      <div class="fs-links">
        {leftLink && (
          <p dangerouslySetInnerHTML={{ __html: leftLink.link_html }} />
        )}
        {rightLink && (
          <p dangerouslySetInnerHTML={{ __html: rightLink.link_html }} />
        )}
      </div>
    );
  }
}

export default CustomLinks;
