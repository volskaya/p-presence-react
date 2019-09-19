import React, { PureComponent } from "react";
import { css, cx } from "react-emotion";
import throttle from "lodash/throttle";

import * as Style from "./Style";

import Portrait from "./assets/img/portrait.jpg";
import BW from "./assets/img/bw.jpg";
import RustIcon from "./assets/svg/rust.svg";

const container = css({
  position: "relative",
  width: "100%",
  height: "100%",
  boxShadow: "0 10px 16px " + Style.presenceShadow,
  borderRadius: "0.3em",
  overflow: "hidden",
  userSelect: "none",
  transform: "translateZ(0)",
  transition: `transform ${Style.animMedium} ease-out`,

  ":hover": {
    transform: "scale(1.02)"
  }
});

const frame = css({
  position: "absolute",
  overflow: "hidden"
});

const background = css({
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,

  backgroundColor: "#FFFFFF"
});

const grayscale = css({ filter: "grayscale(100%)" });
const picture = css({
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,

  transition: `opacity ${Style.animShort} ease-in-out`,

  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center"
});

const gradientPosition = css({
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
});

const Gradient = (
  <svg
    className={gradientPosition}
    version="1.1"
    viewBox="0 0 250 491"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        id="linearGradient920"
        x1="1047.1"
        x2="78.543"
        y1="882.83"
        y2="882.83"
        gradientTransform="matrix(.25825 0 0 .25142 -19.565 -473.73)"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#121212" offset="0" />
        <stop stopColor="#121212" offset=".10" />
        <stop stopColor="#121212" stopOpacity=".945" offset=".233" />
        <stop stopOpacity=".09" offset=".535" />
        <stop stopOpacity="0" offset="1" />
      </linearGradient>
    </defs>
    <rect
      transform="scale(1,-1)"
      y="-491"
      width="250"
      height="491"
      rx="1.033"
      ry="0"
      fill="url(#linearGradient920)"
      strokeWidth=".25481"
    />
  </svg>
);

