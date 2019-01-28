import { h } from "preact";

export default props => {
  return (
    <div class="fs-data-mini">
      FCAS {props.metric.fcas}
      <div
        class={`fs-rank fs-rank__letter fs-rank__letter--mini fs-rank__letter--${
          props.rank
        }`}
      >
        {props.rank}
      </div>
    </div>
  );
};
