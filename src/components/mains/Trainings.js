import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveWebData, clearWebData } from '../../store/actions/action4';
import Modal from './WLTmodel';

const Trainings = () => {
  const { webtype, webcode } = useSelector((state) => state.webData);
  const dispatch = useDispatch();
 
  useEffect(() => {
     dispatch(saveWebData('training', null));
  }, []);

  return (
    <Modal/>
  );

};

export default Trainings;




// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import Cookies from 'js-cookie';
// import axios from 'axios';
// import '../../styles/Webinars.css';
// import WebinarModal from './WebinarModal';

// const Trainings = () => {
//   const userrole = useSelector((state) => state.role.userrole);
//   const usercode = useSelector((state) => state.code.usercode);
//   const [trainings, setTrainings] = useState(null);
//   const [myTrainingsCollapsed, setMyTrainingsCollapsed] = useState(false);
//   const [visibleTrainings, setVisibleTrainings] = useState(10);

//   useEffect(() => {
//     fetchAllData();
//   }, [userrole]);

//   const fetchAllData = async () => {
//     try {
//       const token = Cookies.get('jwt');
//       const response = await axios.get(`http://localhost:5004/trainings`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setTrainings(response.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const toggleMyTrainings = () => {
//     setMyTrainingsCollapsed(!myTrainingsCollapsed);
//     if (!myTrainingsCollapsed) {
//       fetchAllData();
//     }
//   };

//   const handleLoadMore = () => {
//     setVisibleTrainings((prevVisibleTrainings) => prevVisibleTrainings + 10);
//   };

//   const startWebinar = (id) => {
//     // dispatch(saveWebData('webinar', id));
//     // navigate('/WebinarPage');
//   };

//   return (
//     <div className={`Webinars ${myTrainingsCollapsed ? 'collapsed' : ''}`}>
//       <div className='toggleButton' onClick={toggleMyTrainings}>
//         {myTrainingsCollapsed ? 'Развернуть мои тренинги\u25BC' : 'Свернуть мои тренинги\u25B2'}
//       </div>
//       <div className={`MyWeb ${myTrainingsCollapsed ? 'collapsed' : ''}`}>
//         <h2>Ваши записи:</h2>
//         {trainings &&
//           trainings
//             .filter((training) => training.accessibleTo.includes(usercode))
//             .map((training) => (
//               <div key={training._id} className='webCont'>
//                 <img src={training.logo} alt={`Logo for ${training.title}`} />
//                 <div>
//                   <h3>{training.title}</h3>
//                   <p>Speaker: {training.speaker}</p>
//                   <p>Duration: {training.duration}</p>
//                   <p>Date and Time: {new Date(training.datetime).toLocaleString()}</p>
//                   <p>Short Description: {training.shortDescription}</p>
//                   <p>Cost: {training.cost}</p>
//                   <p>Rating: {training.rating}</p>
//                   {(new Date() > new Date(training.datetime) && new Date() < new Date(training.datetime).getTime() + training.duration * 60 * 1000) &&
//                     <button onClick={() => startWebinar(training._id)}>Перейти</button>
//                   }
//                 </div>
//               </div>
//             ))}
//       </div>
//       <div className='Webinars'>
//         <h2>Доступные тренинги:</h2>
//         {trainings &&
//           trainings
//             .filter((training) => !training.accessibleTo.includes(usercode))
//             .slice(0, visibleTrainings)
//             .map((training) => (
//               <div key={training._id} className='webCont'>
//                 <img src={training.logo} alt={`Logo for ${training.title}`} />
//                 <div>
//                   <h3>{training.title}</h3>
//                   <p>Speaker: {training.speaker}</p>
//                   <p>Duration: {training.duration} минуты</p>
//                   <p>Date and Time: {new Date(training.datetime).toLocaleString()}</p>
//                   <p>Short Description: {training.shortDescription}</p>
//                   <p>Cost: {training.cost}</p>
//                   <p>Rating: {training.rating}</p>
//                   {training.enrolledCount < training.capacity && (
//                     <WebinarModal id={training._id} url='5004/trainings' />
//                   )}
//                 </div>
//               </div>
//             ))}
//         {trainings && trainings.length > visibleTrainings && (
//           <button onClick={handleLoadMore}>Загрузить еще 10</button>
//         )}
//       </div>

//     </div>
//   );
// };

// export default Trainings;
