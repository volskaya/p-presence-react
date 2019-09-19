/* eslint-disable no-unused-expressions */

import React, { PureComponent } from "react";
import MediaQuery from "react-responsive";
import { css, cx, keyframes } from "react-emotion";
import throttle from "lodash/throttle";
import * as Style from "./Style";

import DiscordCard from "./DiscordCard";
import Square from "./Square";

const container = css({
  position: "relative",
  width: "100%",
  display: "flex",
  justifyContent: "flex-end"
});

const discord = css({
  display: "none",
  width: 250,
  height: 491,
  marginRight: 64,

  [Style.xl]: {
    display: "block"
  }
});

const downloadsContainer = css({
  position: "relative",
  width: "100%",
  height: "100%",
  marginTop: 32,
  marginRight: 16,
  marginLeft: 16,

  [Style.xl]: {
    marginTop: 46,
    width: "53%"
  }
});

const titles = css({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  marginBottom: 32,

  [Style.xl]: {
    paddingLeft: 16,
    justifyContent: "left"
  }
});

const title = props =>
  cx(
    css({
      position: "relative",
      marginLeft: 16,
      marginRight: 16,
      color: props.disabled ? Style.red : Style.foreground,
      opacity: props.toggled ? 1 : 0.5,
      cursor: "pointer",
      transition: Style.animShort,
      userSelect: "none",
      transitionTimingFunction: "ease-out",

      ":hover": {
        color: props.disabled ? Style.redBright : Style.goldBright,
        opacity: 1
      }
    }),
    Style.t22
  );

const titleSquareBox = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
});

const error = props =>
  css({
    position: "fixed",
    bottom: 0,
    right: 0,
    left: 0,
    height: "10vh",
    display: "flex",
    alignContent: "center",
    transform: props.toggled ? "translateY(0)" : "translateY(10vh)",
    opacity: props.toggled ? 1 : 0,
    backgroundColor: Style.redBright,
    transition: Style.animMedium,
    transitionTimingFunction: "ease-in-out",
    margin: "auto",
    zIndex: 4,
    userSelect: "none",

    [Style.xl]: {
      width: 400,
      height: 64,
      bottom: "unset",
      left: "unset",
      top: 36,
      right: 36,
      transform: props.toggled ? "translateY(0)" : "translateY(-100px)",
      marginBottom: 0,
      borderRadius: 2,
      boxShadow: Style.shadow,
      fontSize: "0.82em"
    }
  });

const errorMessage = css({
  margin: "auto"
});

// Info section
const infoContainer = css({
  position: "relative",
  width: "100%",
  height: "100%",
  marginTop: 16,

  [Style.xl]: {
    textAlign: "left"
  }
});

const infoTitle = cx(
  css({
    marginBottom: 8
  }),
  Style.t22
);

const infoList = cx(
  css({
    padding: "none",
    marginTop: 0,
    marginBottom: 16,
    paddingLeft: 0,
    color: Style.faded,
    listStyleType: "none",

    "& li": {
      marginBottom: 4
    },

    [Style.xl]: {
      paddingLeft: 32
    }
  }),
  Style.t19,
  css({
    fontWeight: "400"
  })
);

const infoLink = css({
  color: Style.gold,
  textDecoration: "none",
  transition: Style.animShort,
  transitionTimingFunction: "ease-out",

  ":active": {
    color: Style.gold
  },

  ":hover": {
    color: Style.goldBright
  }
});

const glowAnim = keyframes({
  "0%": {
    opacity: 1
  },
  "100%": {
    opacity: 0
  }
});

const glowContainer = css({
  position: "absolute",
  width: "100%",
  height: "100%",
  opacity: 0,
  outline: "solid 16px " + Style.gold,
  backgroundColor: Style.gold
});

