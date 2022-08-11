import Provider from 'react-redux/es/components/Provider';
import App from './App';
import store from './redux';
// ----------------------------------------------------------------------

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);