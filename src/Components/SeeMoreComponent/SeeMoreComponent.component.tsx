import { IStoryIndexedObject } from '../../types';
import './SeeMoreComponent.styles.css';

interface IProps {
  story: IStoryIndexedObject;
  onClose: () => void;
}

export function SeeMoreComponent(props: IProps) {
  function getSeeMoreComponent() {
    if (typeof props.story.seeMoreComponent === 'function') {
      return <props.story.seeMoreComponent />;
    }
    return props.story.seeMoreComponent;
  }
  if (!props.story.seeMore) {
    return null;
  }
  if (!props.story.seeMoreComponent) {
    return null;
  }

  return (
    <div className={'stories-seeMoreComponentWrapper'}>
      <button className={'stories-closeIcon'} onClick={props.onClose}>
        ✕
      </button>
      {getSeeMoreComponent()}
    </div>
  );
}