export default class Downloads extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      active: 0,
      vimError: false,
      squareX: 0,
      glow: false
    };

    this.buttons = {
      0: {
        // Vscode
        ref: React.createRef(),
        x: 0
      },
      1: {
        // Emacs
        ref: React.createRef(),
        x: 0
      }
    };

    // For vim warning
    this.errorTimer = null; // Holds "setTimer" from compontentDidUpdate()

    this.activate0 = this.setActive.bind(this, 0);
    this.activate1 = this.setActive.bind(this, 1);

    this.showVimError = this.showVimError.bind(this);
    this.hideVimError = this.hideVimError.bind(this);

    this.calculateButtonPositions = this.calculateButtonPositions.bind(this);

    // For download flash
    this.glowContainer = React.createRef();
    this.glowStart = this.glowStart.bind(this);
    this.glowOnStart = this.glowOnStart.bind(this);
    this.glowOnEnd = this.glowOnEnd.bind(this);

    this.activeTitle = title({ toggled: true });
    this.title = title({ toggled: false });
    this.vimError = title({ disabled: true });
  }

  componentDidMount() {
    this.calculateButtonPositions();

    // FIXME: Maybe get rid of the responsive "Vscode - Visual Studio Code"
    // so this event listener doesn't have to recalculate sizes here
    window.addEventListener(
      "resize",
      throttle(this.calculateButtonPositions, 250, { trailing: true })
    );
  }

  componentDidUpdate() {
    if (this.state.vimError) {
      clearTimeout(this.errorTimer);
      this.errorTimer = setTimeout(this.hideVimError, Style.errorTime);
    }
  }

  setActive(id) {
    this.setState(
      {
        active: id
      },
      () => this.calculateButtonPositions()
    );
  }

  showVimError() {
    this.setState({ vimError: true });
  }

  hideVimError() {
    clearTimeout(this.errorTimer);
    this.setState({ vimError: false });
  }

  glowStart() {
    if (this.state.glow) {
      // Restarts animation
      const oldAnim = this.glowContainer.current.style.animation;

      this.glowContainer.current.style.animation = "unset";
      this.glowContainer.current.offsetHeight; // Reflow
      this.glowContainer.current.style.animation = oldAnim;

      return;
    }

    this.glowOnStart();
    this.setState({ glow: true });
  }

  glowOnStart() {
    this.glowContainer.current.addEventListener("animationend", this.glowOnEnd);
  }

  glowOnEnd() {
    this.glowContainer.current.removeEventListener(
      "animationend",
      this.glowOnEnd
    );
    this.setState({ glow: false });
  }

  // Calculates middle X for buttons, used for square animation
  calculateButtonPositions() {
    const vscodeBox = this.buttons[0].ref.current.getBoundingClientRect(),
      emacsBox = this.buttons[1].ref.current.getBoundingClientRect();

    this.buttons[1].x =
      emacsBox.x - vscodeBox.x - vscodeBox.width / 2 + emacsBox.width / 2;

    if (this.buttons[this.state.active].x !== this.state.squareX) {
      this.setState({
        squareX: this.buttons[this.state.active].x
      });
    }
  }

  renderVscodeInfo() {
    return (
      <div className={infoContainer}>
        <div className={infoTitle}>Package available in Extensions</div>
      </div>
    );
  }

  renderEmacsInfo() {
    return (
      <div className={infoContainer}>
        <div className={infoTitle}> Download from Melpa or Github </div>

        <div className={infoList}>
          <li>
            <a className={infoLink} href="https://melpa.org">
              Melpa
            </a>
          </li>
          <li>
            <a className={infoLink} href="https://github.com">
              Github
            </a>
          </li>
        </div>

        <div className={infoTitle}>Installation</div>

        <div className={infoList}>
          <li>
            <span
              className={css`
                color: ${Style.gold};
              `}
            >
              TODO
            </span>
            : Add (load! "presence-mode.el") to your default config
          </li>
        </div>

        <div className={infoTitle}>Options</div>

        <div className={infoList}>
          <li>presence--application-id</li>
          <li>presence--port</li>
          <li>presence--custom-repo-icons</li>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={container}>
        <div className={discord}>
          <DiscordCard />
        </div>

        <div className={downloadsContainer}>
          <div
            className={glowContainer}
            ref={this.glowContainer}
            style={{
              animation: this.state.glow
                ? `${glowAnim} ${Style.animLong} ease-out`
                : "unset"
            }}
          />

          <div
            className={error({ toggled: this.state.vimError })}
            onClick={this.hideVimError}
          >
            <div className={cx(errorMessage, Style.t22)}>
              Vim extension isn't made yet
            </div>
          </div>

          <div className={titles}>
            <div className={titleSquareBox}>
              <div
                ref={this.buttons[0].ref}
                className={
                  this.state.active === 0 ? this.activeTitle : this.title
                }
                title="Visual Studio Code"
                onClick={this.activate0}
              >
                <MediaQuery query={`(max-width: ${Style.mdpx})`}>
                  Vscode
                </MediaQuery>
                <MediaQuery query={`(min-width: ${Style.mdpx})`}>
                  Visual Studio Code
                </MediaQuery>
              </div>

              <Square x={this.state.squareX} />
            </div>

            <div
              ref={this.buttons[1].ref}
              className={
                this.state.active === 1 ? this.activeTitle : this.title
              }
              title="Emacs"
              onClick={this.activate1}
            >
              Emacs
            </div>

            <div
              id="vim-button"
              className={this.vimError}
              title="Vim"
              onClick={this.showVimError}
            >
              Vim
            </div>
          </div>

          {this.state.active === 0 && this.renderVscodeInfo()}
          {this.state.active === 1 && this.renderEmacsInfo()}
        </div>
      </div>
    );
  }
}
