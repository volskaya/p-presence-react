import React, { PureComponent } from "react";
import { css, cx } from "react-emotion";

import * as Style from "./Style";

const flexBox = css({
  marginLeft: 16,
  marginRight: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",

  [Style.sm]: {
    marginLeft: "10vw",
    marginRight: "10vw"
  },

  [Style.xl]: {
    marginLeft: "19vw",
    marginRight: "19vw",
    marginBottom: 88
  }
});

const line = cx(
  css({
    paddingBottom: 16,

    [Style.xl]: {
      paddingBottom: 0
    }
  }),
  Style.t19
);

export default class Description extends PureComponent {
  render() {
    return (
      <div className={flexBox}>
        <div className={line}>
          Standalone server, which is called by an extension from your favorite
          editor, to send presence data to Discord.
        </div>

        <div className={line}>
          Presence tracks information based on Git repositories. If theres no
          Git repo associated with the file path, you'll still receive a fancy
          Discord presence, except it will say something like "Working on
          somehting private…"
        </div>
      </div>
    );
  }
}
