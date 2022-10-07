import { Helmet } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import './App.css';
import AppRoutes from './routes/routes';

function App() {
  return (
    <div>
      <Helmet>
        <title>Bakery Shop</title>
        <meta name='description' content='Bakery Shop' />
      </Helmet>
      <AppRoutes />
      <ToastContainer 
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
      />
    </div>
  );
}

export default App;
