import { useRef } from 'react';
import { StoriesContext } from './Contexts';
import { Actions, Progress, Story } from './Components';
import { IStoryProps, IStoryIndexedObject, IStoryContext } from './types';
import { useEffect, useMemo, useState } from 'react';
import * as hooks from './Hooks';
import './styles.css';
import * as utilities from './utilities';

export default function Stories({
  stories = [],
  width = '100%',
  height = '100%',
  onStoryChange = () => {},
  currentIndex = 0,
  defaultDuration = 10000,
  onAllStoriesEnd = () => {},
  onStoriesStart = () => {},
  classNames = {},
  pauseStoryWhenInActiveWindow = false,
  loop = false,
  paused = false,
  onPause = () => {},
  pauseDelay = 200,
  onStoryStart = () => {},
  onNext = () => {},
  onPrevious = () => {},
  containerStyle = {},
  soundIconStyle = {},
  playIconStyle = {},
  action = null
}: IStoryProps): JSX.Element | null {

  const [videoDuration, setVideoDuration] = useState(defaultDuration);

  const storiesWithIndex: IStoryIndexedObject[] = useMemo(() => {
    return utilities.transformStories(stories, defaultDuration, videoDuration);
  }, [stories, defaultDuration, videoDuration]);

  const [selectedStory, setSelectedStory] = useState<
    IStoryIndexedObject | undefined
  >();
  const firstStoryIndex = 0;
  const lastStoryIndex = stories.length - 1;
  const [isPaused, setIsPaused] = useState<boolean>(paused);
  const [buffer, setBuffer] = useState<boolean>(false);
  const hasCalledEndedCb = useRef<any>(false);
  const hasCalledStartedCb = useRef<any>(false);

  useEffect(() => {
    if (!hasCalledStartedCb.current) {
      hasCalledStartedCb.current = true;
      onStoriesStart();
    }
  }, [onStoriesStart]);

  useEffect(() => {
    if(!action){
      return;
    }
    if(action == "next"){
      handleNextClick();
    }else{
      handlePrevClick();
    }
  }, [action]);

  useEffect(() => {
   setIsPaused(paused);
  }, [paused]);

  useEffect(() => {
    if(!buffer){
      onPause(isPaused);
    }
   }, [isPaused]);



  useEffect(() => {
    const story = storiesWithIndex[currentIndex];
    if (story) {
      setSelectedStory(story);
    }
  }, [currentIndex, stories]);



  function handleNextClick() {
    if (!hasCalledEndedCb.current && selectedStory?.index === lastStoryIndex) {
      onAllStoriesEnd();
      hasCalledEndedCb.current = true;
    }
    
    if (selectedStory?.index === lastStoryIndex && !loop) {
      return;
    }
    setSelectedStory((prev) => {
      if (!prev) {
        return storiesWithIndex[0];
      }
      const newIndex = prev?.index === stories.length -1 ? 0 : prev?.index + 1;
      return storiesWithIndex[newIndex];
    });
    onNext(selectedStory?.index)
  }
  function handlePrevClick() {
    if (selectedStory?.index === firstStoryIndex) {
      return;
    }
    setSelectedStory((prev) => {
      if (!prev) {
        return storiesWithIndex[0];
      }
      const newIndex = prev?.index - 1;
      return storiesWithIndex[newIndex];
    });
    onPrevious(selectedStory?.index)
  }

  function handlePause(buffering?: boolean) {
    console.log("handle pause, buffering:", buffering)
    setBuffer(buffering);
    if(buffering){
      return;
    }
    setIsPaused(true);
  }
  function handleResume(buffering?: boolean) {
    console.log("handle resume, buffering:", buffering)
    if(buffering){
      setBuffer(false);
      return;
    }
    setIsPaused(false);
  }

  useEffect(() => {
    if (selectedStory) {
      onStoryChange(selectedStory.index);
    }
  }, [selectedStory]);

  hooks.usePausableTimeout(
    () => {
      handleNextClick();
    },
    (videoDuration || selectedStory?.calculatedDuration) ?? null,
    (isPaused || buffer),
  );

  hooks.useWindowVisibility((isWindowInFocus) => {
    if (pauseStoryWhenInActiveWindow) {
      setIsPaused(!isWindowInFocus);
    }
  });

  const contextValue: IStoryContext = {
    stories: storiesWithIndex,
    width,
    height,
    defaultDuration,
    isPaused,
    classNames,
    videoDuration: videoDuration,
    soundIconStyle: soundIconStyle,
    playIconStyle: playIconStyle
  };

  if (!selectedStory) {
    return null;
  }

  const containerComputedStyle = {
    ...containerStyle,
    ...{width, height}
  }
  return (
    <StoriesContext.Provider value={contextValue}>
      <div
        className={`insta-stories-main-container ${classNames.main || ''}`}
        style={containerComputedStyle}
      >
        <Progress activeStoryIndex={selectedStory.index} isPaused={isPaused || buffer} />
        <Story
          key={selectedStory.index}
          onPause={handlePause}
          onResume={handleResume}
          story={selectedStory}
          isPaused={isPaused}
          onStoryStart={onStoryStart}
          setVideoDuration={setVideoDuration}
        />
        <Actions
          onNextClick={handleNextClick}
          onPrevClick={handlePrevClick}
          onPause={handlePause}
          onResume={handleResume}
          pauseDelay={pauseDelay}
        />
      </div>
    </StoriesContext.Provider>
  );
}
