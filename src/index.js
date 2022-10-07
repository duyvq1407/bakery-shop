import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'antd/dist/antd.min.css';
import App from './App';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { store, persistor } from './app/store';
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/vi_VN';
import 'react-toastify/dist/ReactToastify.css';
import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <ConfigProvider locale={locale}>
            <App />
          </ConfigProvider>
        </HelmetProvider>
      </PersistGate>
    </BrowserRouter>
  </Provider>
);
