import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveWebData, clearWebData } from '../../store/actions/action4';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import '../../styles/WLTstyle.css';
import CreateBlock from './CreateBlock';
import WLTModal from './WLTModal';
import FilterBlock from './FilterBlock';
import { Button } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import GetCertificate from './GetCertificate';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import API from '../../api';

const WLTmodel = () => {
  const dispatch = useDispatch();
  const { webtype, webcode } = useSelector((state) => state.webData);
  const userrole = useSelector((state) => state.role.userrole);
  const usercode = useSelector((state) => state.code.usercode);
  const [data, setData] = useState(null);
  const [myCollapsed, setMyCollapsed] = useState(false);
  const [visible, setVisible] = useState(10);
  const navigate = useNavigate();
  const [sortByDateAsc, setSortByDateAsc] = useState(true);
  const [sortByCostAsc, setSortByCostAsc] = useState(true);

  useEffect(() => {
    setData(null);
    fetchAllData();
  }, [webtype, usercode]);

  const fetchAllData = async () => {
    try {
      let data;
  
      if (webtype === 'webinar') {
        data = await API.GetAllWebinars();
      } else if (webtype === 'lecture') {
        data = await API.GetAllLectures();
      } else if (webtype === 'training') {
        data = await API.GetAllTrainings();
      }
  
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const toggleMyCollapsed = () => {
    setMyCollapsed(!myCollapsed);
    if (!myCollapsed) {
      fetchAllData();
    }
  };

  const handleLoadMore = () => {
    setVisible((prevVisible) => prevVisible + 10);
  };

  const deleterecord = async (id) => {
    try {
      if (webtype === 'webinar') {
        await API.DeleteWebinar(id);
      } else if (webtype === 'lecture') {
        await API.DeleteLecture(id);
      } else if (webtype === 'training') {
        await API.DeleteTraining(id);
      }
  
      fetchAllData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };
  

  const startWebinar = (id) => {
    dispatch(saveWebData(webtype, id));
    navigate('/WLTPage');
  };

  const handleSortByDate = () => {
    setData((prevData) => [...prevData].sort((a, b) => {
      const dateA = new Date(a.datetime).getTime();
      const dateB = new Date(b.datetime).getTime();
      return sortByDateAsc ? dateA - dateB : dateB - dateA;
    }));
    setSortByDateAsc((prev) => !prev);
  };

  const handleSortByCost = () => {
    setData((prevData) => [...prevData].sort((a, b) => {
      return sortByCostAsc ? a.cost - b.cost : b.cost - a.cost;
    }));
    setSortByCostAsc((prev) => !prev);
  };

  return (
    <div className='WLTblock'>
      <FilterBlock onSortByDate={handleSortByDate} onSortByCost={handleSortByCost}
        webtype={webtype}
      />

      <div className='MyWLT'>

        {userrole === 'user' && (
          <div className='toggleButton' onClick={toggleMyCollapsed}>
            {myCollapsed ? (
              <>
                Развернуть мои{' '}
                {webtype === 'lecture' ? 'лекции' : webtype === 'webinar' ? 'вебинары' : webtype === 'training' ? 'тренинги' : null}
                ▼
              </>
            ) : (
              <>
                Свернуть мои{' '}
                {webtype === 'lecture' ? 'лекции' : webtype === 'webinar' ? 'вебинары' : webtype === 'training' ? 'тренинги' : null}
                ▲
              </>
            )}
          </div>
        )}

        {data && userrole === 'user' && (
          <div className={`MyWeb ${myCollapsed ? 'collapsed' : ''}`}>
            <>
              <h2>
                Вы записаны на эти {webtype === 'lecture' ? 'лекции' : webtype === 'webinar' ? 'вебинары' : webtype === 'training' ? 'тренинги' : null}:
              </h2>
              {data
                .filter((item) => item.accessibleTo.includes(usercode))
                .map((item) => (
                  <div key={item._id} className='webCont'>
                    <img src={`./image/${item.logo}`} alt={`Logo for ${item.title}`} />
                    <div className='webContText'>
                      <h2>{item.title}</h2>
                      <p>
                        <span style={{ fontWeight: 'bold', color: 'blue' }}> Ведущий: </span>
                        {item.speaker}</p>
                      {webtype !== 'lecture' && (
                        <>
                          <p><QueryBuilderIcon />: {item.duration} минут</p>
                          <p><CalendarMonthIcon /> {new Date(item.datetime).toLocaleString()}</p>
                        </>
                      )}
                      <p>
                        <span style={{ fontWeight: 'bold', color: 'blue' }}> Описание: </span>
                        {item.shortDescription}
                      </p>
                      <p>
                        <span style={{ fontWeight: 'bold', color: 'blue' }}> Стоимость: </span>
                        {item.cost}рублей</p>
                      {webtype === 'lecture' && (
                        <Button variant="contained" color="primary" style={{ maxWidth: '150px' }} onClick={() => startWebinar(item._id)}>
                          Перейти
                        </Button>
                      )}

                      {new Date() > new Date(item.datetime) && new Date() < new Date(item.datetime).getTime() + item.duration * 60 * 1000 && (
                        <Button variant="contained" color="primary" style={{ maxWidth: '150px' }} onClick={() => startWebinar(item._id)}>
                          Перейти
                        </Button>
                      )}
                      {(item.certificates.includes(usercode)) &&
                        (
                          <GetCertificate name={item.title} date={webtype !== 'lecture' ? new Date(item.datetime).toLocaleString() : new Date()} />

                        )}
                    </div>
                  </div>
                ))}
            </>

          </div>
        )}
      </div>
      {userrole === 'organizer' && (
        <div className='Create'>
          <CreateBlock onCreate={fetchAllData} />
          <p style={{ color: 'transparent' }}>{webtype}</p>
        </div>
      )}

      <div className='AllWeb'>
        {data && (userrole === 'organizer') && (
          <>
            <h2>
              Ваши {webtype === 'lecture' ? 'лекции' : webtype === 'webinar' ? 'вебинары' : webtype === 'training' ? 'тренинги' : null}:
            </h2>
            {data
              .filter((item) => item.owner.includes(usercode))
              .map((item) => (
                <div key={item._id} className='webCont'>
                  <img src={`./image/${item.logo}`} alt={`Logo for ${item.title}`} />
                  <div className='webContText'>
                    <h2>{item.title}</h2>
                    <p>
                      <span style={{ fontWeight: 'bold', color: 'blue' }}> Ведущий: </span>
                      {item.speaker}</p>
                    {(webtype !== 'lecture') && (
                      <>
                        <p><QueryBuilderIcon /> {item.duration} минут</p>
                        <p><CalendarMonthIcon /> {new Date(item.datetime).toLocaleString()}</p>
                      </>
                    )}
                    <p>
                      <span style={{ fontWeight: 'bold', color: 'blue' }}> Описание: </span>
                      {item.shortDescription}
                    </p>
                    <p>
                      <span style={{ fontWeight: 'bold', color: 'blue' }}> Стоимость: </span>
                      {item.cost}рублей</p>
                    <p> {item.enrolledCount} / {item.capacity}</p>
                    <Button variant="contained" color="primary" style={{ maxWidth: '150px' }} onClick={() => startWebinar(item._id)}>
                      Перейти
                    </Button>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>

      <div className='AllWeb'>
        {(data && userrole !== 'organizer') && (
          <>
            <h2>
              Все {webtype === 'lecture' ? 'лекции' : webtype === 'webinar' ? 'вебинары' : webtype === 'training' ? 'тренинги' : null}:
            </h2>
            {data
              .filter((item) =>
              (!item.accessibleTo.includes(usercode) && !item.isdeleted &&
                ((webtype !== 'lecture' && new Date(item.datetime) > new Date()) ||
                  (webtype === 'lecture')))
              )
              .slice(0, visible)
              .map((item) => (
                <div key={item._id} className='webCont'>
                  <div className='webContImg'>
                    {(item.cost === 0) && (
                      <img src='free.png' alt='freelog' className='freelog' />
                    )}
                    <img src={`./image/${item.logo}`} alt={`Logo for ${item.title}`} />
                  </div>
                  <div className='webContText'>
                    <h3>{item.title}</h3>
                    <p>
                      <span style={{ fontWeight: 'bold', color: 'blue' }}> Ведущий: </span>
                      {item.speaker}</p>
                    {(webtype !== 'lecture') && (
                      <>
                        <p><QueryBuilderIcon /> {item.duration} минут</p>
                        <p><CalendarMonthIcon /> {new Date(item.datetime).toLocaleString()}</p>
                      </>
                    )}
                    <p>
                      <span style={{ fontWeight: 'bold', color: 'blue' }}> Описание: </span>
                      {item.shortDescription}
                    </p>
                    <p>
                      <span style={{ fontWeight: 'bold', color: 'blue' }}> Стоимость: </span>
                      {item.cost}рублей</p>
                    {userrole !== null ? (
                      item.enrolledCount < item.capacity || webtype === 'lecture' ? (
                        <WLTModal id={item._id} />
                      ) : (
                        <p style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '18px' }}>НЕДОСТУПЕН</p>
                      )
                    ) : (
                      <p style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '18px' }}>НЕОБХОДИМО ЗАРЕГЕСТРИРОВАТЬСЯ</p>
                    )}
                    {(userrole === 'admin') && (
                      <Button
                        className='DBut'
                        variant="button"
                        onClick={() => deleterecord(item._id)}
                        style={{ width: '10px' }}
                      ><DeleteOutlineIcon /></Button>)}
                  </div>
                </div>
              ))}
            {data.length > visible && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowDownwardIcon />}
                onClick={handleLoadMore}
              >
                Загрузить еще 10
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );


};

export default WLTmodel;