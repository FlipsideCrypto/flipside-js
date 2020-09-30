import { h, Component, render } from "preact";
import API, { WidgetLinksLink } from "../../api";
import find from "lodash/find";
import classNames from "classnames";
import * as css from "./style.css";

type Props = {
  widget:
    | "spectrum"
    | "multi-table"
    | "table"
    | "score"
    | "chart"
    | "price-multi-table";
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
    links: [],
  };

  topLinkref: any = null;
  setTopLinkRef = (dom: any) => (this.topLinkref = dom);

  rightLinkref: any = null;
  setRightLinkRef = (dom: any) => (this.rightLinkref = dom);

  leftLinkref: any = null;
  setLeftLinkRef = (dom: any) => (this.leftLinkref = dom);

  sendParentMessage = (link: string) => {
    parent.postMessage(
      {
        flipside: {
          type: "linkAction",
          linkAction: { href: link },
        },
      },
      "*"
    );
  };

  onClickLink = (e: any) => {
    e.stopPropagation();
    e.cancelBubble;

    let href;
    if (!e.target || (e.target && !e.target.getAttribute)) {
      href = "https://flipsidecrypto.com";
    } else {
      href = e.target.getAttribute("href");
    }

    try {
      this.sendParentMessage(href);
    } catch (e) {
      console.log(e);
    }
    window.location.assign(href);
  };

  handleLink = (ref: any, linkType: string) => {
    const linkParent = ref;
    if (!linkParent) return;

    const link = linkParent.children[0];
    if (!link) return;

    link.removeEventListener("click", this.onClickLink);
    link.addEventListener("click", this.onClickLink);
  };

  async componentDidMount() {
    if (this.props.linkBootstrap) {
      this.setState({ links: this.props.linkBootstrap });
      return;
    }
    const res = await this.props.api.fetchWidgetLinks(this.props.widget);
    this.setState({ links: res.data });

    let that = this;
    let interval = setInterval(() => {
      that.handleLink(this.topLinkref, "top");
      that.handleLink(this.rightLinkref, "right");
      that.handleLink(this.leftLinkref, "left");
    }, 100);
    setTimeout(() => clearInterval(interval), 5000);
  }

  render(props: Props, state: State) {
    const linkClass = classNames(css.link, props.linkClass);
    if (state.links.length === 0) {
      return (
        <div class={css.wrapper} style={props.style}>
          <span class={linkClass}>
            <a
              href="https://flipsidecrypto.com/fcas"
              onClick={(e) => {
                e.stopPropagation();
                e.cancelBubble;
                this.sendParentMessage("https://flipsidecrypto.com/fcas");
                window.location.assign("https://flipsidecrypto.com/fcas");
              }}
            >
              What's this?
            </a>
          </span>
        </div>
      );
    }

    const leftLink = find(state.links, { name: "left_link" });
    const rightLink = find(state.links, { name: "right_link" });
    const topLink = find(state.links, { name: "top_link" });

    return (
      <div class={css.wrapper} style={props.style}>
        {topLink && (
          <span
            ref={this.setTopLinkRef}
            class={linkClass}
            dangerouslySetInnerHTML={{ __html: topLink.link_html }}
          />
        )}
        {leftLink && (
          <span
            ref={this.setLeftLinkRef}
            class={linkClass}
            dangerouslySetInnerHTML={{ __html: leftLink.link_html }}
          />
        )}
        {rightLink && (
          <span
            ref={this.setRightLinkRef}
            class={linkClass}
            dangerouslySetInnerHTML={{ __html: rightLink.link_html }}
          />
        )}
      </div>
    );
  }
}

export default CustomLinks;
