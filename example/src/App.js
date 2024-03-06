import React, { Suspense, useEffect, useState } from "react";
import "./App.css";

const Stories = React.lazy(() => import("react-insta-stories"));



function App() {

  const stories2 = [
    
    {
      url: 'https://oono.oono.ai/uploads/oono/236/photo_2024-02-14_14-15-57.jpg',
      type:'image',
      width: 20,
      height:40
    },
    {
      url: "https://288044789.oono.ai/uploads/288044789/33/30a0a92f-4f9d-41e5-8a9f-4f076bf26aa5-compressed.mp4",
      type: "video"
    },
    {
      url: 'https://oono.oono.ai/uploads/oono/246/example2.jpg',
      type:'image',
      width: 40,
      height:20
    },
    {
      url: 'https://oono.oono.ai/uploads/oono/238/example.jpg',
      type: 'image',
      width: 450,
      height: 318
    },
    // {
    //   url: 'https://899470041.oono.ai/uploads/899470041/15/0212.mp4',
    //   type: 'video'
    // },
    // {
    //   url: 'https://oono.oono.ai/uploads/oono/276/IMG_3861.jpeg',
    //   type: 'image'
    // },
    
    
    
    
    // {
    //   url: 'https://909915810.oono.ai/uploads/909915810/76/IMG_7482.MOV',
    //   type: 'video'
    // },
    // {
    //   url: 'https://899470041.oono.ai/uploads/899470041/13/IMG_4478.MOV',
    //   type: 'video'
    // },
    // {
    //   url: 'https://899470041.oono.ai/uploads/899470041/14/IMG_4481.MOV',
    //   type: 'video'
    // },
    
   
    
  ];
  

  const [paused, setPaused] = useState(false);
  const [stories, setStories] = useState(stories2);



  const updatePause = () => {
    setPaused(!paused)
  }

  return (
    <div className="App">
    
      <div className="stories">
        <Suspense>
          <div className="pause-btn">
            <button onClick={() => {updatePause()}}>{paused ? "play" : "pause"}</button>
          </div>
          <Stories
            width={window.innerHeight*0.9 *9/16}
            height={window.innerHeight*0.9}
            defaultDuration={4000}
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
              setPaused(p);
            }}
            pauseDelay={150}
            onStoryStart={(s) => {
              console.warn("started story", s)
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
