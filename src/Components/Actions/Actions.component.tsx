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
}

type IActionEvent = React.MouseEvent | React.TouchEvent;

export function Actions({
  onNextClick,
  onPrevClick,
  onPause,
  onResume,
  pauseDelay,
  onDrag,
}: IActionsProps) {

  const offsetY = useRef(0);

  const [isStoryPaused, setIsStoryPaused] = useState(false);
  //adding pause timer because we want to debouce pause interaction
  //because mouse down is called with mouse up immediately
  const pauseTimerRef = useRef<any>(null);

  function handlePause(event: IActionEvent) {
    event.stopPropagation();
    event.preventDefault();
    dragStart(event)
    clearTimeout(pauseTimerRef.current);

    // delay this transaction
    pauseTimerRef.current = setTimeout(() => {
      onPause();
      setIsStoryPaused(true);
    }, pauseDelay);
  }

  function handleInteractions(region: string, event: IActionEvent) {
    event.stopPropagation();
    event.preventDefault();
    event.target.removeEventListener("mousemove", drag);
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

  const dragStart = (event) => {
    event.preventDefault();
    offsetY.current = event.clientY;
    event.target.addEventListener('mousemove', drag);
    event.target.addEventListener('mouseup', function() {
      event.target.removeEventListener('mousemove', drag);
    });
  }

  const drag = (event) => {
    event.preventDefault();
    const y = event.clientY - offsetY.current;
    onDrag(y);
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
