import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { sendToVercelAnalytics } from './vitals';
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';



// Load environment variables from .env

const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    
  
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  
    
  </React.StrictMode>
);

reportWebVitals(sendToVercelAnalytics);




