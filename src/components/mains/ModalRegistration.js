import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import '../../styles/ModalRegistration.css';
import API from '../../api';

const ModalRegistration = () => {
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userLogin, setUserLogin] = useState('');
  const [userRole, setUserRole] = useState('user');
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [fileExtension, setFileExtension] = useState('');
  const [open, setOpen] = useState(false);
  const [errorr, setError] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop();

      setFileExtension(fileExtension);
      setImageFile(file);
    }
  };

  const addUsers = async () => {
    try {

      let errormessage = '';

      if (!userFirstName || !userLastName || !userPassword || !userLogin || !userPhoneNumber) {
        alert('Заполните все поля');
        return;
      }

      if (!imageFile) {
        alert('Выберите файл');
        return;
      }

      const imageData = new FormData();
      imageData.append('file', imageFile);

      let imgName = '';
      const imageResponse = await axios.post('http://localhost:4999/upload/image', imageData);
      imgName = (imageResponse.data.fileName);
      if (imageResponse.data.error && !errormessage) {
        errormessage = imageResponse.data.error;
        setError(imageResponse.data.error);
      }

      const userResponse = await API.CreateUser({
        firstName: userFirstName,
        lastName: userLastName,
        logo: imgName,
      });
      if (userResponse.data.error && !errormessage) {
        errormessage = userResponse.data.error;
        setError(userResponse.data.error);
      }
      const createdUserId = userResponse.data;

      const verificationData = {
        itemId: createdUserId,
        login: userLogin,
        password: userPassword,
        role: userRole,
        phonenumber: userPhoneNumber,
      };
      
      const response = await API.CreateVerification(verificationData);     

      if (response.data.error && !errormessage) {
        errormessage = response.data.error;
        setError(response.data.error);
      }

      if (!errormessage) {
        setUserFirstName('');
        setUserLastName('');
        setUserPassword('');
        setUserLogin('');
        setUserRole('user');
        setUserPhoneNumber('');
        setError('');
        setTimeout(() => {
          handleClose();
        }, 3000);
      }

    } catch (error) {
      console.error('Error adding user:', error.message);
    }
  };

  return (
    <div className='ModalRegistration'>
      <button className='Home1_But' onClick={handleClickOpen}>
        Зарегистрироваться
      </button>
      <Dialog open={open} className='Dialog'>
        <div className='addUser'>
          <h2>МОДУЛЬ РЕГИСТРАЦИИ</h2>
          <FormControl>
            <InputLabel htmlFor="userFirstName">Имя</InputLabel>
            <Input
              id="userFirstName"
              value={userFirstName}
              onChange={(e) => setUserFirstName(e.target.value)}
              underline="true"
            />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="userLastName">Фамилия</InputLabel>
            <Input
              id="userLastName"
              value={userLastName}
              onChange={(e) => setUserLastName(e.target.value)}
              underline="true"
            />
          </FormControl>
          <FormControl >
            <InputLabel htmlFor="userPassword">Пароль</InputLabel>
            <Input
              id="userPassword"
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              underline="true"
            />
          </FormControl>
          <FormControl >
            <InputLabel htmlFor="userLogin">Логин</InputLabel>
            <Input
              id="userLogin"
              value={userLogin}
              onChange={(e) => setUserLogin(e.target.value)}
              underline="true"
            />
          </FormControl>

          <FormControl >
            <InputLabel htmlFor="userPhoneNumber">Номер телефона</InputLabel>
            <Input
              id="userPhoneNumber"
              value={userPhoneNumber}
              onChange={(e) => setUserPhoneNumber(e.target.value)}
              underline="true"
            />
          </FormControl>

          <FormControl>
            <InputLabel>Роль</InputLabel>
            <Select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            >
              <MenuItem value="user">Пользователь</MenuItem>
              <MenuItem value="organizer">Организатор</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            component="label"
          >
            Загрузить изображение
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </Button>
          <Button onClick={addUsers} variant="outlined">
            Зарегистрироваться
          </Button>
          {errorr && (
            <p style={{ color: "red", fontWeight: "bold", marginLeft: "auto", marginRight: "auto" }}>Ошибка: {errorr}</p>
          )}

        </div>
      </Dialog>
    </div>
  );
};

export default ModalRegistration;
