import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useSelector } from 'react-redux';
import '../../styles/WLTModal.css';
import API from '../../api';

const WLTModal = ({ id }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const usercode = useSelector((state) => state.code.usercode);
  const { webtype, webcode } = useSelector((state) => state.webData);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = null;
    
        if (webtype === 'lecture') {
          data = await API.GetLectureById(id);
        } else if (webtype === 'webinar') {
          data = await API.GetWebinarById(id);
        } else if (webtype === 'training') {
          data = await API.GetTrainingById(id);
        }
    
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    

    fetchData();
  }, [id, webtype]);

  const handleAddAccessibleTo = async () => {
    try {
      if (webtype === 'lecture') {
        const lecture = await API.AddUserToLecture(id, usercode);
        setData(lecture);
      } else if (webtype === 'webinar') {
        const webinar = await API.AddUserToWebinar(id, usercode);
        setData(webinar);
      } else if (webtype === 'training') {
        const training = await API.AddUserToTraining(id, usercode);
        setData(training);
      }
      handleClose();
    } catch (error) {
      console.error('Error adding user:', error.message);
    }
  };
  

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Записаться
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <div className='Dialog'>
          {data && (
            <>
              <h1>{data.title}</h1>
              <img src={`./image/${data.logo}`} alt="Logo" />
              <p>{data.description}</p>
              <Button variant="contained" onClick={handleAddAccessibleTo}>
                {data.cost === 0 ? 'Записаться' : `Оплатить ${data.cost} рублей`}
              </Button>
            </>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default WLTModal;