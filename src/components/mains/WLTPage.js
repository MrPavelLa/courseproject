import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Streamer from './Streamer';
import ConnectionBlockTask from './ConnectionBlockTask';
import '../../styles/WLTPage.css';
import Cookies from 'js-cookie';
import { Typography, Paper, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import API from '../../api';

const WLTPage = () => {
  const { webtype, webcode } = useSelector((state) => state.webData);
  const userrole = useSelector((state) => state.role.userrole);
  const usercode = useSelector((state) => state.code.usercode);
  const [commentInput, setCommentInput] = useState('');
  const [imgCode, setImgCode] = useState('');
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const socket = io('http://localhost:5007', { transports: ['websocket'] });
  const socket8 = io('http://localhost:5008', { transports: ['websocket'] });
  const [imageSrc, setImageSrc] = useState(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (webtype === 'lecture') {
      fetchAllData();
    }
    fetchComments();

    socket.on('commentsUpdated', () => {
      fetchComments();
    });

    return () => {
      socket.disconnect();
    };
  }, [webcode]);

  useEffect(() => {
    socket8.on('cadr', (data) => {
      setImageSrc(data.content);

    });

    setTimeout(() => {
      setIsVideoVisible(true);
    }, 500);
    return () => {
      socket8.disconnect();
    };
  }, []);

  useEffect(() => {

    fetchTrainingData(webcode);

  }, [webcode]);

  const fetchTrainingData = async () => {
    try {
      const data = await API.GetTrainingById(webcode);
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const fetchComments = async () => {
    try {
      const response = await API.GetCommentsByObjectReference(webcode);
      const sortedComments = response.sort((a, b) => new Date(a.time) - new Date(b.time));
      setComments(sortedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  
  const fetchAllData = async () => {
    const token = Cookies.get('jwt');
    try {
      const response = await API.GetLectureById(webcode, token);
      const fileNameWithExtension = response.video;
      setImgCode(fileNameWithExtension);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const handleCommentSubmit = async () => {
    try {
      await API.CreateComment(usercode, commentInput, webcode);
  
      console.log('Comment submitted');
  
      fetchComments();
  
      const socket = io('http://localhost:5007', { transports: ['websocket'] });
      socket.emit('commentUpdated');
  
      setCommentInput('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  function extractDomain(url) {
    const domainRegex = /^(?:https?:\/\/)?(?:www\.)?([^\/\n]+)/;
    const match = url.match(domainRegex);
    return match ? match[1] : url;
  }

  const calculateTimeDifference = (commentTime) => {
    const currentTime = new Date();
    const commentDate = new Date(commentTime);
    const timeDifference = Math.abs(currentTime - commentDate);

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    let timeString = '';

    if (days > 0) {
      timeString += `${days} дней `;
    }

    if (hours > 0) {
      timeString += `${hours} часов `;
    }

    if (minutes > 0 && hours < 2 && days === 0) {
      timeString += `${minutes} минут `;
    }

    if ((seconds > 0 || (days === 0 && hours === 0 && minutes === 0)) && minutes < 10 && days === 0 && hours === 0) {
      timeString += `${seconds} секунд`;
    }

    timeString += ` назад`;
    return timeString.trim();
  };

  return (
    <div className='WebinarPage'>
      <div className='WebContent'>
        {(userrole === 'organizer' && webtype !== 'lecture') && (
          <Streamer socket={socket8} />
        )}
        {(userrole === 'user' && webtype !== 'lecture' && imageSrc) ? (
          <img src={`data:image/jpeg;base64,${imageSrc}`} alt="Webcam Capture" />
        ) : (webtype !== 'lecture' && userrole !== 'organizer') ? (
          <img src="zastavka.jpg" alt="Webcam Capture" />
        ) :
          (
            <></>
          )}

        {(webtype === 'lecture' && isVideoVisible) && (
          <>
            <video width="auto" height="100%" controls>
              <source src={`./video/${encodeURIComponent(imgCode)}`} type="video/mp4" />
              Ваш браузер не поддерживает тег video.
            </video>
          </>
        )}

      </div>
      <div className='Comments'>
        <Paper elevation={3} className='CommentsContainer'>
          <Typography variant="h5">Комментарии</Typography>
          <div className='CommentsList'>
            {comments.map((comment) => (
              <Paper key={comment._id} className='CommentItem'>
                <p>
                  <span style={{ color: 'gray' }}>{calculateTimeDifference(comment.time)}</span>
                </p>
                <p>
                  <span style={{ fontWeight: 'bold' }}>
                    {comment.owner.firstName} {comment.owner.lastName}:
                  </span>{' '}
                  {comment.content}
                </p>
              </Paper>
            ))}
          </div>
        </Paper>
        <Paper elevation={3} className='CommentInput'>
          <TextField
            multiline
            rows={3}
            placeholder='Введите ваш комментарий...'
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ backgroundColor: 'transparent' }}
            onClick={handleCommentSubmit}
          >
            <SendIcon style={{ color: 'blue' }} />
          </Button>
        </Paper>
      </div>
      {(userrole === 'organizer') && (
        <div className='ConnectionBlockTask'>
          <ConnectionBlockTask />
        </div>
      )}
      {(webtype === 'training' && isVideoVisible) && (
        <div className='Res'>
          {data.materials && data.materials.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Название материала</th>
                  <th>Ссылка на материал</th>
                </tr>
              </thead>
              <tbody>
                {data.materials.map((material) => (
                  <tr key={material._id}>
                    <td>{material.title}</td>
                    <td>
                      <a href={material.link} target="_blank" rel="noopener noreferrer">
                        {extractDomain(material.link)}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <h3>Ресурсы</h3>
          {data.resources && data.resources.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Название ресурса</th>
                  <th>Тип ресурса</th>
                  <th>Скачать</th>
                </tr>
              </thead>
              <tbody>
                {data.resources.map((resource) => (
                  <tr key={resource._id}>
                    <td>{resource.title}</td>
                    <td>{resource.link.split('.').pop().toLowerCase()}</td>
                    <td> 
                      <a
                      href={`/files/${resource.link}`}
                      download={resource.link}
                    >
                      <Button><FileDownloadIcon/></Button>
                    </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default WLTPage;
