import React, { Suspense, useState } from "react";
import "./App.css";

const StoriesLazy = React.lazy(() => import("react-insta-stories"));
const WithSeeMore = React.lazy(() =>
  import("react-insta-stories").then((module) => ({
    default: module.WithSeeMore,
  }))
);

function App() {

  const [paused, setPaused] = useState(false);

  return (
    <div className="App">
      <div className="left" style={{display:'none'}}>
        <h2>
          <code>
            <a
              rel="noopener noreferrer"
              href="https://www.npmjs.com/package/react-insta-stories"
              target="_blank"
            >
              react-insta-stories
            </a>
            <br />
            <a href="https://www.npmjs.com/package/react-insta-stories">
              <img
                alt="NPM"
                src="https://img.shields.io/npm/v/react-insta-stories.svg"
              />
            </a>
          </code>
        </h2>
        <p>Create Instagram like stories on the web using React</p>
        <br />
        <code style={{ marginTop: 10, marginBottom: 10 }}>
          <span
            style={{
              background: "#eee",
              padding: 5,
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 5,
              width: "auto",
            }}
          >
            npm i react-insta-stories
          </span>
        </code>
        <p>
          <a href="https://github.com/mohitk05/react-insta-stories#react-insta-stories">
            Documentation →
          </a>
        </p>
        <p>
          Made with ♥ by{" "}
          <a
            rel="noopener noreferrer"
            href="https://github.com/mohitk05/react-insta-stories"
            target="_blank"
          >
            @mohitk05
          </a>
        </p>
        <div
          style={{
            background: "#eee",
            padding: 5,
            paddingLeft: 10,
            paddingRight: 10,
            borderRadius: 5,
            width: "auto",
          }}
        >
          <p>◀ Tap left for previous story</p>
          <p>▶︎ Tap right for next story</p>
          <p>◉ Press and hold to pause</p>
        </div>
        <br />
        <div className="updates">
          <p>
            <mark>
              <b>Updates [V2.5.0]</b>
            </mark>
          </p>
          <p>
            1. React 18 progress bar bug fix (
            <a href="https://github.com/mohitk05/react-insta-stories/issues/214">
              #214 and others
            </a>
            )
          </p>
          <p>
            <mark>
              <b>Updates [V2.2.2]</b>
            </mark>
          </p>
          <p>
            1. Server-side rendering bug fix (
            <a href="https://github.com/mohitk05/react-insta-stories/issues/51">
              #51 and others
            </a>
            )
          </p>
          <p>
            <mark>
              <b>Updates [V2.2.1]</b>
            </mark>
          </p>
          <p>
            1. Bug fixes (
            <a href="https://github.com/mohitk05/react-insta-stories/issues/130">
              #130
            </a>
            )
          </p>
          <p>
            <mark>
              <b>Updates [V2.1.2]</b>
            </mark>
          </p>
          <p>
            1. Pass in renderers to switch story UI according to certain
            conditions
          </p>
          <p>
            2. Internal code structure changed keeping in mind long-term
            maintainability
          </p>
          <p>3. Community based pluggable renderers possible now</p>
          <p>4. Optional keyboard navigation</p>
          <p>5. Bug fixes</p>
          <p>
            <a href="https://github.com/mohitk05/react-insta-stories/pull/80">
              Read more here →
            </a>
          </p>
          <br></br>
          <p>
            <mark>
              <b>Updates [V2.0.0]</b>
            </mark>
          </p>
          <p>1. Render your own components/JSX in stories</p>
          <p>
            2. Create multiple instances to recreate stories by multiple users
            easily, jump to stories using props
          </p>
          <p>3. Prop based control, event callbacks</p>
          <p>4. Custom JSX gives control to pause/play story</p>
          <p>5. (for devs) TypeScript 🎉</p>
          <p>6. (for devs) Updated for easier feature additions, hooks</p>
          <br></br>
          <p>
            <mark>
              <b>Updates [V1.4.1]</b>
            </mark>
          </p>
          <p>1. Stories stretch to fill screen by default</p>
          <p>2. Style story content using 'storyStyles' prop 💅</p>
          <p>3. Add individual styling to each story</p>
          <br />
          <p>
            <mark>
              <b>Updates [V1.4.0]</b>
            </mark>
          </p>
          <p>1. 'See more' feature added 🤳</p>
          <p>2. Video playback fixes</p>
          <br />
          <p>
            <mark>
              <b>Updates [V1.3.0]</b>
            </mark>
          </p>
          <p>1. Video support added 🎉</p>
          <p>2. babel-polyfill error fix 👾</p>
          <p>3. Changed progress animation to plain CSS</p>
          <br />
          <p>
            <mark>
              <b>Updates [V1.2.0]</b>
            </mark>
          </p>
          <p>1. Now you can add a header to the story</p>
          <p>2. Image aspect ratio retained if story size changed (fix)</p>
        </div>
        <br />
        <p>
          Know more about me here:{" "}
          <a
            rel="noopener noreferrer"
            href="https://mohitkarekar.com"
            target="_blank"
          >
            mohitkarekar.com
          </a>
        </p>
      </div>
      <div className="stories">
        <Suspense>
          <div>
            <button onClick={() => {setPaused(!paused)}}>{paused ? "play" : "pause"}</button>
          </div>
          <StoriesLazy
            preloadCount={3}
            loop
            keyboardNavigation
            defaultInterval={8000}
            stories={stories2}
            
            //onStoryEnd={(s, st) => console.log("story ended", s, st)}
            //onAllStoriesEnd={(s, st) => console.log("all stories ended", s, st)}
            //onStoryStart={(s, st) => console.log("story started", s, st)}
            //onNext={() => console.log("next button pressed")}
            //onPrevious={() => console.log("previous button pressed")}
            storyContainerStyles={{ borderRadius: 8, overflow: "hidden" }}
            isPaused={paused}
            isMuted={false}
            muteStyles={{
              position:'absolute',
              top:'34px',
              right: '70px',
              width:'26px',
              height:'26px',
              padding:'0px',
              borderRadius:'50%',
              color:'#000',
              zIndex: '9999999999',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMute={() =>{console.log("mute callback")}}
            onPause={(data) =>{setPaused(data)}}
          />
        </Suspense>
      </div>
    </div>
  );
}


const stories2 = [
  {
    url: 'https://909915810.oono.ai/uploads/909915810/76/IMG_7482.MOV',
    type: 'video'
  },
  {
    url: 'https://oono.oono.ai/uploads/oono/236/photo_2024-02-14_14-15-57.jpg',
    type:'image'
  },
  {
    url: 'https://oono.oono.ai/uploads/oono/246/example2.jpg',
    type:'image'
  },
  {
    url: 'https://oono.oono.ai/uploads/oono/238/example.jpg',
    type: 'image',
    width: 450,
    height: 318
  },
  
  {
    url: 'https://909915810.oono.ai/uploads/909915810/76/IMG_7482.MOV',
    type: 'video'
  },
  {
    url: 'https://899470041.oono.ai/uploads/899470041/13/IMG_4478.MOV',
    type: 'video'
  },
  {
    url: 'https://899470041.oono.ai/uploads/899470041/14/IMG_4481.MOV',
    type: 'video'
  },
  {
    url: 'https://899470041.oono.ai/uploads/899470041/15/0212.mp4',
    type: 'video'
  },
 
  
];

const image = {
  display: "block",
  maxWidth: "100%",
  borderRadius: 4,
};

const code = {
  background: "#eee",
  padding: "5px 10px",
  borderRadius: "4px",
  color: "#333",
};

const contentStyle = {
  background: "#333",
  width: "100%",
  padding: 20,
  color: "white",
  height: "100%",
};

const customSeeMore = {
  textAlign: "center",
  fontSize: 14,
  bottom: 20,
  position: "relative",
};

export default App;
