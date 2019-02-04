import { h, Component, render } from "preact";
import "./style.scss";
import API, { WidgetLinksLink } from "../../../api";
import find = require("lodash/find");

type Props = {
  widget: "spectrum" | "multi-table" | "table";
  api: API;
};

type State = {
  links: WidgetLinksLink[];
  isLoading: boolean;
  intervalId: any;
};

class CustomLinks extends Component<Props, State> {
  state: State = {
    links: [],
    isLoading: true,
    intervalId: null
  };

  async getData() {
    const res = await this.props.api.fetchWidgetLinks(this.props.widget);
    this.setState({ links: res.data, isLoading: false });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  componentDidMount() {
    this.getData();
    const intervalId = setInterval(() => {
      this.getData();
    }, 60000);
    this.setState({ intervalId: intervalId });
  }

  render(_: Props, state: State) {
    if (this.state.isLoading) return <div />;
    const bottomLink: any = find(state.links, { name: "bottom_link" });
    if (!bottomLink || (bottomLink && !bottomLink.link_html)) {
      return (
        <div class="fs-bottom-link">
          <a href="https://flipsidecrypto.com">
            Want to know more about these scores?
          </a>
        </div>
      );
    }
    return (
      <div
        class="fs-bottom-link"
        dangerouslySetInnerHTML={{ __html: bottomLink.link_html }}
      />
    );
  }
}

export default CustomLinks;
