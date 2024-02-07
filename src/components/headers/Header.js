import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Profile from './Profile';
import axios from 'axios';
import { useSelector } from 'react-redux';
import '../../styles/Header.css';
import API from '../../api';

const Header = () => {
  const [selectedCategory, setSelectedCategory] = useState('0');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const usercode = useSelector((state) => state.code.usercode);
  const userrole = useSelector((state) => state.role.userrole);
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/Home');
  }, []);

  useEffect(() => {
    if (usercode !== null) {
      fetchData();
    }

  }, [usercode]);

  const fetchData = async () => {
    API.GetUserByCode(usercode)
    .then((data) => {
      setUserData(data);
    })
    .catch((error) => {
      console.error('Error fetch users:', error);
    });
  };

  const openProfile = () => {
    setIsProfileOpen(true);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };
  const navItems = userrole === 'admin'
  ? [
    { to: '/Home', text: 'Главная' },
    { to: '/Webinars', text: 'Вебинары' },
    { to: '/Lectures', text: 'Лекции' },
    { to: '/Trainings', text: 'Тренинги' },
    { to: '/Users', text: 'Пользователи' },
  ]
  : [
    { to: '/Home', text: 'Главная' },
    { to: '/Webinars', text: 'Вебинары' },
    { to: '/Lectures', text: 'Лекции' },
    { to: '/Trainings', text: 'Тренинги' },
    { to: '/Tasks', text: 'Задания' },
  ];

  const handleItemClick = (index) => {
    setSelectedCategory((prevIndex) => (prevIndex === index ? prevIndex : index));
  };

  return (
    <div className='header_conteiner'>
      <img src="/logo.png" alt="logo" className="logo" />

      <div className="nav-container">
        {navItems.map((item, index) => (
          <button
            className={`link ${selectedCategory === index ? 'selected' : ''}`}
            key={index}
            onClick={() => handleItemClick(index)}
          >
            <Link to={item.to} style={{ textDecoration: 'none', color: 'white' }}>{item.text}</Link>
          </button>
        ))}
        {selectedCategory !== null && (
          <div className='shell' style={{ left: `calc(${171 * selectedCategory + 171 / 2}px)` }}></div>
        )}
      </div>

      <button className="Profile" onClick={openProfile}>
        {userData ? (
          <img src={`./image/${userData.logo}`} alt="ProfilePhoto" className="ProfilePhoto" />
        ) : (
          <img src="NoProfile.jpg" alt="DefaultProfilePhoto" className="DefaultProfilePhoto" />
        )}
      </button>

      {isProfileOpen && (
        <Profile
          closeProfile={closeProfile}
        />
      )}
      <Outlet />
    </div>
  );
};

export default Header;
