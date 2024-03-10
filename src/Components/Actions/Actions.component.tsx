import { Fragment, useRef, useState } from 'react';
import * as CONSTANTS from './Actions.constants';
import './Actions.styles.css';

interface IActionsProps {
  onNextClick: () => void;
  onPrevClick: () => void;
  onPause: () => void;
  onResume: () => void;
  pauseDelay?: number;
  onDrag?: (offset: number) => void;
  onDragEnd?: (offset: number) => void;
}

type IActionEvent = React.MouseEvent | React.TouchEvent;

export function Actions({
  onNextClick,
  onPrevClick,
  onPause,
  onResume,
  pauseDelay,
  onDrag,
  onDragEnd,
}: IActionsProps) {

  const offsetY = useRef(0);

  const [isStoryPaused, setIsStoryPaused] = useState(false);
  //adding pause timer because we want to debouce pause interaction
  //because mouse down is called with mouse up immediately
  const pauseTimerRef = useRef<any>(null);

  function handlePause(event: IActionEvent) {
    if (event.cancelable) {
      event.stopPropagation();
      event.preventDefault();
    }
    createDravEvents(event)
    clearTimeout(pauseTimerRef.current);

    // delay this transaction
    pauseTimerRef.current = setTimeout(() => {
      onPause();
      setIsStoryPaused(true);
    }, pauseDelay);
  }

  function handleInteractions(region: string, event: IActionEvent) {
    if (event.cancelable) {
      event.stopPropagation();
      event.preventDefault();
    }
   
    //clear any pending timeout
    clearTimeout(pauseTimerRef.current);
    if (isStoryPaused) {
      onResume();
      setIsStoryPaused(false);
      return;
    }
    onResume();
    if (region == CONSTANTS.EVENT_REGION.LEFT) {
      onPrevClick();
      return;
    }
    onNextClick();
  }

  function getEvents(region: string) {
    return {
      onMouseUp: (e: React.MouseEvent) => handleInteractions(region, e),
      onTouchEnd: (e: React.TouchEvent) => handleInteractions(region, e),
      onTouchStart: (e: React.TouchEvent) => handlePause(e),
      onMouseDown: (e: React.MouseEvent) => handlePause(e),
      
    };
  }

  const createDravEvents = (event) => {
    offsetY.current = event.clientY || event.touches[0]?.clientY;
    // mouse events
    event.target.addEventListener('mousemove', drag);
    event.target.addEventListener('mouseup', function(evt) {
      if (evt.cancelable) {
        evt.stopPropagation();
        evt.preventDefault();
      }
      event.target.removeEventListener('mousemove', drag);
      dragEnd(evt);
    });

    // touch events
    event.target.addEventListener('touchmove', drag);
    event.target.addEventListener('touchend', function(evt) {
      event.target.removeEventListener('touchmove', drag);
      dragEnd(evt);
    });
    
  }

  const drag = (event) => {
    //event.preventDefault();
    const y = (event.clientY || event.touches[0]?.clientY) - offsetY.current;
    onDrag(y);
  }

  const dragEnd = (event) => {
    //event.preventDefault();
    const y = (event.clientY || event.changedTouches[0]?.clientY) - offsetY.current;
    onDragEnd(y);
  }

  return (
    <Fragment>
      <div
        className={"insta-stories-left"}
        {...getEvents(CONSTANTS.EVENT_REGION.LEFT)}
      />
      <div
        className={"insta-stories-right"}
        {...getEvents(CONSTANTS.EVENT_REGION.RIGHT)}
      />
    </Fragment>
  );
}
