import { h, Component, render } from "preact";
import "./style.scss";
import API, { WidgetLinksLink } from "../../api";

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

  render() {
    return (
      <div class="fs-links">
        {this.state.links.map(link => (
          <p dangerouslySetInnerHTML={{ __html: link.link_html }} />
        ))}
      </div>
    );
  }
}

export default CustomLinks;
