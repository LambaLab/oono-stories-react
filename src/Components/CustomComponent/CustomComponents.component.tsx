import './CustomComponents.styles.css';
import { IStoryComponentProps } from '../../types';

export function CustomComponent(props: IStoryComponentProps) {
  return (
    <div className={"stories-component"}>
      <props.story.component
        pause={props.onPause}
        resume={props.onResume}
        story={props.story}
        isPaused={props.isPaused}
      />
    </div>
  );
}
