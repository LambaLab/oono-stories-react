import * as React from "react";
import Spinner from "../components/Spinner";
import { Renderer, Tester } from "./../interfaces";
import WithHeader from "./wrappers/withHeader";
import WithSeeMore from "./wrappers/withSeeMore";
import Pause from "../components/Pause";
import Play from "../components/Play";

export const renderer: Renderer = ({ story, action, isPaused, config }) => {
  const [loaded, setLoaded] = React.useState(false);
  const { width, height, loader, storyStyles, pauseStyles } = config;
  let dimensions = {
    'object-fit': story?.width > story?.height ? "contain" : "cover"
  };
  let computedStyles = {
    ...styles.storyContent,
    ...(storyStyles || {}),
    ...(story.styles || {}),
    ...dimensions
  };

  

  const imageLoaded = () => {
    setLoaded(true);
    action("play");
  };

  let pauseComputedStyles = pauseStyles || styles.pauseDefaultStyles;

  const handlePause = () => {
    if(!isPaused){
      action("pause", false);
    }else{
      action("play", false);
    }
  };

  return (
    <WithHeader {...{ story, globalHeader: config.header }}>
      <WithSeeMore {...{ story, action }}>
        <div style={{width:'100%', height:'100%', display: 'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={pauseComputedStyles}
           onClick={handlePause}
           >
            {isPaused ? <Play /> : <Pause /> }
          </div>
          <img style={computedStyles} src={story.url} onLoad={imageLoaded} />
          {!loaded && (
            <div
              style={{
                width: width,
                height: height,
                position: "absolute",
                left: 0,
                top: 0,
                background: "rgba(0, 0, 0, 0.9)",
                zIndex: 9,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#ccc",
              }}
            >
              {loader || <Spinner />}
            </div>
          )}
        </div>
      </WithSeeMore>
    </WithHeader>
  );
};

const styles = {
  story: {
    display: "flex",
    position: "relative",
    overflow: "hidden",
  },
  storyContent: {
    width: "100%",
    height: "100%",
    // maxWidth: "100%",
    // maxHeight: "100%",
    margin: "auto",
  },
  pauseDefaultStyles : {
    position:'absolute',
    top:'34px',
    right: '20px',
    width:'25px',
    height:'25px',
    padding:'3px',
    borderRadius:'50%',
    color:'#000',
    zIndex: '9999999999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fill: "#fff"
  }
};

export const tester: Tester = (story) => {
  return {
    condition: !story.content && (!story.type || story.type === "image"),
    priority: 2,
  };
};

export default {
  renderer,
  tester,
};
