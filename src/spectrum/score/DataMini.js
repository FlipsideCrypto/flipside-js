import { h } from "preact";

export default props => {
  return (
    <div class="fs-data-mini">
      FCAS {props.metric.fcas}
      <div
        class={`fs-score-rank fs-score-rank__letter fs-score-rank__letter--mini fs-score-rank__letter--${
          props.rank
        }`}
      >
        {props.rank}
      </div>
    </div>
  );
};
