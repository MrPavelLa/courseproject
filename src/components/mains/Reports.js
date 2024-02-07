import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import * as FileSaver from 'file-saver';
import axios from 'axios';
import '../../styles/Footer.css';
import { TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import API from '../../api';


const Reports = () => {
  const { webtype, webcode } = useSelector((state) => state.webData);
  const userrole = useSelector((state) => state.role.userrole);
  const usercode = useSelector((state) => state.code.usercode);
  const [data, setData] = useState(null);

  const [userData, setUserData] = useState(null);
  const [code, setCode] = useState('');
  const [organizerReportType, setOrganizerReportType] = useState('webinars');
  const [userReportType, setUserReportType] = useState('webinars');

  useEffect(() => {
    if(userrole !== 'admin'){
    setCode(usercode);
    }
    fetchData();
    fetchAllData();
  }, [userReportType, organizerReportType]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  useEffect(() => {
    if(userrole !== 'admin'){
      setCode(usercode);
      }
  }, [usercode]);

  const fetchData = async () => {
    API.GetUserByCode(usercode)
    .then((data) => {
      setUserData(data);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
  };

  const fetchAllData = async () => {
    const token = Cookies.get('jwt');
    try {
      const webinarsData = await API.GetAllWebinars();
  
      const lecturesData = await API.GetAllLectures();
  
      const trainingsData = await API.GetAllTrainings();
  
      const webinarsWithType = webinarsData.map((webinar) => ({ ...webinar, type: 'webinar' }));
      const lecturesWithType = lecturesData.map((lecture) => ({ ...lecture, type: 'lecture' }));
      const trainingsWithType = trainingsData.map((training) => ({ ...training, type: 'training' }));
  
      const allData = [...webinarsWithType, ...lecturesWithType, ...trainingsWithType];
  
      setData(allData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const exportToTxtUser = () => {
    const fileType = 'text/plain;charset=UTF-8';
    const fileExtension = '.txt';
      const titles = data.map(item => item.title);
    const maxTitleLength = Math.max(...titles.map(title => title.length));
    const headerLines = [
      new Date().toLocaleString(),
      `${userData.firstName} ${userData.lastName}`,
      `Тип\tНазвание${' '.repeat(maxTitleLength - 'Название'.length)}\tДата${' '.repeat(12 - 'Дата'.length)}\tСтоимость\t\tВыдан сертификат`,
    ];

    const txtData = headerLines.join('\n') + '\n' +
      data
        .filter((item) => {
          if (userReportType === 'all') {
            return item.accessibleTo.includes(code);
          } else if (userReportType === 'webinars' && item.type === 'webinar') {

            return item.accessibleTo.includes(code);
          } else if (userReportType === 'lectures' && item.type === 'lecture') {

            return item.accessibleTo.includes(code);
          } else if (userReportType === 'trainings' && item.type === 'training') {

            return item.accessibleTo.includes(code);
          }
        })
        .map((item) => {
          let hasCertificate = item.certificates.includes(code);
  
          let paddedTitle = item.title.padEnd(maxTitleLength, ' ');
          let dateValue = item.datetime ? new Date(item.datetime).toLocaleDateString() : "*";
        let paddedDate = dateValue === "*" ? `*${' '.repeat(12 - 1)}` : `${dateValue}${' '.repeat(12 - dateValue.length)}`;

  
          let transactionData = `${item.type}\t${paddedTitle}\t${paddedDate}\t${item.cost}\t\t${hasCertificate}`;
  
          return transactionData;
        })
        .join('\n');
  
    const txtBlob = new Blob([txtData], { type: fileType });
    FileSaver.saveAs(txtBlob, `transactions_${code}_${userData.lastName}${fileExtension}`);
  };

  const exportToTxtAdmin = () => {
    if(userData.dCapacity >0){
      exportToTxtOrganizer();
    }
    else{
      exportToTxtUser();
    }
  };

  const exportToTxtOrganizer = () => {
    const fileType = 'text/plain;charset=UTF-8';
    const fileExtension = '.txt';

    const headerLines = [
      new Date().toLocaleString(),
      `${userData.firstName} ${userData.lastName}`,
      'Тип\t\tНазвание\t\tДата\t\tСтоимость\t\tВКол-во подписок\t\tВы заработали',
    ];

    const txtData = headerLines.join('\n') + '\n' +
      data
        .filter((item) => {
          if (organizerReportType === 'all') {

            return item.owner.includes(code);
          } else if (organizerReportType === 'webinars' && item.type === 'webinar') {

            return item.owner.includes(code);
          } else if (organizerReportType === 'lectures' && item.type === 'lecture') {

            return item.owner.includes(code);
          } else if (organizerReportType === 'trainings' && item.type === 'training') {

            return item.owner.includes(code);
          }
        })
        .map((item) => {
          let AllCost = item.enrolledCount * item.cost;

          let transactionData = `${item.type}\t\t${item.title}\t\t${item.datetime ? new Date(item.datetime).toLocaleDateString() : "-"}\t\t${item.cost}\t\t${item.enrolledCount}\t\t${AllCost}рублей`;

          return transactionData;
        })
        .join('\n');

    const txtBlob = new Blob([txtData], { type: fileType });
    FileSaver.saveAs(txtBlob, `transactions_${code}_${userData.lastName}${fileExtension}`);
  };

  return (
    <div className='Reports'>
      {(userrole === 'admin') && (
        <>
          <p>получить отчет по пользователю с кодом</p>
          <TextField
            type="text"
            placeholder="Введите код пользователя"
            value={code}
            onChange={handleCodeChange}
          />
          <Button onClick={() => exportToTxtAdmin()}>Сгенерировать отчет</Button>
        </>
      )}
  
      {(userrole === 'user' || userrole === 'organizer') && (
        <>
          <p>
            получить отчет по
            <Select
              value={userrole === 'user' ? userReportType : organizerReportType}
              onChange={(e) => (userrole === 'user' ? setUserReportType(e.target.value) : setOrganizerReportType(e.target.value))}
            >
              <MenuItem value="webinars">вебинарам</MenuItem>
              <MenuItem value="lectures">лекциям</MenuItem>
              <MenuItem value="trainings">тренингам</MenuItem>
              <MenuItem value="all">всем</MenuItem>
            </Select>
            <Button onClick={() => (userrole === 'user' ? exportToTxtUser() : exportToTxtOrganizer())}>
            <GetAppIcon/>
            </Button>
          </p>
        </>
      )}
    </div>
  );
};

export default Reports;
