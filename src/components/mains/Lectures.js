import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveWebData, clearWebData } from '../../store/actions/action4';
import Modal from './WLTmodel';

const Lectures = () => {
  const { webtype, webcode } = useSelector((state) => state.webData);
  const dispatch = useDispatch();
 
  useEffect(() => {
     dispatch(saveWebData('lecture', null));
  }, []);

  return (
    <Modal/>
  );

};

export default Lectures;


// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import Cookies from 'js-cookie';
// import axios from 'axios';
// import '../../styles/Webinars.css';
// import WebinarModal from './WebinarModal';

// const Lectures = () => {
//   const userrole = useSelector((state) => state.role.userrole);
//   const usercode = useSelector((state) => state.code.usercode);
//   const [lectures, setLectures] = useState(null);
//   const [myLecturesCollapsed, setMyLecturesCollapsed] = useState(false);
//   const [visibleLectures, setVisibleLectures] = useState(10);

//   useEffect(() => {
//     fetchAllData();
//   }, [userrole]);

//   const fetchAllData = async () => {
//     try {
//       const token = Cookies.get('jwt');
//       const response = await axios.get(`http://localhost:5003/lectures`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setLectures(response.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const toggleMyLectures = () => {
//     setMyLecturesCollapsed(!myLecturesCollapsed);
//     if (!myLecturesCollapsed) {
//       fetchAllData();
//     }
//   };

//   const handleLoadMore = () => {
//     setVisibleLectures((prevVisibleLectures) => prevVisibleLectures + 10);
//   };

  // return (
  //   <div className={`Webinars ${myLecturesCollapsed ? 'collapsed' : ''}`}>
  //     <div className='toggleButton' onClick={toggleMyLectures}>
  //       {myLecturesCollapsed ? 'Развернуть мои лекции\u25BC' : 'Свернуть мои лекции\u25B2'}
  //     </div>
  //     <div className={`MyWeb ${myLecturesCollapsed ? 'collapsed' : ''}`}>
  //       <h2>Ваши записи:</h2>
  //       {lectures &&
  //         lectures
  //           .filter((lecture) => lecture.accessibleTo.includes(usercode))
  //           .map((lecture) => (
  //             <div key={lecture._id} className='webCont'>
  //               <img src={lecture.logo} alt={`Logo for ${lecture.title}`} />
  //               <div>
  //                 <h3>{lecture.title}</h3>
  //                 <p>Speaker: {lecture.speaker}</p>
  //                 <p>Short Description: {lecture.shortDescription}</p>
  //                 <p>Cost: {lecture.cost}</p>
  //                 <p>Rating: {lecture.rating}</p>
  //               </div>
  //             </div>
  //           ))}
  //     </div>
      {/* <div className='Webinars'>
  <h2>Доступные лекции:</h2>
  {lectures &&
    lectures
      .filter((lecture) => !lecture.accessibleTo.includes(usercode))
      .slice(0, visibleLectures)
      .map((lecture) => (
        <div key={lecture._id} className='webCont'>
          <img src={lecture.logo} alt={`Logo for ${lecture.title}`} />
          <div>
            <h3>{lecture.title}</h3>
            <p>Speaker: {lecture.speaker}</p>
            <p>Short Description: {lecture.shortDescription}</p>
            <p>Cost: {lecture.cost}</p>
            <p>Rating: {lecture.rating}</p>
            <WebinarModal id={lecture._id} url='5003/lectures' />
          </div>
        </div>
      ))}
  {lectures && lectures.length > visibleLectures && (
    <button onClick={handleLoadMore}>Загрузить еще 10</button>
  )}
</div> */}

  //   </div>
  // );
// };

// export default Lectures;
