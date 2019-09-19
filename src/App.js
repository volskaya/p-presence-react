import React, { PureComponent } from "react";
import { css } from "react-emotion";
import throttle from "lodash/throttle";
import * as Style from "./Style";

import Navbar from "./Navbar";
import Description from "./Description";
import Downloads from "./Downloads";
import SocialIcons from "./SocialIcons";
import DiscordCard from "./DiscordCard";

const appContainer = css({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "100vh",
  overflowX: "hidden"
});

const background = css({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: Style.background,
  zIndex: -4
});

const gradient = css(
  {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    opacity: 0.8,
    zIndex: -2,
    background:
      "linear-gradient(45deg, " +
      "#121212 0%, " +
      "#292929 20%, " +
      "#1a1a1a 49%, " +
      "#232323 73%, " +
      "#232323 100%);"
  },
  {
    background: "-moz-linear-gradient(0deg, #212121 100%, #212121 0%)"
  }
);

const containOverflow = css({
  position: "absolute",
  height: "100%",
  left: "0",
  right: "0",
  overflow: "hidden",
  zIndex: "-3"
});

const bigDiscord = css({
  position: "absolute",
  width: 913,
  top: -46,
  right: "50%",
  zIndex: "-3",
  overflow: "hidden"
});

export default class App extends PureComponent {
  constructor() {
    super();
    this.app = React.createRef();
    this.downloads = React.createRef();
    this.discordOverflow = React.createRef();

    this.scaleDiscord = this.scaleDiscord.bind(this);
    this.scaleDiscordThrottled = throttle(this.scaleDiscord, 250);
  }

  componentDidMount() {
    this.scaleDiscord();
    window.addEventListener("resize", this.scaleDiscordThrottled);
  }

  scaleDiscord() {
    this.discordOverflow.current.style.height = window.getComputedStyle(
      this.app.current
    ).height;
  }

  render() {
    return (
      <div className={appContainer} id="app" ref={this.app}>
        <div className={background} />
        <div className={gradient} />

        <div className={containOverflow} ref={this.discordOverflow}>
          <div className={bigDiscord}>
            <DiscordCard
              accent={Style.presenceDarkBg}
              bg={Style.foreground}
              dark={true}
              fg={Style.presenceDarkFg1}
              fg1={Style.presenceDarkFg3}
              fg2={Style.presenceDarkFg1}
              workingFg={Style.presenceDarkFg2}
              glow={true}
              gradient={true}
            />
          </div>
        </div>

        <div>
          <Navbar downloads={this.downloads} />
          <Description />
          <Downloads ref={this.downloads} />
        </div>

        <SocialIcons />
      </div>
    );
  }
}
