import React, { PureComponent } from "react";
import { css } from "react-emotion";
import * as Style from "./Style";

const square = css({
  position: "absolute",
  backgroundColor: Style.gold,
  width: 8,
  height: 8,
  bottom: -16,
  transition: Style.animMedium,
  transitionTimingFunction: "ease-in-out",
  backfaceVisibility: "hidden"
});

export default class Square extends PureComponent {
  render() {
    return (
      <div
        className={square}
        style={{ transform: `translateX(${this.props.x || 0}px)` }}
      />
    );
  }
}
