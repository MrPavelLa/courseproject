import axios from 'axios';
import Cookies from 'js-cookie';
const token = Cookies.get('jwt');

axios.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const API = {
  Autorize: async (login, password) => {
    try {
      const response = await axios.post('http://localhost:5000/login', { login, password });
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
  GetUserByCode: async (usercode) => {
    try {
      const response = await axios.get(`http://localhost:5001/users/${usercode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
  GetAllUsers: async () => {
    try {
      const [usersResponse, verificationsResponse] = await Promise.all([
        axios.get('http://localhost:5001/users'),
        axios.get('http://localhost:5000/verification'),
      ]);

      const usersData = usersResponse.data;
      const verificationsData = verificationsResponse.data;

      const mergedData = usersData.map((user) => {
        const verification = verificationsData.find((v) => v.itemId === user._id);
        return { ...user, ...verification };
      });

      return mergedData;
    } catch (error) {
      console.error('Error fetching users with verifications:', error);
      throw error;
    }
  },
  CreateUser: async (userData) => {
    try {
      const response = await axios.post('http://localhost:5001/users', userData);
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  DeleteUser: async (id) => {
    try {
      const response = await axios.get(`http://localhost:5001//users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
  UpdateUserCapacity: async (usercode, newDCapacity) => {
    try {
      const response = await axios.put(`http://localhost:5001/users/${usercode}/updateCapacity`, { dCapacity: newDCapacity });
      return response.data;
    } catch (error) {
      console.error('Error updating user capacity:', error);
      throw error;
    }
  },
  // Верификации
  CreateVerification: async (verificationData) => {
    try {
      const response = await axios.post('http://localhost:5000/verification', verificationData);
      return response;
    } catch (error) {
      console.error('Error creating verification:', error);
      throw error;
    }
  },
  CheckLoginVerification: async (login, phoneNumber) => {
    try {
      const response = await axios.post('http://localhost:5000/verification/check-login', {
        login,
        phonenumber: phoneNumber,
      });
      return response.data;
    } catch (error) {
      console.error('Error checking login:', error);
      throw error;
    }
  },
  UpdateVerificationPassword: async (login, newPas) => {
    try {
      const response = await axios.put(`http://localhost:5000/verification/${login}`, {
        login,
        password: newPas,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating verification password:', error);
      throw error;
    }
  },
  DeleteVerification: async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/verification/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting verification:', error);
      throw error;
    }
  },
  // Вебинары
  DeleteWebinar: async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5002/webinars/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting webinar:', error);
      throw error;
    }
  },
  GetAllWebinars: async () => {
    try {
      const response = await axios.get('http://localhost:5002/webinars');
      return response.data;
    } catch (error) {
      console.error('Error fetching webinars:', error);
      throw error;
    }
  },
  GetWebinarById: async (id) => {
    try {
      const response = await axios.get(`http://localhost:5002/webinars/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching webinar by ID:', error);
      throw error;
    }
  },
  AddUserToWebinar: async (webinarId, usercode) => {
    try {
      const response = await axios.post(`http://localhost:5002/webinars/${webinarId}/addUser/${usercode}`);
      return response.data;
    } catch (error) {
      console.error('Error adding user to webinar:', error);
      throw error;
    }
  },
  CreateWebinar: async (webinarData) => {
    try {
      const response = await axios.post('http://localhost:5002/webinars', webinarData);
      return response.data;
    } catch (error) {
      console.error('Error creating webinar:', error);
      throw error;
    }
  },   
  AddUserToCertificateWebinar: async (webcode, userid) => {
    try {
      const response = await axios.post(`http://localhost:5002/webinars/${webcode}/addUserToCertificate/${userid}`);
      return response.data;
    } catch (error) {
      console.error('Error adding user to certificate for webinar:', error);
      throw error;
    }
  },
  // Лекции
  CreateLecture: async (lectureData) => {
    try {
      const response = await axios.post('http://localhost:5003/lectures', lectureData);
      return response.data;
    } catch (error) {
      console.error('Error creating lecture:', error);
      throw error;
    }
  },

  DeleteLecture: async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5003/lectures/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting lecture:', error);
      throw error;
    }
  },

  GetAllLectures: async () => {
    try {
      const response = await axios.get('http://localhost:5003/lectures');
      return response.data;
    } catch (error) {
      console.error('Error fetching lectures:', error);
      throw error;
    }
  },

  GetLectureById: async (id) => {
    try {
      const response = await axios.get(`http://localhost:5003/lectures/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lecture by ID:', error);
      throw error;
    }
  },

  AddUserToLecture: async (lectureId, usercode) => {
    try {
      const response = await axios.post(`http://localhost:5003/lectures/${lectureId}/addUser/${usercode}`);
      return response.data;
    } catch (error) {
      console.error('Error adding user to lecture:', error);
      throw error;
    }
  },
  AddUserToCertificateLecture: async (webcode, userid) => {
    try {
      const response = await axios.post(`http://localhost:5003/lectures/${webcode}/addUserToCertificate/${userid}`);
      return response.data;
    } catch (error) {
      console.error('Error adding user to certificate for lecture:', error);
      throw error;
    }
  },
  // Тренинги
  CreateTraining: async (trainingData) => {
    try {
      const response = await axios.post('http://localhost:5004/trainings', trainingData);
      return response.data;
    } catch (error) {
      console.error('Error creating training:', error);
      throw error;
    }
  },

  DeleteTraining: async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5004/trainings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting training:', error);
      throw error;
    }
  },

  GetAllTrainings: async () => {
    try {
      const response = await axios.get('http://localhost:5004/trainings');
      return response.data;
    } catch (error) {
      console.error('Error fetching trainings:', error);
      throw error;
    }
  },

  GetTrainingById: async (id) => {
    try {
      const response = await axios.get(`http://localhost:5004/trainings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching training by ID:', error);
      throw error;
    }
  },

  AddUserToTraining: async (trainingId, usercode) => {
    try {
      const response = await axios.post(`http://localhost:5004/trainings/${trainingId}/addUser/${usercode}`);
      return response.data;
    } catch (error) {
      console.error('Error adding user to training:', error);
      throw error;
    }
  },
  AddUserToCertificateTraining: async (webcode, userid) => {
    try {
      const response = await axios.post(`http://localhost:5004/trainings/${webcode}/addUserToCertificate/${userid}`);
      return response.data;
    } catch (error) {
      console.error('Error adding user to certificate for training:', error);
      throw error;
    }
  },
  AddMaterialToTraining: async (webcode, resName, link) => {
    try {
      const response = await axios.post(`http://localhost:5004/trainings/${webcode}/addMaterial`, {
        title: resName,
        link: link,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding material to training:', error);
      throw error;
    }
  },

   AddResourceToTraining: async (webcode, resName, fileName) => {
    try {
      const response = await axios.post(`http://localhost:5004/trainings/${webcode}/addResource`, {
        title: resName,
        link: fileName,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding resource to training:', error);
      throw error;
    }
  },
  // Задания
  GetTasksByOwner: async (usercode) => {
    try {
      const response = await axios.get(`http://localhost:5005/tasks/owner/${usercode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks by owner:', error);
      throw error;
    }
  },

  AddUserToTask: async (taskId, userId) => {
    try {
      const response = await axios.post(`http://localhost:5005/tasks/${taskId}/addUser/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding user to task:', error);
      throw error;
    }
  },

  CreateTask: async (taskData) => {
    try {
      const response = await axios.post('http://localhost:5005/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  CreateQuestion: async (questionData) => {
    try {
      const response = await axios.post('http://localhost:5005/questions', questionData);
      return response.data;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  GetQuestionsByTaskCode: async (taskcode) => {
    try {
      const response = await axios.get(`http://localhost:5005/questions/${taskcode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching questions by task code:', error);
      throw error;
    }
  },

  GetAccessibleTasksWithInfo: async (usercode) => {
    try {
      const responseTask = await axios.get(`http://localhost:5005/tasks/accessibleToWithInfo/${usercode}`);
      return responseTask.data;
    } catch (error) {
      console.error('Error fetching accessible tasks with info:', error);
      throw error;
    }
  },

  SaveUserResult: async (usercode, Mark, taskcode) => {
    try {
      const response = await axios.post('http://localhost:5005/userResults', {
        userId: usercode,
        result: Mark,
        taskId: taskcode,
      });
      return response.data;
    } catch (error) {
      console.error('Error saving user result:', error);
      throw error;
    }
  },
  GetTasksWithResultsByCode: async (usercode) => {
    try {
      const [taskResponse, resultResponse] = await Promise.all([
        axios.get(`http://localhost:5005/tasks/accessibleToWithInfo/${usercode}`),
        axios.get(`http://localhost:5005/userResultsByCode/${usercode}`),
      ]);

      const taskData = taskResponse.data;
      const resultData = resultResponse.data;

      const mergedData = taskData.map(task => {
        const result = resultData.find(r => r.taskId === task._id);
        return { ...(result || {}), ...task };
      });

      return mergedData;
    } catch (error) {
      console.error('Error fetching tasks with results by code:', error);
      throw error;
    }
  },
  GetTasksWithUsersAndResultsByOwnerCode: async (usercode) => {
    try {
      const response = await axios.get(`http://localhost:5005/tasks/owner/${usercode}`);
      const tasksData = response.data;

      const tasksWithUsersAndResults = await Promise.all(tasksData.map(async (task) => {
        const connectedUsersResponse = await axios.get(`http://localhost:5005/tasks/connectedUsers/${task._id}`);
        const connectedUsers = connectedUsersResponse.data;

        const userResultsResponse = await axios.get(`http://localhost:5005/userResults/${task._id}`);
        const userResults = userResultsResponse.data;

        return { ...task, connectedUsers, userResults };
      }));

      return tasksWithUsersAndResults;
    } catch (error) {
      console.error('Error fetching tasks with users and results by owner code:', error);
      throw error;
    }
  },
  // комментарии
  GetCommentsByObjectReference: async (objectReference) => {
    try {
      const response = await axios.get(`http://localhost:5007/comments/${objectReference}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  CreateComment: async (usercode, commentInput, objectReference) => {
    try {
      await axios.post('http://localhost:5007/comments', {
        owner: usercode,
        content: commentInput,
        objectReference: objectReference,
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },
};

export default API;