import axios from 'axios';
import React, { useContext, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { langContent } from '../../languagesText';
import './signup.css';
const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const {lang}=useContext(AppContext);

    const navigate = useNavigate();
    const content=langContent[lang] || langContent['en'];
    //register OR signup user
    const signupUser=async(e)=>{
        e.preventDefault();
        try {
            console.log(name,email,password,phone)
            const res=await axios.post('https://new-social-media-application.onrender.com/api/auth/signup',{name,email,phone,password},{withCredentials:true});
            console.log("resv:",res)
            if(res){
                toast(`${content.sign_up.alerts.register_success}`);
                setName('');
                setEmail('')
                setPassword('')
                navigate('/login');
                return
            }
            setName('');
            setEmail('')
            setPassword('')
            toast.error(`${content.sign_up.alerts.tryagain}`);

        } catch (error) {
            toast.error(`${content.sign_up.alerts.alert_error}`);
        }
    }
    return (
        <div id='signup'>
            <ToastContainer/>
            <h1>Signup</h1>
            <div className='signup-body'>
                <div className='signup-form'>
                    <form onSubmit={signupUser}>
                        <input type='text' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)} required />
                        <input type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <PhoneInput
                            country='in'
                            className="phone-button"
                            onChange={(value) => setPhone(value)}
                            required
                        />
                        <input type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type='submit' className='submit-button'>{content.sign_up.signup}</button>
                    </form>
                    <h2>OR</h2>
                    <p><Link to={'/login'}>{content.sign_up.have_account}?</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Signup;
