import React, { useContext, useState, useRef, useEffect } from "react";
import GlobalContext from "./../context/Global";
import StoriesContext from "./../context/Stories";
import ProgressContext from "./../context/Progress";
import Story from "./Story";
import ProgressArray from "./ProgressArray";
import {
  GlobalCtx,
  StoriesContext as StoriesContextInterface,
} from "./../interfaces";
import useIsMounted from "./../util/use-is-mounted";
import { usePreLoader } from "../util/usePreLoader";

export default function () {
  const [currentId, setCurrentId] = useState<number>(0);
  const [bufferAction, setBufferAction] = useState<boolean>(true);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const isMounted = useIsMounted();

  let mousedownId = useRef<any>();
  let touchTimer = useRef<any>();
  let touchDuration = 300;

  const {
    width,
    height,
    loop,
    currentIndex,
    isPaused,
    keyboardNavigation,
    preventDefault,
    storyContainerStyles = {},
    onAllStoriesEnd,
    onPause,
    onPrevious,
    onNext,
    preloadCount,
  } = useContext<GlobalCtx>(GlobalContext);
  const { stories } = useContext<StoriesContextInterface>(StoriesContext);

  const [pause, setPause] = useState<boolean>(Boolean(isPaused));
  let paused = useRef<boolean>(Boolean(isPaused));

  usePreLoader(stories, currentId, preloadCount);

  useEffect(() => {
    if (typeof currentIndex === "number") {
      if (currentIndex >= 0 && currentIndex < stories.length) {
        setCurrentIdWrapper(() => currentIndex);
      } else {
        console.error(
          "Index out of bounds. Current index was set to value more than the length of stories array.",
          currentIndex
        );
      }
    }
  }, [currentIndex]);

  

  useEffect(() => {
    if (typeof isPaused === "boolean") {
        if (isPaused) {
          toggleState("pause", true);
        } else {
          toggleState("play", true);
        }
        paused.current = isPaused;
    }
  }, [isPaused]);

  useEffect(() => {
    const isClient = typeof window !== "undefined" && window.document;
    if (
      isClient &&
      typeof keyboardNavigation === "boolean" &&
      keyboardNavigation
    ) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [keyboardNavigation]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      previous();
    } else if (e.key === "ArrowRight") {
      next({ isSkippedByUser: true });
    }
  };

  const toggleState = (action: string, bufferAction?: boolean, sendEvent?: boolean) => {
    if(sendEvent){
      if(action === "pause"){
        paused.current = true;
      }
      // console.log("pausing");
      return onPauseCallback(action === "pause")
    }
    // console.log("toggle state", action)
    setPause(action === "pause");
    //paused.current = action === "pause";
    setBufferAction(!!bufferAction);
    
    
  };

  const setCurrentIdWrapper = (callback) => {
    setCurrentId(callback);
    //toggleState("pause", true);
  };

  const previous = () => {
    if (onPrevious != undefined) {
      onPrevious();
    }
    setCurrentIdWrapper((prev) => {
      return prev > 0 ? prev - 1 : prev
    });
  };

  const next = (options?: { isSkippedByUser?: boolean }) => {
    paused.current = false;
    if (onNext != undefined && options?.isSkippedByUser) {
      onNext();
    }
    // Check if component is mounted - for issue #130 (https://github.com/mohitk05/react-insta-stories/issues/130)
    if (isMounted()) {
      if (loop) {
        updateNextStoryIdForLoop();
      } else {
        updateNextStoryId();
      }
    }
  };

  const updateNextStoryIdForLoop = () => {
    setCurrentIdWrapper((prev) => {
      if (prev >= stories.length - 1) {
        onAllStoriesEnd && onAllStoriesEnd(currentId, stories);
      }
      return (prev + 1) % stories.length;
    });
  };
  

  const updateNextStoryId = () => {
    setCurrentIdWrapper((prev) => {
      if (prev < stories.length - 1) return prev + 1;
      onAllStoriesEnd && onAllStoriesEnd(currentId, stories);
      return prev;
    });
  };

  const debouncePause = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
      toggleState("pause", false, true);
  };

 

    const handleNextPrev =
    (type: string) => {
      //console.log("click")
      //e.preventDefault();
      //console.log("paused", paused.current)
      if(paused.current){
        toggleState("play");
        return;
      }
      type === "next" ? next({ isSkippedByUser: true }) : previous();
    };

  const getVideoDuration = (duration: number) => {
    setVideoDuration(duration * 1000);
  };

  const touchStart = (e: React.MouseEvent | React.TouchEvent) => {
    //console.log("touch start")
    touchTimer.current = setTimeout(() => {
      debouncePause(e)
    }, touchDuration);
  }

  

  const touchEnd =
  (type: string | null) => (e: React.MouseEvent | React.TouchEvent) => {
    // console.log("touch end", type)
    e.preventDefault();
    clearTimeout(touchTimer.current);
    touchTimer.current = null;
    if(paused.current){
      toggleState("play", false, true);
      setTimeout(() => {
        paused.current = false;
      }, 100)
      return;
    }
    
    if(type){
      handleNextPrev(type)
    }
    
  }




  
  const onPauseCallback = (data?: boolean) => {
    
    onPause && onPause(typeof data === "boolean" ? data : paused.current);
  };

  if(currentId >= stories.length){
    // restart stories if array updated
    console.warn("restarting stories")
    setCurrentId(0);
  }
  return (
    <div
      style={{
        ...styles.container,
        ...storyContainerStyles,
        ...{ width, height },
      }}
    >
      <ProgressContext.Provider
        value={{
          bufferAction: bufferAction,
          videoDuration: videoDuration,
          currentId,
          pause,
          next,
        }}
      >
        <ProgressArray />
      </ProgressContext.Provider>
      <Story
        action={toggleState}
        bufferAction={bufferAction}
        playState={pause}
        story={stories[currentId]}
        getVideoDuration={getVideoDuration}
        isPaused={isPaused}
      />
      {!preventDefault && (
        <div style={styles.overlay}>
          <div
          className="prev-story"
            style={{ width: "50%", zIndex: 999 }}
            onTouchStart={touchStart}
            onTouchEnd={touchEnd("prev")}
            onMouseDown={touchStart}
            onMouseUp={touchEnd(null)}
            onClick={() => {handleNextPrev("prev")}}
          />
          <div
          className="next-story"
            style={{ width: "50%", zIndex: 999 }}
            onTouchStart={touchStart}
            onTouchEnd={touchEnd("next")}
            onMouseDown={touchStart}
            onMouseUp={touchEnd(null)}
            onClick={() => {handleNextPrev("next")}}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    background: "#111",
    position: "relative" as const,
    WebkitUserSelect: 'none' as const,
  },
  overlay: {
    position: "absolute" as const,
    height: "inherit",
    width: "inherit",
    display: "flex",
  },
};
