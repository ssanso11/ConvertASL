// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { nextFrame } from "@tensorflow/tfjs";
// 2. TODO - Import drawing utility here
// e.g. import { drawRect } from "./utilities";
import {drawRect} from "./utilities"; 

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const check_num = (result) => {
    const alph = "abcdefghijklmnopqrstuvwxyz"
    for (var i = 0; i < result.length; i++) {
      //console.log(result.length);
      if (result[i] > 0) {
        console.log(i);
        return alph.charAt(i);
      }
    }
  }
  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network 
    // e.g. const net = await cocossd.load();
    // https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json
    const net = await tf.loadLayersModel('https://casl-new-model.s3.us-east.cloud-object-storage.appdomain.cloud/model.json')
    net.summary();
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 1600.7);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // 4. TODO - Make Detections
      const img = tf.browser.fromPixels(video)
      const resized = tf.image.resizeBilinear(img, [64,64])
      const expanded = resized.expandDims(0)
      const obj = net.predict(expanded)

      var new_arr = await obj.array()
      const asdfasd = check_num(new_arr[0])
      console.log(asdfasd)
      // const boxes = await obj[1].array()
      // const classes = await obj[2].array()
      // console.log(classes);
      // const scores = await obj[4].array()
      
      // // Draw mesh
      // const ctx = canvasRef.current.getContext("2d");

      // // 5. TODO - Update drawing utility
      // // drawSomething(obj, ctx)  
      // requestAnimationFrame(()=>{drawRect(boxes[0], classes[0], scores[0], 0.8, videoWidth, videoHeight, ctx)}); 

      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(expanded)
      tf.dispose(obj)

    }
  };

  useEffect(()=>{runCoco()},[]);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "50px",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: "90%",
            height: 600,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;