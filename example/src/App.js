import React, { Suspense, useEffect, useRef, useState } from "react";
import "./App.css";

const Stories = React.lazy(() => import("react-insta-stories"));



function App() {

  

  const stories2 = [

    // {
    //   url: 'https://oono.staging.oono.ai/uploads/oono/37/2-second-video-compressed.mp4',
    //   type: 'video'
    // },
    {
      url: 'https://oono.staging.oono.ai/uploads/oono/38/4-6020372146906202990-compressed.mp4',
      type: 'video'
    },
    {
      url: 'https://275898008.staging.oono.ai/uploads/275898008/10/a7980d71f19e467db1eff0eef9803e77.mp4',
      type: 'video',
      seeMore: 'SEE MORE',
      //seeMoreComponent: 'See More content',
      onSeeMoreClick: () => {console.log('clicked')}
    },
    
    {
      url: 'https://275898008.staging.oono.ai/uploads/275898008/11/photo-2024-02-14-14-15-57-copy-2.jpg',
      type: 'image'
    },
    {
      url: 'https://275898008.staging.oono.ai/uploads/275898008/11/photo-2024-02-14-14-15-57-copy-2.jpg',
      type: 'image'
    },
    {
      url: 'https://275898008.staging.oono.ai/uploads/275898008/11/photo-2024-02-14-14-15-57-copy-2.jpg',
      type: 'image'
    }
    
    // {
    //   url: 'https://oono.oono.ai/uploads/oono/236/photo_2024-02-14_14-15-57.jpg',
    //   type:'image',
    //   width: 20,
    //   height:40
    // },
    // {
    //   url: "https://899470041.oono.ai/uploads/899470041/40/94fa9b9d2faa48c0ac96508411bb726d-compressed.mp4",
    //   type: "video"
    // },
    // {
    //   url: "https://288044789.oono.ai/uploads/288044789/33/30a0a92f-4f9d-41e5-8a9f-4f076bf26aa5-compressed.mp4",
    //   type: "video"
    // },
    // {
    //   url: 'https://oono.oono.ai/uploads/oono/246/example2.jpg',
    //   type:'image',
    //   width: 40,
    //   height:20
    // },
    // {
    //   url: 'https://oono.oono.ai/uploads/oono/238/example.jpg',
    //   type: 'image',
    //   width: 450,
    //   height: 318
    // },
    
    
   
    
  ];

  
  

  const [actionRef, setActionRef] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stories, setStories] = useState(stories2);



  const updatePause = () => {
    setPaused(!paused)
  }

  const resetAction = () => {
    setTimeout(() => {
      setActionRef(null)
    },200)
  }

  const getHeader = () => {
    return (
      <div style={{color:'white'}}>HEADER</div>
    )
  }

  

  return (
    <div className="App">
    
      <div className="stories">
        <Suspense>
         
          {/* <div className="pause-btn">
            <button onClick={() => {updatePause()}}>{paused ? "play" : "pause"}</button>
          </div> */}
          {/* <div className="prev-btn">
            <button onClick={() => {
              setActionRef("prev")
              resetAction()
              }}>Prev</button>
          </div>
          <div className="next-btn">
            <button onClick={() => {
              setActionRef("next")
              resetAction()
              }}>Next</button>
          </div> */}
          <Stories
           isRtl={true}
            currentIndex={currentIndex}
            action={actionRef}
            width={window.innerHeight*0.9 *9/16}
            height={window.innerHeight*0.9}
            defaultDuration={7000}
            stories={stories}
            onStoriesStart={(s) => {
              //console.log("onStoriesStart", s);
            }}
            onStoryChange={(s) => {
              //console.log("onStoryChange", s);
            }}
            paused={paused}
            loop={true}
            onPause={(p) => {
              //console.warn("paused", p)
              setPaused(p);
            }}
            pauseDelay={200}
            onStoryStart={(s) => {
              //console.warn("started story", s)
            }}
            containerStyle={{
              boxSizing: "border-box"
            }}
            soundIconStyle={{
              width:25,
              height:25,
            }}
            playIconStyle={{
              width:25,
              height:25,
            }}
            header={getHeader()}
            onDrag={(offset) => {
              console.log("dragging", offset)
            }}
            onDragEnd={(offset) => {
              console.log("drag end", offset)
            }}
            onNext={(s) => {
              console.log("on next");
            }}
            onForward={(s) => {
              console.log("on forward");
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}



const image = {
  display: "block",
  maxWidth: "100%",
  borderRadius: 4,
};

const code = {
  background: "#eee",
  padding: "5px 10px",
  borderRadius: "4px",
  color: "#333",
};

const contentStyle = {
  background: "#333",
  width: "100%",
  padding: 20,
  color: "white",
  height: "100%",
};

const customSeeMore = {
  textAlign: "center",
  fontSize: 14,
  bottom: 20,
  position: "relative",
};

export default App;
