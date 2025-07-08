import axios from 'axios';
import { toast } from 'react-toastify';
//import { useGlobalStore } from '../store/useAppStore';


const httpUtil = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'x-api-key': import.meta.env.VITE_API_KEY_VALUE,
  },
});

httpUtil.interceptors.request.use((config) => {
  const appSate = localStorage.getItem(import.meta.env.VITE_API_USER_APP_STATE_NAME); 
  const token = appSate ? JSON.parse(appSate).token : null;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; 
  }
  return config;
});

httpUtil.interceptors.response.use(
  (response) => {
    return response; 
  },
  (error) => {

    if (error.response) {
      const { status, detail } = error.response.data;

      // const appState = localStorage.getItem(import.meta.env.VITE_API_USER_APP_STATE_NAME);
      // const language: string = appState ? JSON.parse(appState).language : 'es';

      // const langKey = language as keyof typeof translations; // Asegurar que language es una clave válida
      // const errorTranslations = translations[langKey]?.errorsCode || {}; // Obtener errores traducidos
      
      // const errorKey = errorCode as keyof typeof errorTranslations;
      
      // let errorCodeFromTranslate = errorTranslations[errorKey] || errorCode || 'Error desconocido';
      
      // if (!errorCode && detail) {
      //   errorCodeFromTranslate = detail;
      // } else if (!errorCode && message) {
      //   errorCodeFromTranslate = message;
      // }

3
      if (error.response.status === 401) {
        localStorage.removeItem(import.meta.env.VITE_API_USER_APP_STATE_NAME);        
        console.log('redirigiendo a login');

        const base = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
        window.location.href = `${base}login`;

      }

      if (error.response.status === 403) {
        toast.error(
          `Error: no tienes acceso a realizar esta acción`,
          {
            position: 'bottom-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }


      if (status >= 400 && status < 500) {

        toast.error(
          `Error ${status}: ${detail || 'Error no especificado'}`,
          {
            position: 'bottom-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }

      if (status == 500) {
        toast.error(
          `Error ${status}: ${ detail || 'Ocurrió un error inesperado'}`,
          {
            position: 'bottom-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }

    } else {
 
      if (error.code === "ERR_CANCELED") {
        console.log('Error de conexión hub');
        return Promise.reject(error);
      }

      toast.error('Error general. Por favor, inténtalo de nuevo.', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    return Promise.reject(error);
  }
);

export default httpUtil;