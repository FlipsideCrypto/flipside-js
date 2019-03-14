import { h } from "preact";
import * as css from "./style.css";

const NoDataMessage = () => (
  <p class={css.wrapper}>
    Flipside Crypto does not currently track FCAS for this coin due to limited
    data. In the event you are interested in discussing this coin, please
    contact <a href="mailto:data@flipsidecrypto.com">data@flipsidecrypto.com</a>
    .
  </p>
);

export default NoDataMessage;
