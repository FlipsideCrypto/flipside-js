import { h } from "preact";

export default ({ opts, metric, rank }) => {
  return (
    <div class="fs-data-mini">
      FCAS {metric.fcas}
      <div
        class={`fs-rank fs-rank__letter fs-rank__letter--mini fs-rank__letter--${rank}`}
      >
        {rank}
      </div>
    </div>
  );
};
