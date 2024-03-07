import { Fragment, useEffect, useRef, useState } from 'react';
import './Video.styles.css';
import { IStoryComponentProps } from '../../types';
import * as hooks from '../../Hooks';
import { SoundIcon } from '../Icons/SoundIcon';

const key = 'storiesIsMute';
const WINDOW: any = typeof window === 'undefined' ? {} : window;
WINDOW?.localStorage?.setItem(key, 'true');

export function Video(props: IStoryComponentProps) {
  const { isPaused, soundIconStyle } = hooks.useStoriesContext();
  const [isMuted, setIsMuted] = useState(
    WINDOW?.localStorage?.getItem(key) === 'true',
  );
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function setMute(value: boolean) {
    WINDOW?.localStorage?.setItem(key, String(value));
    setIsMuted(value);
  }


  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    if (isPaused && !videoRef.current.paused) {
      videoRef.current.pause();
      return;
    }
    if(videoLoaded){
      play();
    }

  }, [isPaused]);

  function handleLoad() {
    setTimeout(() => {
      props.setVideoDuration(videoRef.current?.duration * 1000);
      setVideoLoaded(true);
      props.onStoryLoaded();
    }, 4);
  }

  const onWaiting = () => {
    // console.log("waiting")
    setShowLoader(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    props.onPause(true);
  };

  const play = () => {
    // console.log("can play ")
    // console.log("isPaused ", isPaused)
    setShowLoader(false);
    if(isPaused){
      return;
    }
    setShowLoader(false);
    videoRef.current
      .play()
      .then(() => {
        
        props.onResume(true);
        setShowLoader(false);
      })
      .catch(() => {
        // console.log("set as muted")
        setIsMuted(true);
        onWaiting();
      });
  };

  const onPlaying = () => {
    // console.log("on playing")
    play();
  };

  const onError = (e) => {
    console.log("error playing video", e)
    setShowLoader(true);
    props.onPause(true);
    play()
  };

  const onSuspend = () => {
    //console.log("on suspend")
    onPlaying()
  };

  const onStalled = () => {
    //console.log("stalled");
  };


  const onMute = () => {
    setMute(!isMuted)
  }

  
  return (
    <Fragment>
      <video
        className={'stories-video'}
        ref={videoRef}
        playsInline={true}
        webkit-playsinline=""
        controls={false}
        src={props.story.url}
        onLoadedData={handleLoad}
        muted={isMuted}
        autoPlay={false}
        // attr
        preload='auto'
        onWaiting={onWaiting}
        onPlaying={onPlaying}
        onCanPlay={play}
        onError={onError}
        onSuspend={onSuspend}
        onStalled={onStalled}
      >
        <source src={props.story.url} type="video/mp4" />
        <source src={props.story.url} type="video/webm" />
        <source src={props.story.url} type="video/ogg" />
        <p>Video not supported</p>
      </video>
      <div className={'stories-soundIcon'} onClick={onMute} style={soundIconStyle}>
        <SoundIcon type={isMuted ? 'off' : 'on'} style={{width:'100%', height:'100%'}} />
      </div>
      {showLoader && (
        <div className={'stories-loaderWrapper'}>
          <div className={'stories-loader'} />
        </div>
      )}
    </Fragment>
  );
}
