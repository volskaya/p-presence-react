Tiny landing page for a [Discord](https://discordapp.com) code editor extension. Written with [React](https://reactjs.org) and [Emotion](https://emotion.sh) css in js library.

The extension acts as a server between Discord's [Rich Presence](https://discordapp.com/rich-presence) and a client extension in your favorite code editor. 
The client dispatches file paths from your editors active buffer, which the server uses for scouting git repos. If a repository is found, the server parses it using [libgit2](https://libgit2.org/) and updates your presence with something like **"Working on Presence, Ahead by 5 commits"**

![screenshot](https://raw.githubusercontent.com/volskaya/presence-react/master/data/screenshot.jpg "Screenshot")

###### Work in progress