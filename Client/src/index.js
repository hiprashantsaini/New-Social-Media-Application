import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import CreatePost from './components/createPost/CreatePost';
import Home from './components/Home';
import LandingPage from './components/loginUser/LandingPage';
import Login from './components/loginUser/Login';
import NotFound from './components/NotFound';
import Profile from './components/profile/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './components/signUp/Signup';
import Subscription from './components/subscriptionPlan/Subscription';
import { CLIENT_ID } from './config';
import ContextProvider, { AppContext } from './context/AppContext';
import './index.css';
import reportWebVitals from './reportWebVitals';


const PublicRoute = () => {
  const { isAuthenticated,setIsAuthenticated } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  const getUserProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/auth/profile", { withCredentials: true });
      if (res) {
        setIsAuthenticated(true);
        console.log("res protectedRoute :",res);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false); // Set loading to false after authentication check
    }
  };

  useEffect(() => {
    if(!isAuthenticated){
      getUserProfile();
    }
  }, []);

  // If still loading the authentication status, show a loader
  useEffect(() => {
    setLoading(false);  // Adjust this logic based on your app's authentication flow
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is authenticated, redirect to /home
  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};
const appRoutes = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />, // Protecting all routes under "/"
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'subscription',
        element: <Subscription />
      },
      {
        path: 'createpost',
        element: <CreatePost />
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  },
  {
    path: '/login',
    element: <PublicRoute />, // Public route for login
    children: [
      {
        path: '',
        element: <LandingPage />,// Only render Login if user is not authenticated
        children:[
          {
            path:'',
            element:<Login/>
          }
        ]
      }
    ]
  },
  {
    path: '/signup',
    element: <PublicRoute />, // Public route for signup
    children: [
      {
        path: '',
        element: <LandingPage />,// Only render Signup if user is not authenticated
        children:[
          {
            path:'',
            element:<Signup/>
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  // </React.StrictMode>//// Rendering two times but important to use for production

  <ContextProvider>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <RouterProvider router={appRoutes} />
    </GoogleOAuthProvider>
  </ContextProvider>

);

reportWebVitals();
