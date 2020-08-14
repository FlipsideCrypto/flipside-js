import { h, Component } from "preact";

type Props = {
  apiKey: string;
  mode: string;
  url: string;
  width?: number;
  height?: number;
  data?: any;
  messageKey?: string;
  messagePayloadType?: string;
  messagePayloadActionKey?: string;
};

type State = {};

const encodeURLParams = (url: string, data: any): string => {
  let params = "";
  for (const key in data) {
    if (params !== "") {
      params += "&";
    }
    if (data[key] !== undefined && data[key] !== null) {
      params += key + "=" + encodeURIComponent(data[key]);
    }
  }
  return `${url}?${params}`;
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

    if (message.type !== messagePayloadType) return;

    const payload = message[messagePayloadType];
    if (!payload) return;

    const messageAction = payload[messagePayloadActionKey];
    if (!messageAction || typeof messageAction != "string") return;

    window.location.assign(messageAction);
  };

  componentDidMount() {
    window.addEventListener("message", this.handleMessage, false);
    if (!this.ref) return;

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
    this.ref.contentWindow.postMessage(
      {
        flipsidePartner: {
          type: "widgetData",
          widgetData: widgetData,
        },
      },
      "*"
    );
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
    url = encodeURLParams(props.url, urlParams);

    return (
      <iframe
        ref={this.setRef}
        src={url}
        style={{ width: props.width, height: props.height, border: 0 }}
        width={props.width}
        height={props.height}
      />
    );
  }
}
