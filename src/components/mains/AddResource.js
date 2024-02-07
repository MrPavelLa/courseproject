import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import '../../styles/WLTPage.css';
import { Checkbox, List, ListItem, ListItemText, Button, Typography, Input, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import API from '../../api';

const AddResource = () => {
  const { webtype, webcode } = useSelector((state) => state.webData);
  const usercode = useSelector((state) => state.code.usercode);
  const [fileFile, setFileFile] = useState(null);
  const [resName, setResName] = useState('');
  const [link, setLink] = useState('');

  const handleFileChange = (event) => {
    setFileFile(event.target.files[0]);
  };

  const addFile = async () => {
    try {
      let fileName = '';
      const fileData = new FormData();
  
      if (link && fileFile) {
        throw new Error("You selected two resources in one record!");
      } else if (link && resName) {
        await API.AddMaterialToTraining(webcode, resName, link);
      } else if (fileFile && resName) {
        fileData.append('file', fileFile);
        const response = await axios.post('http://localhost:4999/upload/file', fileData);
        fileName = response.data.fileName;
        await API.AddResourceToTraining(webcode, resName, fileName);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (    
      <div className='AddResource'>
        <TextField
          id="resName"
          type="text"
          placeholder="Название материала"
          value={resName}
          label="Название материала"
          onChange={(e) => setResName(e.target.value)}
        />
        {!fileFile && (
        <TextField
          id="link"
          type="text"
          placeholder="Ссылка на всешний ресурс"
          value={link}
          label="Ссылка на ресурс"
          onChange={(e) => setLink(e.target.value)}
        />
        )}
         {!link && (
         <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          component="label"
        >
          Загрузить файл
          <Input
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </Button>
         )}
        <Button onClick={addFile} variant="outlined">
            Добавить ресурс
          </Button>
        
       </div>   
  );
};

export default AddResource;
