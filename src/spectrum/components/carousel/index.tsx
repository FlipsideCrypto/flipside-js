import { h, Component, ComponentChildren } from "preact";
import classNames from "classnames";
import * as css from "./style.css";

type Props = {
  mode: "light" | "dark";
  items: any[];
  renderSlide: any;
};

type State = {
  currentSlide: number;
};

export default class Carousel extends Component<Props, State> {
  state = {
    currentSlide: 0
  };

  slideTo = (slide: number) => {
    this.setState({ currentSlide: slide });
  };

  render(props: Props, state: State) {
    const carouselOffset = state.currentSlide * 100;
    const carouselStyle = {
      transform: `translateX(-${carouselOffset}%)`
    };

    return (
      <div class={classNames(css.wrapper, css[props.mode])}>
        <div class={css.carousel} style={carouselStyle}>
          {props.items.map(item => (
            <div class={css.slide}>{props.renderSlide(item)}</div>
          ))}
        </div>

        {props.items.length > 1 && (
          <div class={css.dots}>
            {props.items.map((_, i) => {
              const classes = classNames(css.dotItem, {
                [css.dotActive]: state.currentSlide === i
              });
              return <div class={classes} onClick={() => this.slideTo(i)} />;
            })}
          </div>
        )}
      </div>
    );
  }
}
