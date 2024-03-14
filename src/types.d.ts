interface IStoryObject {
  type: string;
  url: string;
  duration: number;
  component?: any;
  header?: any;
  seeMore?: any;
  seeMoreComponent?: any;
  onSeeMoreClick?: (storyIndex: number) => void;
  width?: number,
  height?: number,
  buttonTitle?: string,
  buttonUrl?: string,
}

interface IStoryIndexedObject extends IStoryObject {
  index: number;
  calculatedDuration: number;
}

interface IStoryClassNames {
  main?: string;
  progressContainer?: string;
  progressBarContainer?: string;
  progressBar?: string;
  storyContainer?: string;
}

export interface IStoryProps {
  stories: IStoryObject[];
  height?: '100%';
  width?: '100%';
  onStoryChange: (currentIndex: number) => void;
  currentIndex?: number;
  defaultDuration?: number;
  onStoriesStart?: () => void;
  onAllStoriesEnd?: () => void;
  classNames?: IStoryClassNames;
  pauseStoryWhenInActiveWindow?: boolean;
  loop?: boolean;
  paused?: boolean;
  onPause?: (paused: boolean) => void;
  pauseDelay?: number;
  onStoryStart?: (currentIndex: number) => void;
  onNext?: (currentIndex: number) => void;
  onPrevious?: (currentIndex: number) => void;
  containerStyle?: object;
  soundIconStyle?: object;
  playIconStyle?: object;
  action?: string;
  keyboardNav?: boolean;
  header?: any;
  onDrag?: (offset: number) => void;
  onDragEnd?: (offset: number) => void;
  headerStyle?: object;
}

export interface IStoryContext {
  stories: IStoryIndexedObject[];
  height?: '100%';
  width?: '100%';
  defaultDuration: number;
  isPaused: boolean;
  classNames?: IStoryClassNames;
  videoDuration: number;
  soundIconStyle?: object;
  playIconStyle?: object;
}

export interface IStoryComponentProps {
  story: IStoryIndexedObject;
  onPause: () => void;
  onBuffer: (buffering: boolean) => void;
  onResume: () => void;
  isPaused: boolean;
  onStoryStart: (currentIndex:number) => void;
  onStoryLoaded?: () => void;
  setVideoDuration?: (duration:number) => void;
  showLoader?: (show:boolean) => void;
}

export interface IProps {
  type: string;
  style?: object
}
