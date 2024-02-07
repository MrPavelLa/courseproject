import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import io from 'socket.io-client';
import '../../styles/WLTPage.css';
import IconButton from '@mui/material/IconButton';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import API from '../../api';

const Streamer = ({ socket }) => {
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };

  useEffect(() => {
    let intervalId;

    if (isCameraOn) {
      intervalId = setInterval(() => {
        const screenshot = webcamRef.current.getScreenshot();
        if (screenshot) {
          const base64Data = screenshot.split(',')[1];
          socket.emit('cadr', { content: base64Data });
        }
      }, 80);
    }

    return () => clearInterval(intervalId);
  }, [socket, isCameraOn]); 

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: isCameraOn ? 'user' : 'environment',
        }}
      />
     <IconButton onClick={toggleCamera}>
        {isCameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
      </IconButton>
    </div>
  );
};

export default Streamer;