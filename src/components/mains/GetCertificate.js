import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button, CircularProgress } from '@mui/material';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font, PDFDownloadLink, Image } from '@react-pdf/renderer';
import Cookies from 'js-cookie';
import API from '../../api';

const GetCertificate = ({ name, date }) => {
  const { webtype, webcode } = useSelector((state) => state.webData);
  const usercode = useSelector((state) => state.code.usercode); 
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [webcode]);
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {

    API.GetUserByCode(usercode)
    .then((data) => {
      setUserData(data);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
  };

  const PDFDocument = () => {
    return (
      <Document>
       <Page size="A4" style={styles.page} orientation="landscape">
          <View style={styles.section}>                       
            <Text style={styles.text1}>{userData.firstName} {userData.lastName}</Text>
            <Text style={styles.text4}>{webtype === 'lecture' ? 'лекции' : webtype === 'webinar' ? 'вебинаре' : webtype === 'training' ? 'тренинге' : null}</Text>
            <Text style={styles.text2}>"{name}"</Text>
            <Text style={styles.text3}>{webtype === 'lecture' ? new Date().toLocaleString() : date}</Text>
            <Image style={styles.image} src="WLTCertificate.png" />
          </View>
        </Page>
      </Document>
    );
  };
  
  Font.register({
    family: "Roboto",
    src:
      "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
  });

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#ffffff',
      fontFamily: 'Roboto',
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
      width: '100%',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      zIndex: -1,
    },
    text1: {
      fontSize: 40,      
      top: 200,    
      marginLeft: "auto",
      marginRight: "auto",
      fontWeight: 'bold',
    },
    text4: {
      fontSize: 10,
      top: 213,     
      marginLeft: "auto",
      marginRight: "auto",
      fontWeight: 'bold',
    },
    text2: {
      fontSize: 24,
      top: 220,    
      marginLeft: "auto",
      marginRight: "auto",
      fontWeight: 'bold',
    },
    text3: {
      top: 300,
      left: 80,
      fontSize: 13,
      fontWeight: 'bold',
    },
  }); 

  return (
    <>
     {(userData) && (
           <PDFDownloadLink document={<PDFDocument />} fileName={`certificate_${webtype}_${userData.firstName}_${userData.lastName}.pdf`}>
           {({ blob, url, loading, error }) => (
            <Button
            variant="contained"
            disabled={loading}
            startIcon={<CardMembershipIcon />}
            onClick={loading ? null : () => { }}
            style={{ backgroundColor: 'purple', color: 'white', width: 'auto' }}
          >
            {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Получить сертификат'}
          </Button>
           )}
         </PDFDownloadLink>
     )}
    </>
  );
};

export default GetCertificate;
