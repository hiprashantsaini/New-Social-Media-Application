import axios from 'axios';
import React, { useContext, useState } from 'react';
import 'react-phone-input-2/lib/style.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { langContent } from '../../languagesText';
import './login.css';
const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // useContext hook 
    const { userInfo, setUserInfo, isAuthenticated, setIsAuthenticated, setPlanInfo, lang } = useContext(AppContext);

    const content = langContent[lang] || langContent['en'];

    const navigate = useNavigate();

    // Login user With login form
    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/auth/login', { email,password }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (!res.data.status) {
                toast.error(`${res.data.message}`)
                return;
            }
            setUserInfo(res);
            setIsAuthenticated(true);
            alert(`${content.login.alerts.login_success}`)
            setEmail('')
            setPassword('')
            const plans = res.data.user?.subscription.filter((item) => item.isActive === true);
            setPlanInfo(plans);
            localStorage.setItem('token', res.data?.token);
            navigate('/');
        } catch (error) {
            if (error.response.status === 403) {
                toast.error(`${content.login.alerts.mobile_access_time}`)
            } else {
                toast.error(`${content.login.alerts.login_error}`);
            }
        }
    }
    return (
        <div id='login'>
            <ToastContainer />
            <h1>Login</h1>
            <div className='login-body'>
                <div className='login-form'>
                    <form onSubmit={loginUser}>
                        <input type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type='submit' className='submit-button'>{content.login.login}</button>
                    </form>
                    <h2>OR</h2>
                    <p><Link to={'/signup'}>{content.login.donthave}</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login;


