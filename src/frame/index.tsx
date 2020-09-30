import { h, Component } from "preact";

type Props = {
  apiKey: string;
  mode: string;
  url: string;
  width?: string;
  height?: string;
  data?: any;
  messageKey?: string;
  messagePayloadType?: string;
  messagePayloadActionKey?: string;
};

type State = {
  height: string;
  width: string;
};

export default class Frame extends Component<Props, State> {
  static defaultProps = {
    width: "100%",
    height: "100%",
    mode: "light",
    data: {},
    messageKey: "flipside",
    messagePayloadType: "linkAction",
    messagePayloadActionKey: "href",
  };

  ref: any = null;
  setRef = (dom: any) => (this.ref = dom);

  handleResize = (height: string, width: string) => {
    this.setState({ height: height, width: width });
  };

  handleMessage = (e: any) => {
    const eventData = e.data;
    if (!eventData) return;

    const {
      messageKey,
      messagePayloadType,
      messagePayloadActionKey,
    } = this.props;

    const message = eventData[messageKey];

    if (!message) return;

    if (message.type == "sizeAction") {
      return this.handleResize(
        message["sizeAction"].height,
        message["sizeAction"].width
      );
    }

    if (message.type !== messagePayloadType) return;

    const payload = message[messagePayloadType];
    if (!payload) return;

    const messageAction = payload[messagePayloadActionKey];
    if (!messageAction || typeof messageAction != "string") return;

    window.location.assign(messageAction);
  };

  componentWillMount() {
    window.addEventListener("message", this.handleMessage, false);
    if (!this.ref) return;

    this.setState({
      height: this.props.height,
      width: this.props.width,
    });

    const widgetData = {
      mode: this.props.mode,
      data: this.props.data,
      window: {
        location: {
          origin: window.origin,
          href: window.location && window.location.href,
          pathName: window.location && window.location.pathname,
        },
        dimensions: {
          innerHeight: window.innerHeight,
          innerWidth: window.innerWidth,
          outerHeight: window.outerHeight,
          outerWidth: window.outerWidth,
        },
      },
    };
    let that = this;
    let interval = setInterval(() => {
      that.ref.contentWindow.postMessage(
        {
          flipsidePartner: {
            type: "widgetData",
            widgetData: widgetData,
          },
        },
        "*"
      );
    }, 200);
    setTimeout(() => clearInterval(interval), 5000);
  }

  componentWillUnmount() {
    window.removeEventListener("message", this.handleMessage);
  }

  render(props: Props, state: State) {
    let url = props.url;
    let urlParams = { api_key: props.apiKey, mode: props.mode };
    if (
      props.data &&
      typeof props.data === "object" &&
      !Array.isArray(props.data)
    ) {
      urlParams = { ...props.data, ...urlParams };
    }

    const urlEncodedParams = new URLSearchParams(urlParams).toString();
    url = `${url}?${urlEncodedParams}`;

    return (
      <iframe
        ref={this.setRef}
        src={url}
        style={{ width: state.width, height: state.height, border: 0 }}
        width={state.width}
        height={state.height}
      />
    );
  }
}
