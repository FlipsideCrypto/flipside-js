import { h, Component } from "preact";
import withFcas, { WithFcasProps } from "../components/withFcas";
import Trend from "../components/trend";
import Rank from "../components/rank";

export type Props = { symbol: string } & WithFcasProps;

const Score = (props: Props) => {
  const { value, percent_change } = props.fcas;
  return (
    <div>
      <h1>FCAS</h1>
      <a href="#">What's this?</a>
      <h2>{props.fcas.value}</h2>
      <Rank score={value} />
      <p>
        7D
        <Trend change={percent_change} value={value} />
      </p>
      {props.fcas.percent_change}%
    </div>
  );
};

Score.defaultProps = {
  symbol: "btc"
};

export default withFcas(Score);
