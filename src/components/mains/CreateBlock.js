import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Button,
  TextField,
  InputLabel,
  TextareaAutosize,
  Slider,
  Typography,
  Input,
  FormControl,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import '../../styles/CreateBlock.css';
import API from '../../api';

const CreateBlock = ({ onCreate }) => {
  const { webtype, webcode } = useSelector((state) => state.webData);
  const userrole = useSelector((state) => state.role.userrole);
  const usercode = useSelector((state) => state.code.usercode);
  const [dcapacity, setDcapacity] = useState('');
  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [duration, setDuration] = useState('');
  const [datetime, setDatetime] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [capacity, setCapacity] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [messege, setMessege] = useState('');

  useEffect(() => {
    if (usercode !== null) {
      fetchCapacity();
    }
  }, [usercode]);

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleVideoChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const fetchCapacity = async () => {
    API.GetUserByCode(usercode)
    .then((data) => {
      setDcapacity(data.dCapacity);
    })
    .catch((error) => {
      console.error('Error during authorization:', error);
    });
  };

  const handleSubmit = async () => {
    try {
      let errorr = '';
      if (
        !title ||
        !speaker ||
        !shortDescription ||
        !description ||
        !cost ||
        (webtype !== 'lecture' && (!duration || !datetime || !capacity))
      ) {
        errorr = 'Заполните все поля.'; 
        // alert('Заполните все поля');
        // return;
      }

      if (webtype !== 'lecture' && (duration < 0 || isNaN(Number(duration)))) {
        errorr += 'Введите корректное значение длительности.';
        // setMessege(messege + 'Введите корректное значение длительности.'); 
        // alert('Введите корректное значение длительности');
        // return;
      }

      if (cost < 0 || isNaN(Number(cost))) {
        errorr += 'Введите корректное значение стоимости.'; 
        // alert('Введите корректное значение стоимости');
        // return;
      }

      if (webtype !== 'lecture' && (capacity < 0 || isNaN(Number(capacity)))) {
        errorr +='Введите корректное значение вместимости.'; 
      }

      if (webtype !== 'lecture' && new Date(datetime) < new Date()) {
        errorr +='Выберите корректную дату и время.'; 
      }

      if (!imageFile) {
        errorr +='Выберите изображение.'; 
      }
      if(errorr){
        console.log(errorr);  
        setMessege(errorr);   
        return;
      }
      let imgName = '';
      let videoName = '';
      const imageData = new FormData();
      imageData.append('file', imageFile);

      const response =  await axios.post('http://localhost:4999/upload/image', imageData);
      console.log(response.data.fileName);
      imgName = (response.data.fileName);


      if (webtype === 'lecture') {
        const videoData = new FormData();
        videoData.append('file', videoFile);

        const response = await axios.post('http://localhost:4999/upload/video', videoData);

        videoName =(response.data.fileName);
      }

      const dataToSend = {
        title,
        speaker,
        shortDescription,
        description,
        cost,
        logo: imgName,
        owner: usercode,
      };

      if (webtype !== 'lecture') {
        dataToSend.duration = duration;
        dataToSend.datetime = datetime;
        dataToSend.capacity = capacity;
      }
      if (webtype === 'lecture') {
        dataToSend.video = videoName;
      }     
      let responseWLT;

      if (webtype === 'webinar') {
        responseWLT = await API.CreateWebinar(dataToSend);
      } else if (webtype === 'lecture') {
        responseWLT = await API.CreateLecture(dataToSend);
      } else if (webtype === 'training') {
        responseWLT = await API.CreateTraining(dataToSend);
      }  
      if(responseWLT){
        errorr +=responseWLT; 
      }
      console.log(errorr);  
      setMessege(errorr);      
      setTitle('');
      setSpeaker('');
      setDuration('');
      setDatetime('');
      setShortDescription('');
      setDescription('');
      setCost('');
      setCapacity('');
      onCreate();
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className='CreateBlock'>
      <h2>
        Создать{' '}
        {webtype === 'lecture'
          ? 'лекцию'
          : webtype === 'webinar'
            ? 'вебинар'
            : webtype === 'training'
              ? 'тренинг'
              : null}
        :
      </h2>
      <TextField
        type="text"
        placeholder="Название"
        value={title}
        label="Название"
        onChange={(e) => setTitle(e.target.value)}
      />

      <TextField
        type="text"
        placeholder="Ведущий"
        value={speaker}
        label="Ведущий"
        onChange={(e) => setSpeaker(e.target.value)}
      />
      {webtype !== 'lecture' && (
        <>
          <TextField
            type="text"
            placeholder="Длительность (в минутах)"
            value={duration}
            label="Длительность"
            onChange={(e) => setDuration(e.target.value)}
          />
          <InputLabel>Дата-время:</InputLabel>
          <TextField
            type="datetime-local"
            name="datetime"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
          />
        </>
      )}
      <TextField
        type="text"
        name="shortDescription"
        value={shortDescription}
        label="Короткое описание"
        onChange={(e) => setShortDescription(e.target.value)}
      />
      <InputLabel>Длинное описание:</InputLabel>
      <textarea
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}

      />

      <TextField
        type="number"
        name="cost"
        value={cost}
        label="стоимость"
        onChange={(e) => setCost(e.target.value)}
      />

      {webtype !== 'lecture' && (
        <>
          <InputLabel>Вместительность:{capacity}</InputLabel>
          <Slider
            name="capacity"
            min={1}
            max={dcapacity}
            value={Number(capacity)}
            onChange={(e, newValue) => setCapacity(newValue)}
          />

        </>
      )}
      <Button
        variant="contained"
        startIcon={<CloudUploadIcon />}
        component="label"
      >
        Загрузить лого
        <Input
          type="file"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </Button>
      {webtype === 'lecture' && (
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          component="label"
        >
          Загрузить видео
          <Input
            type="file"
            onChange={handleVideoChange}
            style={{ display: 'none' }}
          />
        </Button>
      )}

      <FormControl fullWidth>
        <Button onClick={handleSubmit} variant="contained">
          Создать {webtype === 'lecture' ? 'лекцию' : 'вебинар'}
        </Button>
      </FormControl>
      <p style={{ color: "red", fontWeight: "bold", marginLeft: "auto", marginRight: "auto"}}>{messege}</p>
    </div>
  );
};

export default CreateBlock;
