import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TimerIcon from '@mui/icons-material/Timer';
import { Radio, RadioGroup, FormControlLabel, List, ListItem, Button } from '@mui/material';
import '../../styles/Tasks.css';
import API from '../../api';

const Test = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null); 
  const [task, setTask] = useState(null);
  const tasks = useSelector((state) => state.tasks);
  const taskcode = useSelector((state) => state.task.taskcode);
  const usercode = useSelector((state) => state.code.usercode);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsResponse = await API.GetQuestionsByTaskCode(taskcode);
        const accessibleTasksResponse = await API.GetAccessibleTasksWithInfo(usercode);
    
        setQuestions(questionsResponse);
    
        const foundTask = accessibleTasksResponse.find((task) => task._id === taskcode);
        setTask(foundTask);
    
        if (foundTask && foundTask.maxTime) {
          const totalTimeInSeconds = foundTask.maxTime * 60;
          setTimeLeft(totalTimeInSeconds);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
    setCount(1);
  }, [taskcode, usercode]);

  useEffect(() => {
    let timer;
    
    if (timeLeft > 0) {

      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } 
    if (timeLeft <= 0 && count !== 0) {

      handleSubmit(); 
    }
  
    return () => clearInterval(timer);
  }, [timeLeft]);
  

  const handleOptionSelect = (questionId, selectedOptionIndex) => {
    setSelectedAnswers((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [questionId]: selectedOptionIndex,
    }));
  };  

  const handleSubmit = async () => {
    try {
      let Mark = 0;
      questions.forEach((question) => {
        const selectedOption = selectedAnswers[question._id];
        if (selectedOption === question.correctAnswer) {
          Mark += 1;
        }
      });
  
      console.log('Mark:', Mark);

      const response = await API.SaveUserResult(usercode, Mark, taskcode);
      navigate('/Tasks');
    } catch (error) {
      console.error('Error submitting result:', error);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className='Test'>
      <span style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
      <TimerIcon/>
      {timeLeft !== null && <p>{formatTime(timeLeft)}</p>} 
      </span>
      <List>
        {questions.map((question) => (
          <ListItem key={question._id}>
            <p>{question.text}</p>
            <RadioGroup
              value={selectedAnswers[question._id]}
              onChange={(e) => handleOptionSelect(question._id, parseInt(e.target.value, 10))}
            >
              {question.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index.toString()}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </ListItem>
        ))}
      </List>
      <Button variant="contained" onClick={handleSubmit}>
        Закончил
      </Button>
    </div>
  );
};

export default Test;
