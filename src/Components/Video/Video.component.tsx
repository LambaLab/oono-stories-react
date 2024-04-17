import { Fragment, useEffect, useRef, useState } from 'react';
import './Video.styles.css';
import { IStoryComponentProps } from '../../types';
import * as hooks from '../../Hooks';
import { SoundIcon } from '../Icons/SoundIcon';

const key = 'storiesIsMute';
const WINDOW: any = typeof window === 'undefined' ? {} : window;
//WINDOW?.localStorage?.setItem(key, 'false');

export function Video(props: IStoryComponentProps) {
  const { isPaused, soundIconStyle } = hooks.useStoriesContext();
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoCanPlay = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function setMute(value: boolean) {
    WINDOW?.localStorage?.setItem(key, String(value));
    setIsMuted(value);
  }

  useEffect(() => {
    const mut = WINDOW?.localStorage?.getItem(key, 'false') === 'true';
    setIsMuted(mut);

    const interval = setInterval(() => {
      if(!videoRef.current || isPaused || !videoCanPlay.current){
        return false;
      }
        if (videoRef.current.networkState === videoRef.current.NETWORK_LOADING) {
          // The user agent is actively trying to download data.
          // console.log('on wait: The user agent is actively trying to download data.')
          onWaiting();
          return;
        }
        
        if (videoRef.current.readyState < videoRef.current.HAVE_FUTURE_DATA) {
            // There is not enough data to keep playing from this point
            // console.log('on wait There is not enough data to keep playing from this point')
            onWaiting();
        }
      
    }, 100)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if(videoRef.current){
      videoRef.current.pause();
    }
    
  }, [videoRef.current])


  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    if (isPaused && !videoRef.current.paused) {
      videoRef.current.pause();
      return;
    }
    if(videoLoaded && videoCanPlay.current){
      play();
    }

  }, [isPaused]);

  useEffect(() => {
    if(videoCanPlay.current){
      play();
    }
  }, [videoCanPlay.current]);

  function handleLoad() {
    setTimeout(() => {
      props.setVideoDuration(videoRef.current?.duration * 1000);
      setVideoLoaded(true);
      props.onStoryLoaded();
    }, 4);
  }

  const onWaiting = () => {
    // console.log("waiting")
    props.showLoader(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    props.onBuffer(true);
  };

  const play = () => {
    // console.log("video can play", videoCanPlay)
    // console.log("isPaused ", isPaused)
    if(!videoCanPlay.current){
      return false;
    }
    props.showLoader(false);
    if(isPaused){
      return;
    }
    
    videoRef.current
      .play()
      .then(() => {
        props.showLoader(false);
        props.onBuffer(false);
        props.showLoader(false);
      })
      .catch((e) => {
        console.log("cannot turn video sound on", e)
        setIsMuted(true);
        onWaiting();
      });
  };

  const onPlaying = () => {
    //console.log("on playing")
    play();
  };

  const onError = (e) => {
    console.log("error playing video", e)
    props.showLoader(true);
    props.onBuffer(true);
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

  const onCanPlay = () => {
    videoCanPlay.current = true;    
  }

  
  return (
    <Fragment>
      <video
        className={'insta-stories-video'}
        ref={videoRef}
        playsInline={true}
        webkit-playsinline=""
        controls={false}
        src={props.story.url}
        onLoadedData={handleLoad}
        muted={isMuted}
        autoPlay={true}
        // attr
        preload='auto'
        onWaiting={onWaiting}
        onPlaying={onPlaying}
        onCanPlay={onCanPlay}
        onError={onError}
        onSuspend={onSuspend}
        onStalled={onStalled}
      >
        <source src={props.story.url} type="video/mp4" />
        <source src={props.story.url} type="video/webm" />
        <source src={props.story.url} type="video/ogg" />
        <p>Video not supported</p>
      </video>
      <div className={'insta-stories-soundIcon'} onClick={onMute} style={soundIconStyle}>
        <SoundIcon type={isMuted ? 'off' : 'on'} style={{width:'100%', height:'100%'}} />
      </div>
      
    </Fragment>
  );
}