export default class DiscordCard extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      accent: props.accent || Style.gold,
      bg: props.bg || Style.presenceBackground,
      dark: props.dark ? "#000000" : "#FFFFFF", // For transparent blocks
      grayscale: props.dark,

      fg: props.fg || Style.presenceLightFg1,
      fg1: props.fg1 || Style.presenceLightFg2,
      workingFg: props.workingFg || null,

      glow: props.glow ? "1" : "0",
      glowColor: props.glowColor || Style.gold,
      gradient: props.gradient || false,

      sized: false,
      pictures: {
        profile: {
          url: Portrait,
          loaded: false,
          ref: React.createRef(),
          radius: "50%",
          width: 0,
          height: 0,
          x: 0,
          y: 0
        },
        project: {
          url: BW,
          loaded: false,
          ref: React.createRef(),
          radius: "4px",
          width: 0,
          height: 0,
          x: 0,
          y: 0
        },
        language: {
          url: RustIcon,
          loaded: true,
          ref: React.createRef(),
          radius: "50%",
          width: 0,
          height: 0,
          x: 0,
          y: 0
        }
      }
    };

    this.card = React.createRef();
    this.listening = false;

    this.recalculatePictures = this.recalculatePictures.bind(this);
    this.recalculate = throttle(this.recalculatePictures, 250);
  }

  loadImage(key) {
    let loader = new Image();

    loader.addEventListener("load", () => {
      const pictures = { ...this.state.pictures };
      pictures[key].loaded = true;

      this.setState({ pictures });
    });

    loader.src = this.state.pictures[key].url;
  }

  componentDidMount() {
    this.recalculatePictures();

    this.loadImage("profile");
    this.loadImage("project");
  }

  // Their container sizes don't change during resize,
  // so only calculate them once in compontentDidUpdate()
  // or after first draw
  recalculatePictures() {
    if (this.state.sized) {
      // Sizes already calculated
      if (this.listening) {
        window.removeEventListener("resize", this.recalculate);
        this.listening = false;
      }

      return;
    }

    const cardRect = this.card.current.getBoundingClientRect();

    // Container's not spawned on small screens
    if (cardRect.x === 0 && cardRect.y === 0) {
      if (!this.listening) {
        // resize listener already set
        window.addEventListener("resize", this.recalculate);
        this.listening = true;
      }

      return;
    }

    const pictures = { ...this.state.pictures };

    Object.keys(pictures).forEach(key => {
      const picture = pictures[key],
        box = picture.ref.current.getBoundingClientRect();

      picture.width = box.width;
      picture.height = box.height;
      picture.x = box.x - cardRect.x;
      picture.y = box.y - cardRect.y;
      picture.valid = true;
    });

    this.setState({ sized: true });
  }

  getFrameStyle(key) {
    return {
      left: this.state.pictures[key].x,
      top: this.state.pictures[key].y,
      width: this.state.pictures[key].width,
      height: this.state.pictures[key].height,
      borderRadius: this.state.pictures[key].radius || "50%"
    };
  }

  getPictureStyle(key) {
    return {
      opacity: this.state.pictures[key].loaded ? 1 : 0,
      backgroundImage: this.state.pictures[key].loaded
        ? `url(${this.state.pictures[key].url})`
        : ""
    };
  }

  render() {
    const profileFrame = this.getFrameStyle("profile");
    const profilePicture = this.getPictureStyle("profile");

    const projectFrame = this.getFrameStyle("project");
    const projectPicture = this.getPictureStyle("project");

    const languageFrame = this.getFrameStyle("language");
    const languagePicture = this.getPictureStyle("language");

    return (
      <div className={container} ref={this.card}>
        <div className={frame} style={profileFrame}>
          <div
            className={this.state.grayscale ? cx(picture, grayscale) : picture}
            style={profilePicture}
          />
        </div>

        <div className={frame} style={projectFrame}>
          <div className={picture} style={projectPicture} />
        </div>

        <div className={frame} style={languageFrame}>
          <div className={background}>
            <div className={picture} style={languagePicture} />
          </div>
        </div>

        {this.state.gradient && Gradient}

        <svg
          version="1.1"
          viewBox="0 0 250 491"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter
              id="filter9390"
              x="-.24"
              y="-.24"
              width="1.48"
              height="1.48"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="9" />
            </filter>
            <filter
              id="filter9482"
              x="-.18"
              y="-.18"
              width="1.36"
              height="1.36"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="4.8" />
            </filter>
          </defs>
          <g transform="translate(-125,-42)">
            <g transform="translate(125,42)">
              <g transform="translate(0,439)">
                <path
                  d="m0 0h250v48.006a4 4 0 0 1-4 3.994h-242a4 4 0 0 1-4-3.994z"
                  fill={this.state.bg}
                  fillRule="evenodd"
                />
                <path
                  transform="translate(10,10)"
                  d="m5 0h220a5 5 0 0 1 5 5v22a5 5 0 0 1-5 5h-220a5 5 0 0 1-5-5v-22a5 5 0 0 1 5-5z"
                  fill={this.state.dark}
                  opacity=".1"
                />
              </g>
              <rect
                transform="translate(0,182)"
                width="250"
                height="258"
                fill={this.state.bg}
              />
              <g fill={this.state.dark}>
                <g>
                  <rect
                    transform="translate(10,387)"
                    width="70"
                    height="20"
                    rx="5"
                    opacity=".1"
                  />
                  <rect
                    transform="translate(10,325)"
                    width="53"
                    height="20"
                    rx="5"
                    opacity=".1"
                  />
                  <rect
                    transform="translate(10,415)"
                    width="153"
                    height="20"
                    rx="5"
                    opacity=".1"
                  />
                  <rect
                    transform="translate(10,353)"
                    width="41"
                    height="20"
                    rx="5"
                    opacity=".1"
                  />
                </g>
                <rect
                  transform="translate(59,353)"
                  width="70"
                  height="20"
                  rx="5"
                  fillOpacity=".94118"
                  opacity=".1"
                />
                <rect
                  transform="translate(10,304)"
                  width="230"
                  height="1"
                  opacity=".1"
                />
              </g>
              <g transform="translate(10,192)">
                <g transform="translate(0,24)">
                  <rect
                    width="64"
                    height="64"
                    rx="3"
                    fill={this.state.glowColor}
                    opacity={this.state.glow}
                    filter="url(#filter9482)"
                  />
                  <rect
                    ref={this.state.pictures.project.ref}
                    width="64"
                    height="64"
                    opacity="0"
                  />
                  <rect
                    ref={this.state.pictures.language.ref}
                    x="40"
                    y="40"
                    width="30"
                    height="30"
                    rx="15"
                    fill="#fff"
                    opacity="0"
                  />
                </g>
                <g transform="translate(-398,-597)" fontSize="12px">
                  <text
                    transform="translate(474,633)"
                    fill={this.state.fg}
                    fontFamily="Whitney"
                    fontWeight="500"
                  >
                    <tspan x="0" y="0">
                      Visual Studio Code
                    </tspan>
                  </text>
                  <g fontFamily="Whitney" fontWeight="400">
                    <text
                      transform="translate(474,648)"
                      fill={this.state.workingFg || this.state.accent}
                    >
                      <tspan x="0" y="0">
                        Working on Presence
                      </tspan>
                    </text>
                    <text transform="translate(474,678)" fill={this.state.fg1}>
                      <tspan x="0" y="0">
                        00:37 elapsed
                      </tspan>
                    </text>
                    <text transform="translate(474,663)" fill={this.state.fg1}>
                      <tspan x="0" y="0">
                        Pushed 3 of 6
                      </tspan>
                    </text>
                  </g>
                  <text
                    transform="translate(398,609)"
                    fill={this.state.accent}
                    fontFamily="Whitney"
                    fontWeight="700"
                  >
                    <tspan x="0" y="0">
                      PLAYING A GAME
                    </tspan>
                  </text>
                </g>
              </g>
              <path
                d="m0 3.992a4 4 0 0 1 4-3.992h242a4 4 0 0 1 4 3.992v178.01h-250z"
                fill={this.state.accent}
              />
              <rect
                transform="translate(49,138)"
                width="153"
                height="20"
                rx="5"
                fill="#FFFFFF"
                opacity={this.state.grayscale ? ".1" : ".2"}
              />
              <g transform="translate(80,20)">
                <rect
                  width="90"
                  height="90"
                  rx="45"
                  fill={this.state.glowColor}
                  opacity={this.state.glow}
                  filter="url(#filter9390)"
                />
                <rect
                  ref={this.state.pictures.profile.ref}
                  width="90"
                  height="90"
                  opacity="0"
                />
              </g>
            </g>
          </g>
          <path
            d="m75.252 270.75-0.873-0.54c-7e-3 -0.085-0.015-0.17-0.025-0.254l0.75-0.7c0.076-0.071 0.11-0.176 0.09-0.278s-0.092-0.187-0.189-0.223l-0.959-0.359c-0.024-0.083-0.049-0.165-0.075-0.248l0.598-0.831c0.061-0.084 0.073-0.194 0.034-0.291s-0.127-0.165-0.229-0.182l-1.011-0.165c-0.039-0.077-0.08-0.152-0.122-0.227l0.425-0.933c0.043-0.095 0.035-0.205-0.024-0.292s-0.155-0.137-0.26-0.133l-1.026 0.036c-0.053-0.066-0.107-0.132-0.162-0.197l0.236-1c0.024-0.102-6e-3 -0.208-0.08-0.282s-0.18-0.104-0.281-0.08l-0.999 0.236c-0.065-0.055-0.131-0.109-0.197-0.162l0.036-1.026c4e-3 -0.104-0.047-0.203-0.133-0.26s-0.197-0.067-0.291-0.024l-0.933 0.425c-0.075-0.041-0.151-0.082-0.227-0.122l-0.165-1.011c-0.017-0.103-0.085-0.19-0.182-0.229s-0.206-0.027-0.29 0.034l-0.831 0.598c-0.082-0.026-0.164-0.051-0.247-0.075l-0.359-0.959c-0.036-0.098-0.121-0.17-0.223-0.19s-0.207 0.014-0.278 0.09l-0.7 0.751c-0.084-9e-3 -0.169-0.018-0.254-0.025l-0.54-0.873c-0.055-0.088-0.152-0.142-0.256-0.142s-0.201 0.054-0.255 0.142l-0.54 0.873c-0.085 7e-3 -0.17 0.016-0.255 0.025l-0.7-0.751c-0.071-0.076-0.176-0.11-0.278-0.09s-0.187 0.092-0.223 0.19l-0.359 0.959c-0.083 0.024-0.165 0.049-0.247 0.075l-0.831-0.598c-0.085-0.061-0.195-0.074-0.291-0.034s-0.165 0.127-0.181 0.229l-0.165 1.011c-0.076 0.039-0.152 0.08-0.227 0.122l-0.933-0.425c-0.095-0.043-0.205-0.034-0.292 0.024s-0.137 0.156-0.133 0.26l0.036 1.026c-0.066 0.053-0.132 0.107-0.197 0.162l-1-0.236c-0.101-0.024-0.208 7e-3 -0.281 0.08s-0.104 0.18-0.08 0.282l0.236 1c-0.055 0.065-0.109 0.13-0.162 0.197l-1.026-0.036c-0.104-3e-3 -0.202 0.047-0.26 0.133s-0.067 0.197-0.024 0.292l0.425 0.933c-0.041 0.075-0.082 0.15-0.122 0.227l-1.011 0.165c-0.103 0.017-0.189 0.085-0.229 0.182s-0.027 0.206 0.034 0.291l0.598 0.831c-0.026 0.082-0.051 0.165-0.075 0.248l-0.959 0.359c-0.097 0.036-0.169 0.121-0.189 0.223s0.014 0.207 0.09 0.278l0.75 0.7c-9e-3 0.085-0.018 0.169-0.025 0.254l-0.873 0.54c-0.088 0.055-0.142 0.151-0.142 0.256s0.054 0.201 0.142 0.255l0.873 0.54c7e-3 0.085 0.016 0.17 0.025 0.254l-0.75 0.7c-0.076 0.071-0.11 0.176-0.09 0.278s0.092 0.186 0.189 0.223l0.959 0.359c0.024 0.083 0.049 0.166 0.075 0.248l-0.598 0.831c-0.061 0.085-0.074 0.194-0.034 0.29s0.127 0.165 0.229 0.182l1.011 0.165c0.039 0.077 0.08 0.152 0.122 0.227l-0.425 0.932c-0.043 0.095-0.034 0.205 0.024 0.292s0.157 0.137 0.26 0.133l1.026-0.036c0.053 0.067 0.107 0.132 0.162 0.197l-0.236 1c-0.024 0.102 6e-3 0.207 0.08 0.281s0.18 0.104 0.281 0.08l1-0.235c0.065 0.055 0.131 0.109 0.197 0.162l-0.036 1.027c-4e-3 0.104 0.047 0.203 0.133 0.26s0.197 0.067 0.292 0.023l0.933-0.425c0.075 0.042 0.151 0.082 0.227 0.122l0.165 1.011c0.017 0.103 0.085 0.19 0.182 0.229s0.206 0.027 0.291-0.033l0.831-0.599c0.082 0.026 0.165 0.051 0.248 0.075l0.359 0.959c0.036 0.097 0.121 0.169 0.223 0.189s0.207-0.014 0.278-0.09l0.7-0.75c0.084 0.01 0.17 0.018 0.255 0.025l0.54 0.873c0.054 0.088 0.151 0.142 0.255 0.142s0.201-0.054 0.255-0.142l0.54-0.873c0.085-7e-3 0.17-0.016 0.254-0.025l0.7 0.75c0.071 0.076 0.176 0.11 0.278 0.09s0.186-0.092 0.223-0.189l0.359-0.959c0.083-0.024 0.166-0.049 0.248-0.075l0.831 0.599c0.084 0.061 0.194 0.073 0.29 0.033s0.165-0.127 0.182-0.229l0.165-1.011c0.076-0.04 0.152-0.081 0.227-0.122l0.933 0.425c0.095 0.043 0.205 0.035 0.291-0.023s0.137-0.156 0.133-0.26l-0.036-1.027c0.066-0.053 0.132-0.107 0.197-0.162l1 0.235c0.101 0.024 0.208-6e-3 0.281-0.08s0.104-0.18 0.08-0.281l-0.235-1c0.055-0.065 0.109-0.13 0.162-0.197l1.026 0.036c0.104 4e-3 0.203-0.046 0.26-0.133s0.067-0.197 0.023-0.292l-0.425-0.932c0.041-0.075 0.082-0.151 0.122-0.227l1.011-0.165c0.103-0.016 0.189-0.085 0.229-0.182s0.027-0.206-0.034-0.29l-0.598-0.831c0.026-0.082 0.051-0.165 0.075-0.248l0.959-0.359c0.097-0.037 0.169-0.121 0.189-0.223 0.021-0.102-0.013-0.207-0.09-0.278l-0.75-0.7c9e-3 -0.085 0.017-0.169 0.025-0.254l0.873-0.54c0.088-0.054 0.142-0.151 0.142-0.255s-0.054-0.201-0.142-0.256zm-5.843 7.241c-0.333-0.072-0.545-0.401-0.474-0.735s0.4-0.547 0.733-0.474c0.334 0.071 0.546 0.4 0.474 0.734s-0.4 0.546-0.733 0.475zm-0.297-2.006c-0.304-0.065-0.603 0.128-0.668 0.433l-0.31 1.447c-0.957 0.434-2.018 0.675-3.137 0.675-1.144 0-2.229-0.253-3.203-0.706l-0.31-1.446c-0.065-0.304-0.364-0.498-0.668-0.433l-1.277 0.274c-0.237-0.244-0.457-0.504-0.66-0.778h6.213c0.07 0 0.117-0.013 0.117-0.077v-2.198c0-0.064-0.047-0.077-0.117-0.077h-1.817v-1.393h1.965c0.179 0 0.959 0.051 1.208 1.048 0.078 0.306 0.25 1.304 0.367 1.623 0.117 0.358 0.592 1.073 1.099 1.073h3.096c0.035 0 0.073-4e-3 0.112-0.011-0.215 0.292-0.45 0.568-0.704 0.826l-1.306-0.281zm-8.592 1.976c-0.333 0.072-0.662-0.141-0.733-0.475s0.141-0.663 0.474-0.735c0.333-0.071 0.662 0.141 0.733 0.475s-0.141 0.663-0.474 0.735zm-2.357-9.557c0.138 0.312-2e-3 0.678-0.314 0.816s-0.676-2e-3 -0.815-0.315c-0.138-0.312 2e-3 -0.677 0.314-0.816s0.676 2e-3 0.815 0.315zm-0.724 1.717 1.33-0.591c0.284-0.126 0.412-0.459 0.286-0.744l-0.274-0.62h1.077v4.856h-2.174c-0.189-0.663-0.29-1.362-0.29-2.085 0-0.276 0.015-0.549 0.043-0.817zm5.837-0.471v-1.431h2.566c0.133 0 0.936 0.153 0.936 0.754 0 0.499-0.616 0.677-1.123 0.677zm9.323 1.288c0 0.19-7e-3 0.378-0.021 0.564h-0.78c-0.078 0-0.11 0.051-0.11 0.128v0.358c0 0.843-0.476 1.027-0.892 1.073-0.397 0.045-0.837-0.166-0.891-0.409-0.234-1.316-0.624-1.597-1.24-2.083 0.765-0.485 1.56-1.201 1.56-2.16 0-1.035-0.71-1.687-1.193-2.006-0.679-0.447-1.43-0.537-1.632-0.537h-8.067c1.094-1.221 2.576-2.085 4.253-2.4l0.951 0.998c0.215 0.225 0.571 0.233 0.796 0.018l1.064-1.018c2.229 0.415 4.117 1.803 5.204 3.707l-0.728 1.645c-0.126 0.285 3e-3 0.618 0.287 0.744l1.402 0.623c0.024 0.249 0.037 0.501 0.037 0.755zm-8.061-8.32c0.246-0.236 0.637-0.227 0.873 0.02s0.226 0.639-0.021 0.874c-0.246 0.236-0.637 0.227-0.873-0.02s-0.226-0.638 0.021-0.874zm7.228 5.816c0.138-0.312 0.503-0.453 0.815-0.315s0.452 0.504 0.314 0.816-0.503 0.453-0.815 0.315-0.452-0.504-0.314-0.816z"
            fill="#444"
          />
        </svg>
      </div>
    );
  }
}
