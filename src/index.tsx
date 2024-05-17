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
  isRtl = false,
  onStoryStart = () => {},
  onNext = () => {},
  onForward = () => {},
  onPrevious = () => {},
  containerStyle = {},
  soundIconStyle = {},
  playIconStyle = {},
  action = null,
  keyboardNav = true,
  header = null,
  headerStyle = {},
  onDrag = () => {},
  onDragEnd = () => {}
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
  const [isIconPaused, setIsIconPaused] = useState<boolean>(paused);
  const [buffer, setBuffer] = useState<boolean>(false);
  const hasCalledEndedCb = useRef<any>(false);
  const hasCalledStartedCb = useRef<any>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasCalledStartedCb.current) {
      hasCalledStartedCb.current = true;
      onStoriesStart();
    }
  }, [onStoriesStart]);

  useEffect(() => {
    console.log("received action: ", action);
    if(!action){
      return;
    }
    switch(action){
      case "next":
        handleNextClick('next');
      break;
      case "prev":
        handlePrevClick();
      break;
      case "pause":
        handlePause();
      break;
      case "resume":
        handleResume();
      break;
      case "togglePause":
        setIsPaused(!isPaused);
      break;
    }
    
  }, [action]);

  useEffect(() => {
   setIsPaused(paused);
  }, [paused]);

  useEffect(() => {
    onPause(isPaused);
   }, [isPaused]);



  useEffect(() => {
    const story = storiesWithIndex[currentIndex];
    if (story) {
      setSelectedStory(story);
    }
  }, [currentIndex, stories]);




  function handleNextClick(type?: string) {
    if(typeof type === 'undefined'){
      const type = 'forward';
    }
    if (!hasCalledEndedCb.current && selectedStory?.index === lastStoryIndex) {
      onAllStoriesEnd();
      hasCalledEndedCb.current = true;
    }
    setIsIconPaused(false);
    if (selectedStory?.index === lastStoryIndex && !loop) {
      return;
    }
    if (storiesWithIndex.length == 1) {
      setSelectedStory(null);
      setTimeout(() => {
        setSelectedStory((prev) => {
          if (!prev) {
            return storiesWithIndex[0];
          }
          const newIndex = prev?.index === stories.length -1 ? 0 : prev?.index + 1;
          return storiesWithIndex[newIndex];
        });
        if(type === 'next'){
          onNext(selectedStory?.index);
        }else{
          onForward(selectedStory?.index);
        }
      }, 10)
      return;
    }
    
    setSelectedStory((prev) => {
      if (!prev) {
        return storiesWithIndex[0];
      }
      const newIndex = prev?.index === stories.length -1 ? 0 : prev?.index + 1;
      return storiesWithIndex[newIndex];
    });
    if(type === 'next'){
      onNext(selectedStory?.index);
    }else{
      onForward(selectedStory?.index);
    }
    
    handleResume();
  }
  function handlePrevClick() {
    if (selectedStory?.index === firstStoryIndex) {
      return;
    }
    setIsIconPaused(false);
    setSelectedStory((prev) => {
      if (!prev) {
        return storiesWithIndex[0];
      }
      const newIndex = prev?.index - 1;
      return storiesWithIndex[newIndex];
    });
    onPrevious(selectedStory?.index);
    handleResume();
  }

  function handlePause() {
    setIsPaused(true);
  }
  function handleBuffer(buffering: boolean) {
    setBuffer(buffering);
  }
  function handleResume() {
    setIsPaused(false);
    setIsIconPaused(false);
  }

  useEffect(() => {
    console.log("isIconPaused", isIconPaused);
  }, [isIconPaused]);

  useEffect(() => {
    if (selectedStory) {
      onStoryChange(selectedStory.index);
    }
  }, [selectedStory]);

  hooks.usePausableTimeout(
    () => {
      setVideoDuration(0);
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

  hooks.useKeyboardNav((key) => {
    if (keyboardNav) {
      handleKeyboardNav(key);
    }
  });

  const handleKeyboardNav = (key: string) => {
    switch(key){
      case 'ArrowLeft':
        isRtl ? handleNextClick('next') : handlePrevClick();
        break;
      case 'ArrowRight':
        isRtl ? handlePrevClick() : handleNextClick('next');
        break;
      case ' ':
        setIsPaused(!isPaused)
        break;
      case 'Spacebar':
        setIsPaused(!isPaused)
        break;
      case 'Space':
        setIsPaused(!isPaused)
        break;
      case 'Escape':
        setIsPaused(true)
        break;
    }
  };

  function getHeader() {
    if (typeof header === 'function') {
      return <header />;
    }
    return header;
  }

  

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
        ref={containerRef}
        className={`insta-stories-main-container ${classNames.main || ''}`}
        style={containerComputedStyle}
      >
        <Progress activeStoryIndex={selectedStory.index} isPaused={isPaused || buffer} />
        {header && <div className={'insta-stories-header'} style={headerStyle}>{getHeader()}</div>}
        <Story
          key={selectedStory.index}
          onPause={() => {
            handlePause();
            setIsIconPaused(true);
          }}
          onBuffer={handleBuffer}
          onResume={() => {
            handleResume();
          }}
          story={selectedStory}
          isPaused={isPaused}
          isIconPaused={isIconPaused}
          onStoryStart={onStoryStart}
          setVideoDuration={setVideoDuration}
        />
        <Actions
          onNextClick={ () => {handleNextClick('next')}}
          onPrevClick={handlePrevClick}
          onPause={handlePause}
          setIsIconPaused={setIsIconPaused}
          onResume={handleResume}
          pauseDelay={pauseDelay}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          container={containerRef.current}
        />
      </div>
    </StoriesContext.Provider>
  );
}
