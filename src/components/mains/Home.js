import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../../styles/Home.css';
import axios from 'axios';
import ModalRegistration from './ModalRegistration';
import GetRandom from './GetRandom';
import { Button, Typography } from '@mui/material';
import API from '../../api';

const Home = () => {
  const userrole = useSelector((state) => state.role.userrole);
  const usercode = useSelector((state) => state.code.usercode);
  const images = ['/image1.png', '/image2.png', '/image3.png'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dcapacity, setDcapacity] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if(usercode !== null)
    {
    fetchCapacity();
    }
  }, [usercode]);
  const fetchCapacity = async () => {
    API.GetUserByCode(usercode)
    .then((data) => {
      setDcapacity(data.dCapacity);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
  };

  const updateDCapacity = async (newDCapacity) => {
    await API.UpdateUserCapacity(usercode, newDCapacity);
  };
  const tariffs = [
    { name: 'Базовый', participants: 5, cost: 0 },
    { name: 'Основной', participants: 20, cost: 15 },
    { name: 'Стартап', participants: 50, cost: 30 },
    { name: 'Профессионал', participants: 75, cost: 50 },
    { name: 'Коммерческий', participants: 100, cost: 75 },
    { name: 'Корпоративный', participants: 150, cost: 100 },
  ];

  return (
    <>
      <div className='Home1'>
        <img src={images[currentImageIndex]} alt={`image${currentImageIndex + 1}`} className="image_Home" />
        <div className='Text_Home1_Cont'>
          <p className='Home1_1'>Совместная работа и обучениев режиме реального времени</p>
          <p className='Home1_2'>Платформа для создания и проведения видеоконференций, вебинаров, лекций, курсов, тестов и опросов</p>
          {(!userrole) &&
            (<ModalRegistration />)
          }

          <ul className='ul_Home1'>
            <li>&#10003; Бесплатный тариф после регистрации</li>
            <li>&#10003; Регистрация без привязки к картам</li>
            <li>&#10003; Входим в реестр российского ПО</li>
          </ul>
          <p className='Home1_3'>Присоединяйтесь к нашему сообществу! Регистрируйтесь сегодня, чтобы получить доступ к миру образования и развития онлайн.</p>
        </div>
      </div>
      {(userrole === 'user' || userrole === null) && (
        <div className='Home2'>
          <p className='Home2_1'>НАЧНИТЕ ПРЯМО СЕЙЧАС</p>
          <div className='Random'>
            <div className='RandomTraining'>
              <GetRandom
                type='webinar'
              />
            </div>
            <div className='RandomWebinar'>
              <GetRandom
                type='lecture'
              />
            </div>
            <div className='RandomTraining'>
              <GetRandom
                type='training'
              />
            </div>
          </div>
        </div>
      )}
      {userrole === 'organizer' && (
        <div className='Home2'>
          <p className='Home2_1'>ТАРИФЫ</p>
          <div className='Tarifs'>
            {tariffs.map((tariff, index) => (
              <div key={index} className='Tarif'>
                <p className='tarifName'>{tariff.name}</p>
                <p className='capacityCount'><span style={{ "fontWeight": "bold" }}>{`${tariff.participants}`}</span> участников</p>
                {dcapacity === tariff.participants ? (
                  <Typography variant="body1" className='tarifCost'>
                    Ваш план
                  </Typography>
                ) : (
                  <Button className='tarifCost' onClick={() => updateDCapacity(tariff.participants)}>
                    {`$${tariff.cost}`}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
