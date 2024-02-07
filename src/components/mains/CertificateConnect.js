import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Cookies from 'js-cookie';
import API from '../../api';

const CertificateConnect = ({ userid, isGived }) => {
  const { webtype, webcode } = useSelector((state) => state.webData);
  const usercode = useSelector((state) => state.code.usercode);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [webcode]);

  const handleAddCertificateTo = async () => {
    try {
      if (webtype === 'lecture') {
        await API.AddUserToCertificateLecture(webcode, userid);
      } else if (webtype === 'webinar') {
        await API.AddUserToCertificateWebinar(webcode, userid);
      } else if (webtype === 'training') {
        await API.AddUserToCertificateTraining(webcode, userid);
      }
  
    } catch (error) {
      console.error('Error adding user:', error.message);
    }
  };

  const fetchUserData = async () => {

    API.GetUserByCode(userid)
    .then((data) => {
      setUserData(data);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
  };


  return (
    <>
      {userData && (
        <>
          <p>{userData.firstName} {userData.lastName}&nbsp;&nbsp;</p>
          {!isGived ? (
            <IconButton onClick={handleAddCertificateTo}>
              <PersonAddIcon color="primary" />
            </IconButton>
          ) : (
            <p><span style={{color: "red"}}>Уже выдан</span></p>
          )}
        </>
      )}
    </>
  );
};

export default CertificateConnect;
