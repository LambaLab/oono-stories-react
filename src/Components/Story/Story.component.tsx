import { useEffect, useRef, useState } from 'react';
import * as CONSTANTS from './Story.constants';
import './Story.styles.css';
import { IStoryComponentProps } from '../../types';
import { Image } from '../Image';
import { Video } from '../Video';
import { CustomComponent } from '../CustomComponent';
import { SeeMore } from '../SeeMore';
import { SeeMoreComponent } from '../SeeMoreComponent';
import * as hooks from '../../Hooks';
import { PlayIcon } from '../Icons/PlayIcon/PlayIcon.component';

export function Story(props: IStoryComponentProps) {
  const [showSeeMoreComponent, setShowSeeMoreComponent] = useState(false);
  const { classNames, playIconStyle } = hooks.useStoriesContext();
  const [showLoader, setShowLoader] = useState(true);
  const [storyStarted, setStoryStarted] = useState(false);
  const [storyLoaded, setStoryLoaded] = useState(false);

  props.onStoryLoaded = handleStoryLoaded;
  props.showLoader = setShowLoader;

  useEffect(() => {
    props.onBuffer(true);
  }, [])

  useEffect(() => {
    props.setVideoDuration(0);
    // console.log("start story", props.story.calculatedDuration);
  }, []);

  useEffect(() => {
    setShowSeeMoreComponent(false);
  }, [props.story]);

  useEffect(() => {
    if(!props.isPaused && storyLoaded && !storyStarted){
      handleStoryStarted();
    }
  }, [props.isPaused]);

  function handleStoryStarted () {
    setStoryStarted(true);
    props.onStoryStart(props.story.index);
  }

  function handleStoryLoaded () {
    setStoryLoaded(true);
    if(!props.isPaused){
      handleStoryStarted();
    }
  }

  function getStory() {
    if (props.story.type === CONSTANTS.STORY_TYPES.IMAGE) {
      return <Image {...props} />;
    }
    if (props.story.type === CONSTANTS.STORY_TYPES.VIDEO) {
      return <Video {...props} />;
    }
    if (props.story.type === CONSTANTS.STORY_TYPES.COMPONENT) {
      return <CustomComponent {...props} />;
    }

    return null;
  }

  function getHeader() {
    if (typeof props.story.header === 'function') {
      return <props.story.header />;
    }
    return props.story.header;
  }

  function handleSeeMore() {
    props.onPause();
    setShowSeeMoreComponent(true);
    props.story.onSeeMoreClick?.(props.story.index);
  }

  function handleCloseSeeMore() {
    // console.log("close seemore")
    props.onResume();
    setShowSeeMoreComponent(false);
  }

  const handlePlayPause = () => {
    if(props.isPaused){
      props.onResume();
    }else{
      props.onPause();
    }
  }

  return (
    <div  className={`insta-stories-story-wrapper insta-stories-type-${props.story.type} ${classNames?.storyContainer || ''}`}>
      {getStory()}
      {props.story.header && <div className={'insta-stories-story-header'}>{getHeader()}</div>}
      <SeeMore onSeeMoreClick={handleSeeMore} story={props.story} />
      {showSeeMoreComponent && (
        <SeeMoreComponent story={props.story} onClose={handleCloseSeeMore} />
      )}
      <div className={'insta-stories-action-btn insta-stories-playIcon'} onClick={handlePlayPause} style={playIconStyle}>
        <PlayIcon type={props.isPaused ? 'play' : 'pause'}  style={{width:'100%', height:'100%'}} />
      </div>
      {showLoader && (
        <div className={'insta-stories-loaderWrapper'}>
          <div className={'insta-stories-loader'} />
        </div>
      )}
    </div>
  );
}
