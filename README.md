
<h1 style="margin: 0" align="center">oono stories npm package</h1>
<p align="center">A React component for oono stories</p>



<img height="600" src="https://i.imgur.com/Y1s8FKb.png" alt="Demo screenshot"/>

## Install

- create an organization on npmjs.com
- create an npm package under the organization (eg: oono/stories)

```bash
npm install --save @oono/stories (current name is @wecansync/react-insta-stories)
```

## Usage

```jsx
import React, { Component } from 'react';

import Stories from 'react-insta-stories';

const App = () => {
	const stories = [{
          url: 'path',
          type: 'image|video',
          width: ,
          height: '',
          seeMore: '',
          //seeMoreComponent: ""
          onSeeMoreClick: () => {
            window.open(`url`, '_blank').focus();
          }
        }]
	return (
		<Stories 
                //pauseStoryWhenInActiveWindow={true}
                header={}
                headerStyle={{}}
                action={}
                defaultDuration={7000}
                stories={storiesArray}
                currentIndex={0}
                isRtl={0}
                onStoriesStart={(s) => {
                  
                }}
                //keyboardNav={false}
                onNext={(s) => {
                  
                }}
                onForward={(s) => {
                  
                }}
                onPrevious={(s) => {
                  
                }}
                onStoryChange={(s) => {
                  //console.log("onStoryChange", s);
                }}
                paused={false}
                loop={true}
                pauseDelay={750}
                onStoryStart={(s) => {
                  //console.log("onStoryStart", s);
                }}
                containerStyle={{
                  
                }}
                width={"100%"}
                height={"100%"}

                soundIconStyle={{
                  
                }}
                playIconStyle={{
                  
                }}
                onMute={(isMuted) => {
                  
                }}
                onPause={(data) => {
                  
                }}
                onDrag={(offset) => {
                  
                }}
                onDragEnd={(offset) => {
                  
                }}
              />
	);
};
```

## Test

```
git clone <package-path>
cd <package-dir>
npm install
cd example
npm start
```

