import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Webinars from './Webinars';
import Lectures from './Lectures';
import Trainings from './Trainings';
import Tasks from './Tasks';
import Test from './Test';
import WLTPage from './WLTPage';
import Reports from './Reports';
import Users from './Users';

const Main = () => {
  return (
    <Routes>
      <Route path="Home" element={<Home />} />
      <Route path="Webinars" element={<Webinars />} />
      <Route path="Lectures" element={<Lectures />} />
      <Route path="Trainings" element={<Trainings />} />
      <Route path="Tasks" element={<Tasks />} />
      <Route path="Test" element={<Test />} />
      <Route path="WLTPage" element={<WLTPage />} />
      <Route path="Reports" element={<Reports />} />
      <Route path="Users" element={<Users />} />
    </Routes>
  );
};

export default Main;
