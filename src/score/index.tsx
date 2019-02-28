import { h, Component } from "preact";
import withFcas, { WithFcasProps } from "../components/withFcas";
import Trend from "../components/trend";
import Rank from "../components/rank";
import * as css from "./style.css";
import CustomLinks from "../components/customLinks";
import API from "../api";
import { defaultFlipsideLink } from "../utils";

export type Props = {
  symbol: string;
  api: API;
} & WithFcasProps;

const Score = (props: Props) => {
  const { value, percent_change } = props.fcas;
  return (
    <div class={css.wrapper}>
      <div class={css.header}>
        <h5 class={css.fcas}>FCAS</h5>
        <CustomLinks
          widget="score"
          api={props.api}
          linkClass={css.link}
          style={{ flexGrow: 0 }}
        />
      </div>

      <div class={css.score}>
        <h2 class={css.value}>{value}</h2>
        <a href={defaultFlipsideLink(props.api.key)}>
          <Rank kind="large" score={value} />
        </a>
      </div>

      <div class={css.change}>
        7D
        <Trend change={percent_change} value={value} class={css.trend} />
        <span class={percent_change >= 0 ? css.up : css.down}>
          {percent_change}%
        </span>
      </div>
    </div>
  );
};

Score.defaultProps = {
  symbol: "btc"
};

export default withFcas(Score);
