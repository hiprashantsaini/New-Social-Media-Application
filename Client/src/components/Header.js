import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { AppContext } from "../context/AppContext";
import { langContent } from '../languagesText';

const Header=()=>{
  const [showMenuIcon,setShowMenuIcon]=useState(true);
  const [newLang,setNewLang]=useState('');
  const {lang,setLang,userInfoFlag,setUserInfoFlag,setIsAuthenticated}=useContext(AppContext);
  const content=langContent[lang] || langContent['en']; 

  const navigate=useNavigate();
  const handleLanguageChange=async(e)=>{
    e.preventDefault();
    try {
       await axios.post('https://new-social-media-application.onrender.com/api/auth/changelanguage',{language:e.target.value},{withCredentials:true});

       setLang(newLang);
       setUserInfoFlag(!userInfoFlag);
       // Remove all previous attributes
       const bodyAttributes=document.body.attributes;
      
       for( let i=0; i<bodyAttributes.length ; i++){
         document.body.removeAttribute(bodyAttributes[i].name)
       }
       setNewLang('');
    } catch (error) {
      console.log("lang error :",error)
       toast.error(`${content.sign_up.alerts.tryagain}`)
       setNewLang('');

    }
    
  }

  const handleLogout=async()=>{
    try {
      await axios.get("https://new-social-media-application.onrender.com/api/auth/logout",{withCredentials:true});
      toast.success("Logout successfull");
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
       console.log(error);
    }
 }

    return(
        <div className="header">
          <MenuIcon className={showMenuIcon ? "menu-icon active-menu-icon" : "menu-icon" } onClick={()=>setShowMenuIcon(false)} />
          <div className={showMenuIcon ? "navbar" : "navbar activeNav"}>
              <ul>
                <CloseIcon className='closeMenu-icon' onClick={()=>setShowMenuIcon(true)} style={{left:'10px'}}/>
                <li className="active"><Link to={"/"}>{content.navbar.home}</Link></li>
                <li><Link to={"/subscription"}>{content.navbar.premium}</Link></li>
                <li><Link to={"/profile"}>{content.navbar.profile}</Link></li>
                <li onClick={handleLogout} style={{cursor:"pointer"}}>Logout</li>
              </ul>
          </div>
            <select className="select-langs"  value={lang} onChange={(e)=>{
              setNewLang(e.target.value);
              handleLanguageChange(e);
            }}>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="pt">Portuguese</option>
                    <option value="ta">Tamil</option>
                    <option value="bn">Bengali</option>
                    <option value="fr">French</option>
            </select>
        </div>
    )
}

export default Header;