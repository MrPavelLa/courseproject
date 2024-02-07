import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import axios from 'axios';
import Question from './Question';
import {
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import '../../styles/Tasks.css';
import API from '../../api';

const CreateTest = () => {
  const userrole = useSelector((state) => state.role.userrole);
  const usercode = useSelector((state) => state.code.usercode);
  const [name, setName] = useState('');
  const [maxTime, setMaxTime] = useState('');
  const [questions, setQuestions] = useState([]); 
  const [taskId, setTaskId] = useState(null);
  const [first, setFirst] = useState(true);

  const addQuestion = () => {
    try{
      if(name && maxTime){
        if(first)
        {handleSubmit();}
        setQuestions([...questions, { id: questions.length + 1 }]);
        setFirst(false);
      }
    } catch (error) {
      console.error('Error', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        maxTime,
        name,
        owner: usercode,
      };
  
      const response = await API.CreateTask(dataToSend);
      setTaskId(response.data);
  
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className='NewTest'>
      {first ? (
        <>
            <TextField
              id="taskName"
              type="text"
              placeholder="Название теста"
              value={name}
              label = "Название"
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              id="maxTime"
              type="text"
              placeholder="Время на тест (в минутах):"
              value={maxTime}
              label = "Длительность"
              onChange={(e) => setMaxTime(e.target.value)}
            />
        </>
      ) : (
        <p>
          Название: "{name}". Время на тест: {maxTime} минуты
        </p>
      )}

      {questions.map((question, index) => (
        <Question
          key={question.id}
          taskId={taskId}
          questionIndex={index}
        />
      ))}

      <Button type="button" onClick={addQuestion} variant="contained">
        <AddIcon/> вопрос
      </Button>
    </div>
  );
};

export default CreateTest;
