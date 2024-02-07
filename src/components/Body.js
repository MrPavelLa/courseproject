import Header from './headers/Header';
import Main from './mains/Main';
import Footer from './footers/Footer';
import React, { useEffect } from 'react';
import { clearCode } from '../store/actions/action1';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

const Body = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const cleanupOnUnload = () => {
      Cookies.remove('jwt');
      dispatch(clearCode());
    };

    window.addEventListener('beforeunload', cleanupOnUnload);

    return () => {
      window.removeEventListener('beforeunload', cleanupOnUnload);
    };
  }, [dispatch]);

  return (
    <div>
      <header>
        <Header />
      </header>
      <main>
        <Main />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Body;
