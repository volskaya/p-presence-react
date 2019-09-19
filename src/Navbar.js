import React, { PureComponent } from "react";
import { css, cx } from "react-emotion";
import * as Style from "./Style";

import Square from "./Square";

const container = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  marginTop: 32,
  marginBottom: 32,
  width: "100vw",

  [Style.lg]: {
    marginTop: 64,
    marginBottom: 64
  }
});

const item = css({
  textAlign: "center",
  verticalAlign: "middle",
  paddingLeft: 32,
  paddingRight: 32,
  cursor: "pointer",
  textDecoration: "none",
  color: Style.foreground,
  userSelect: "none",
  transition: Style.animShort,
  transitionTimingFunction: "ease-out",

  ":active": {
    opacity: 0.5,
    color: Style.foreground
  },

  ":hover": {
    opacity: 1,
    color: Style.goldBright
  },

  [Style.sm]: {
    display: "inline-block"
  }
});

const sideButton = cx(
  css({
    display: "none",
    opacity: 0.5
  }),
  item,
  Style.t22
);

const middleButton = cx(
  css({
    display: "inline-block",
    opacity: 1
  }),
  item,
  Style.t32
);

const sideBorder = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  [Style.sm]: {
    borderLeft: "2px solid " + Style.gold,
    borderRight: "2px solid " + Style.gold
  }
});

export default class Navbar extends PureComponent {
  constructor(props) {
    super(props);

    this.flashDownloads = this.flashDownloads.bind(this);
  }

  flashDownloads() {
    try {
      this.props.downloads.current.glowStart();
    } catch (error) {
      // Do nothing
    }
  }

  render() {
    return (
      <div className={container}>
        <div
          className={sideButton}
          href="https://github.com/volskaya/presence-react"
        >
          Repository
        </div>

        <div className={sideBorder}>
          <div className={middleButton}>Presence</div>

          <Square />
        </div>

        <div className={sideButton} onClick={this.flashDownloads}>
          Extensions
        </div>
      </div>
    );
  }
}
