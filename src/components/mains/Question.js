import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
import '../../styles/Tasks.css';
import API from '../../api';

const Question = ({ taskId }) => {
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const questionSave = async () => {
    try {
      const dataToSend = {
        text,
        options,
        correctAnswer,
        taskId,
      };
  
      const response = await API.CreateQuestion(dataToSend);
  
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className='Question'>
      <TextField
        label="Вопрос"
        type="text"
        value={text}
        className='Que'
        onChange={(e) => setText(e.target.value)}
      />
  
      {options.map((option, index) => (
        <div key={index}>
          <TextField
            className='TextField-option'
            label={`Опция ${index + 1}`}
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
        </div>
      ))}
  
  <div className='SelectContainer'>
 <p>Правильный ответ:</p>
  <Select
    className='Select-correctAnswer'
    value={correctAnswer}
    onChange={(e) => setCorrectAnswer(Number(e.target.value))}
  >
    {options.map((option, index) => (
      <MenuItem key={index} value={index}>
        {index + 1}
      </MenuItem>
    ))}
  </Select>


<Button className='Button-saveQuestion' variant="contained" onClick={questionSave}>
  Сохранить вопрос
</Button>
</div>
    </div>
  );
  
};

export default Question;
