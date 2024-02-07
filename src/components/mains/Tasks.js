import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, Typography } from '@mui/material';
import { saveTask, clearTask } from '../../store/actions/action3';
import CreateTest from './CreateTest';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import '../../styles/Tasks.css';
import API from '../../api';

const Tasks = () => {
  const usercode = useSelector((state) => state.code.usercode);
  const userrole = useSelector((state) => state.role.userrole);
  const [tasks, setTasks] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('jwt');
      try {
        if (userrole === 'user') {
          const mergedData = await API.GetTasksWithResultsByCode(usercode);

          setTasks(mergedData);
        } else if (userrole === 'organizer') {
          const tasksWithUsersAndResults = await API.GetTasksWithUsersAndResultsByOwnerCode(usercode);
          setTasks(tasksWithUsersAndResults);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userrole, usercode]);

  const startTest = (taskId) => {
    navigate('/Test');
    dispatch(saveTask(taskId));
  };

  return (
    <div className='Tasks'>
      {(userrole === 'user' && tasks && tasks.length > 0) ? (
        <>
          <h2>Ваши задачи:</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Название</th>
                <th>Максимальное время (минуты)</th>
                <th>Результат</th>
                <th>Время</th>
                <th>Пройти</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.name}</td>
                  <td>{task.maxTime}</td>
                  <td>{task.result}</td>
                  <td>{task.dateTime && new Date(task.dateTime).toLocaleString()}</td>
                  <td>
                    {task.result === undefined && (
                      <Button onClick={() => startTest(task._id)}>Пройти тест</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (userrole === 'user') ? (
        <p><ErrorOutlineIcon /> Вы не подключены ни к одному тесту</p>
      ) : (
        <></>
      )}
      {(userrole === 'organizer' && tasks && tasks.length > 0) ? (
        <>
          <h2>Ваши тесты:</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Название</th>
                <th>Максимальное время (минуты)</th>
                <th>Имя пользователя/ Результат</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.name}</td>
                  <td>{task.maxTime}</td>
                  <td>
                    {task.connectedUsers && task.connectedUsers.length > 0 ? (
                      <table>

                        <tbody>
                          {task.connectedUsers.map((user) => (
                            <tr key={user._id}>
                              <td>{`${user.firstName} ${user.lastName}`}</td>
                              <td>
                                {task.userResults && task.userResults.length > 0 ? (
                                  task.userResults.map((result) => (
                                    result.userId === user._id && (
                                      <span key={result._id}>{`${result.result}`}</span>
                                    )
                                  ))
                                ) : (
                                  'Нет результатов пользователей'
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      'Нет подключенных пользователей'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (userrole === 'organizer') ? (
        <p><ErrorOutlineIcon /> У вас нет ни одного теста</p>
      ) : (
        <></>
      )}
      {userrole === 'organizer' && (
        <>
          <h2>Создать новый тест: </h2>
          <CreateTest />
        </>
      )}
    </div>
  );
};

export default Tasks;

