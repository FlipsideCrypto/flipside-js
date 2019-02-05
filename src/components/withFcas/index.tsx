import {
  h,
  Component,
  AnyComponent,
  ComponentFactory,
  ComponentChildren,
  Ref,
  RenderableProps
} from "preact";
import API from "../../api";

type Data = {
  asset_name: string;
  percent_change: number;
  slug: string;
  symbol: string;
  value: number;
};

type Props = RenderableProps<{
  symbol: string;
  api: API;
}>;

type State = {
  loading: boolean;
  data?: Data;
};

export type WithFcasProps = {
  fcas?: Data;
};

const withFcas = <P extends Props>(C: ComponentFactory<P & WithFcasProps>) => {
  return class WithFcas extends Component<P, State> {
    state = {
      loading: true
    };

    componentDidMount() {
      this.loadData();
    }

    loadData = async () => {
      const { api, symbol } = this.props;
      const { data, success } = await api.fetchAssetMetric(symbol, "FCAS");
      this.setState({ data, loading: false });
    };

    render(props: P, state: State) {
      if (state.loading) return null;
      return <C {...props} fcas={state.data} />;
    }
  };
};

export default withFcas;
