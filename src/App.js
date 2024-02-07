import Body from './components/Body'
import './App.css';
import { Provider } from 'react-redux';
import store from './store/store';

const App = () => {
  return (
    <Provider store={store}>
      <body>
        <Body />
      </body>
    </Provider>
  );
};

export default App;