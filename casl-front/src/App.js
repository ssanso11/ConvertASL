// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
// 2. TODO - Import drawing utility here
// e.g. import { drawRect } from "./utilities";
import {arrMaskMap, arrRgbMap, arrMaskMapRGBA} from "./helpers/rgb_to_hsv.js"
import ReactSlider from "react-slider"
// import { useState } from "react-usestateref";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  var [currLetter, setCurrLetter] = useState();
  const [s_h, setSaturationH] = useState(100);
  const [v_h, setValueH] = useState(100);
  const [h_h, setHueH] = useState(360);
  const [s_l, setSaturationL] = useState(0);
  const [v_l, setValueL] = useState(0);
  const [h_l, setHueL] = useState(0);
  // var [currLetter, setCurrLetter, currLetterRef] = useState('a');
  // const [s_h, setSaturationH, s_h_ref] = useState(100);
  // const [v_h, setValueH, v_h_ref] = useState(100);
  // const [h_h, setHueH, h_h_ref] = useState(360);
  // const [s_l, setSaturationL, s_l_ref] = useState(0);
  // const [v_l, setValueL, v_l_ref] = useState(0);
  // const [h_l, setHueL, h_l_ref] = useState(0);

  const shRef = useRef();
  const slRef = useRef();
  const vhRef = useRef();
  const vlRef = useRef();
  const hhRef = useRef();
  const hlRef = useRef();

  shRef.current = s_h
  slRef.current = s_l
  vhRef.current = v_h
  vlRef.current = v_l
  hhRef.current = h_h
  hlRef.current = h_l

  const check_num = (result) => {
    const alph = "abcdefghijklmnopqrstuvwxyz"
    for (var i = 0; i < result.length; i++) {
      //console.log(result.length);
      if (result[i] > 0) {
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
    }, 16.7);
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

      // Hue/saturation/value cutoffs for images


      const ctx = canvasRef.current.getContext("2d");

      // 4. TODO - Make Detections
      const img = tf.browser.fromPixels(video)
      const resized = tf.image.resizeBilinear(img, [128,128])
      const resized_arr = await resized.array()
      // const new_resized = resized.dataSync()
      // console.log(shRef.current);
      // console.log(resized_arr)
      const hsv_img = resized_arr.map(arrRgbMap)
      // const bw_hsv_img = hsv_img.map(x => arrMaskMap(x, h_l_ref.current, h_h_ref.current, s_l_ref.current, s_h_ref.current, v_l_ref.current, v_h_ref.current))
      const bw_hsv_img = hsv_img.map(x => arrMaskMap(x, hlRef.current, hhRef.current, slRef.current, shRef.current, vlRef.current, vhRef.current))
      const bw_hsv_img_rgba = hsv_img.map(x => arrMaskMapRGBA(x, hlRef.current, hhRef.current, slRef.current, shRef.current, vlRef.current, vhRef.current))
      //console.log(bw_hsv_img_rgba_flat)
    
      
      // cropping image
      const bw_hsv_img_cols_cropped = bw_hsv_img.slice(0, 64)
      const bw_hsv_img_full_cropped = [];
      
      for (var i = 0; i < bw_hsv_img_cols_cropped.length; i++) {
        bw_hsv_img_full_cropped.push(bw_hsv_img_cols_cropped[i].slice(0, 64))
      }

      // cropping displayed image
      const bw_hsv_img_rgba_cols_cropped = bw_hsv_img_rgba.slice(0, 64)
      const bw_hsv_img_rgba_full_cropped = [];
      
      for (var i = 0; i < bw_hsv_img_rgba_cols_cropped.length; i++) {
        bw_hsv_img_rgba_full_cropped.push(bw_hsv_img_rgba_cols_cropped[i].slice(0, 64))
      }

      // write image data
      const testerttt = Uint8ClampedArray.from(bw_hsv_img_rgba_full_cropped.flat(3))
      // let bw_hsv_img_rgba_flat_conv = new ImageData(testerttt, 64, 64);
      // ctx.putImageData(bw_hsv_img_rgba_flat_conv, 0, 0);
        // Initialize a new ImageData object
      let imageData = new ImageData(testerttt, 64);

      // Draw image data to the canvas
      ctx.putImageData(imageData, 0, 0);

      // ctx
      const tensor_img = tf.tensor(bw_hsv_img_full_cropped)

      const expanded = tensor_img.expandDims(0)
      const obj = net.predict(expanded)

      var new_arr = await obj.array()
      const letter = check_num(new_arr[0])
      setCurrLetter(letter)



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
    <div className="App" textAlign="center">
      <header className="App-header" >
        <h1 style={{paddingLeft:"43%"}}>ConvertASL</h1>
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            display:"block",
            textAlign: "center",
            width: "90%",
            height:"600px",
            marginLeft:"auto",
            marginRight:"auto",
            marginTop: "50px",
            zIndex:9
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            width: 256*4,
            height: 256,
            zIndex: 10,
            marginBottom: "-200px"
          }}
        />
        <p style={{
          paddingLeft:"50%",
          fontSize: "40px"
        }}>
          {currLetter}
        </p>
        <h1>Saturation High</h1>
        <ReactSlider
          ariaLabel="Hellow words"
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          value={s_h}
          onAfterChange={(value, index) => setSaturationH(value)}
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        />
        <hr/>
        <h1>Saturation Low</h1>
        <ReactSlider
          ariaLabel="Hellow words"
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          value={s_l}
          onAfterChange={(value, index) => setSaturationL(value)}
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        />
        <hr/>
        <h1>Value High</h1>
        <ReactSlider
          ariaLabel="Hellow words"
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          value={v_h}
          onAfterChange={(value, index) => setValueH(value)}
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        />
        <hr/>
        <h1>Value Low</h1>
        <ReactSlider
          ariaLabel="Hellow words"
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          value={v_l}
          onAfterChange={(value, index) => setValueL(value)}
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        />
        <hr/>
        <h1>Hue High</h1>
        <ReactSlider
          ariaLabel="Hellow words"
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          value={h_h}
          onAfterChange={(value, index) => setHueH(value)}
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        />
        <hr/>
        <h1>Hue Low</h1>
        <ReactSlider
          ariaLabel="Hellow words"
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          value={h_l}
          onAfterChange={(value, index) => setHueL(value)}
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        />
        
      </header>
    </div>
  );
}

export default App;