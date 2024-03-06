import { Fragment, useEffect, useRef, useState } from 'react';
import './Video.styles.css';
import { IStoryComponentProps } from '../../types';
import * as hooks from '../../Hooks';
import { SoundIcon } from '../SoundIcon';

const key = 'RSIsMute';
const WINDOW: any = typeof window === 'undefined' ? {} : window;
WINDOW?.localStorage?.setItem(key, 'true');

export function Video(props: IStoryComponentProps) {
  const { isPaused } = hooks.useStoriesContext();
  const [isMuted, setIsMuted] = useState(
    WINDOW?.localStorage?.getItem(key) === 'true',
  );
  const [showLoader, setShowLoader] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function setMute(value: boolean) {
    WINDOW?.localStorage?.setItem(key, String(value));
    setIsMuted(value);
  }

  useEffect(() => {
    props.onPause(true);
  }, []);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    if (isPaused && !videoRef.current.paused) {
      videoRef.current.pause();
      return;
    }
    videoRef.current.play().catch(() => {
      setMute(true);
      videoRef.current?.play();
    });
  }, [isPaused]);

  function handleLoad() {
    setTimeout(() => {
      props.setVideoDuration(videoRef.current.duration * 1000);
      console.log("video loaded", videoRef.current.duration, props.story)
      setShowLoader(false);
      props.onStoryLoaded();
    }, 4);
  }

  const onWaiting = () => {
    console.log("waiting")
    setShowLoader(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    props.onPause(true);
  };

  const play = () => {
    // console.log("can play ")
    // console.log("isPaused ", isPaused)
    if(isPaused){
      return;
    }
    setShowLoader(false);
    videoRef.current
      .play()
      .then(() => {
        
        props.onResume();
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
    props.onResume();
  };

  const onError = () => {
    console.log("error playing video")
    setShowLoader(true);
    props.onPause();
    play()
  };

  const onSuspend = () => {
    //console.log("on suspend")
    onPlaying()
  };

  
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

        // attr
        preload='auto'
        onWaiting={onWaiting}
        onPlaying={onPlaying}
        onCanPlay={play}
        onError={onError}
        onSuspend={onSuspend}
        onStalled={() => {console.log("stalled")}}
      >
        <source src={props.story.url} type="video/mp4" />
        <source src={props.story.url} type="video/webm" />
        <source src={props.story.url} type="video/ogg" />
        <p>Video not supported</p>
      </video>
      <div className={'stories-soundIcon'} onClick={() => setMute(!isMuted)}>
        <SoundIcon type={isMuted ? 'off' : 'on'} />
      </div>
      {showLoader && (
        <div className={'stories-loaderWrapper'}>
          <div className={'stories-loader'} />
        </div>
      )}
    </Fragment>
  );
}
