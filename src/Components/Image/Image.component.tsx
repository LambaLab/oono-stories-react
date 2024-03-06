import { useEffect, useState } from 'react';
import { IStoryComponentProps } from '../../types';
import './Image.styles.css';

export function Image(props: IStoryComponentProps) {

  

  function handleLoadImage() {
    //set timeout is done because there is an inconsitancy in safari and other browser
    //on when to call useEffect
    setTimeout(() => {
      props.onStoryLoaded()
    }, 4);
  }

  return (
    <img
      className={"stories-image"}
      src={props.story.url}
      alt="story"
      onLoad={handleLoadImage}
    />
  );
}
