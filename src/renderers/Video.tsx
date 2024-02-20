import * as React from "react";
import Spinner from "../components/Spinner";
import { GlobalCtx, Renderer, Tester } from "./../interfaces";
import WithHeader from "./wrappers/withHeader";
import WithSeeMore from "./wrappers/withSeeMore";
import Volume from "../components/Volume";
import Mute from "../components/Mute";
import GlobalContext from "../context/Global";

export const renderer: Renderer = ({
  story,
  action,
  isPaused,
  config,
  messageHandler,
}) => {
  const { width, height, loader, storyStyles, isMuted, muteStyles } = config;

  const {
    onMute,
  } = React.useContext<GlobalCtx>(GlobalContext);

  const [muted, setMuted] = React.useState(isMuted);
  const [pause, setPause] = React.useState(isPaused);
  let vid = React.useRef<HTMLVideoElement>(null);
  let vidProgress = React.useRef(0);
  let loaded = React.useRef(false);

  let computedStyles = {
    ...styles.storyContent,
    ...(storyStyles || {}),
  };

  let muteComputedStyles = muteStyles || styles.muteDefaultStyles


  React.useEffect(() => {
    if (vid.current) {
      if (isPaused) {
        vid.current.pause();
        action("pause", true);
      } else {
        play()
      }
    }
  }, [isPaused]);

  

  const onWaiting = () => {
    console.log("waiting")
    loaded.current = false;
    if (vid.current) {
      vid.current.pause();
    }
    action("pause", true);
    //setPause(true);
    
  };
  const onError = () => {
    console.log("error playing video")
    loaded.current = false;
    action("pause", true);
    //setPause(true);
    play()
  };
  

  const play = () => {
    console.log("can play ")
    console.log("isPaused ", isPaused)
    if(isPaused){
      return;
    }
    loaded.current = true;
    vid.current
      .play()
      .then(() => {
        if(isPaused){
          return;
        }
        action("play");
        loaded.current = true;
        //setPause(false);
      })
      .catch(() => {
        setMuted(true);
        onWaiting();
      });
  };

  const onPlaying = () => {
    console.log("on playing")
    
    play();
    //setPause(false);
  };

  const onSuspend = () => {
    //console.log("on suspend")
    onPlaying()
  };

  const videoLoaded = () => {
    console.log("video loaded", vid.current.duration)
    messageHandler("UPDATE_VIDEO_DURATION", { duration: vid.current.duration });
    loaded.current = true;
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      if(!loaded.current){
        return false;
      }
      // if(vid.current.currentTime > vidProgress.current){
        vidProgress.current = vid.current.currentTime;
        if (vid.current.networkState === vid.current.NETWORK_LOADING) {
          // The user agent is actively trying to download data.
          //console.log('on wait not triggered')
          onWaiting();
          
        }
        
        if (vid.current.readyState < vid.current.HAVE_FUTURE_DATA) {
            // There is not enough data to keep playing from this point
            //console.log('on wait triggered')
            onWaiting();
        }
      
    }, 100)

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    onMuteCallback();
  }, [muted]);

  
  const onMuteCallback = () => {
    onMute && onMute(muted);
  };

  return (
    <WithHeader {...{ story, globalHeader: config.header }}>
      <WithSeeMore {...{ story, action }}>
        <div style={styles.videoContainer} className="video-container">
          <div style={muteComputedStyles}
           onClick={() => { setMuted(!muted) }}
           >
            {muted ? <Mute /> : <Volume /> }
          </div>
          <video
            preload='auto'
            ref={vid}
            style={computedStyles}
            controls={false}
            onLoadedData={videoLoaded}
            playsInline
            onWaiting={onWaiting}
            onPlaying={onPlaying}
            onCanPlay={play}
            muted={muted}
            autoPlay
            webkit-playsinline="true"
            src={story.url}
            className="test-class"
            onError={onError}
            //onLoadStart={() => {console.log("on load start")}}
            //onLoad={() => {console.log("on load")}}
            
            onSuspend={onSuspend}
            onStalled={() => {console.log("stalled")}}
            
            
            
          >
          </video>
          
          {!loaded.current && (
            <div
              style={{
                width: width,
                height: height,
                position: "absolute",
                left: 0,
                top: 0,
                background: "rgba(0, 0, 0, 0.4)",
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
  storyContent: {
    width: "auto",
    maxWidth: "100%",
    maxHeight: "100%",
    margin: "auto",
    
  },
  videoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  muteDefaultStyles : {
    position:'absolute',
    top:'34px',
    right: '70px',
    width:'25px',
    height:'25px',
    padding:'3px',
    borderRadius:'50%',
    color:'#000',
    zIndex: '9999999999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export const tester: Tester = (story) => {
  return {
    condition: story.type === "video",
    priority: 2,
  };
};

export default {
  renderer,
  tester,
};
