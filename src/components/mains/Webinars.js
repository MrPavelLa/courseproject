import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveWebData, clearWebData } from '../../store/actions/action4';
import Modal from './WLTmodel';

const Webinars = () => {
  const { webtype, webcode } = useSelector((state) => state.webData);
  const dispatch = useDispatch();
 
  useEffect(() => {
     dispatch(saveWebData('webinar', null));
  }, []);

  return (
    <Modal/>
  );

};

export default Webinars;
