import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
// redux
import { store, persistor } from './redux/store';
//
import App from './App';
// ----------------------------------------------------------------------

ReactDOM.render(
  <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </ReduxProvider>,
  document.getElementById('root')
);