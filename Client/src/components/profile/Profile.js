import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { langContent } from '../../languagesText';
import Footer from '../footer/Footer';
import './profile.css';
import ProfilePost from './ProfilePost';
const Profile = () => {
    const [postFlag, setPostFlag] = useState(false);
    const [userFlag, setUserFlag] = useState(false);
    const [newLang, setNewLang] = useState('');

    const { setPlanInfo, setUserInfoFlag, userInfoFlag, lang, setLang, userInfo, planInfo, setUserInfo, posts, setPosts, setIsAuthenticated } = useContext(AppContext);
    const content = langContent[lang] || langContent['en'];

    const userPosts = posts.filter((post) => post?.author?._id === userInfo.data?.user?._id)

    const navigate = useNavigate();

    const findUserInfo = async () => {
        try {
            const res = await axios.get('https://new-social-media-application.onrender.com/api/auth/profile', { withCredentials: true })
            if (res) {
                setUserInfo(res);
                // set plan detail.
                const plans = res.data.user?.subscription.filter((item) => item.isActive === true);
                setPlanInfo(plans);
                return;
            }
        } catch (error) {
            console.log("Token is expired or not present");
        }
    }

    const getAllPosts = async () => {
        try {
            const allPosts = await axios.get('https://new-social-media-application.onrender.com/api/post/getposts', { withCredentials: true });

            setPosts(allPosts.data.posts)
        } catch (error) {
            toast.error(`${content.profile.not_found}`);
        }
    }
    useEffect(() => {
        getAllPosts();
    }, [postFlag])

    useEffect(() => {
        findUserInfo();
    }, [userFlag])

    ////Handle language change.

    const handleLanguageChange = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://new-social-media-application.onrender.com/api/auth/changelanguage', { language: e.target.value }, { withCredentials: true });
            setLang(newLang);
            //  setUserInfoFlag(!userInfoFlag);
            setUserFlag(!userFlag);
            // Remove all previous attributes
            const bodyAttributes = document.body.attributes;

            for (let i = 0; i < bodyAttributes.length; i++) {
                document.body.removeAttribute(bodyAttributes[i].name)
            }

            setUserInfoFlag(!userInfoFlag);


            //  document.body.setAttribute(attribute?.themeKey,attribute?.themeValue);
            setNewLang('');
        } catch (error) {
            console.log("lang error :", error)
            toast.error(`${content.sign_up.alerts.tryagain}`)
            setNewLang('');

        }

    }

    const handleLogout = async () => {
        try {
            await axios.get("https://new-social-media-application.onrender.com/api/auth/logout", { withCredentials: true });
            toast.success("Logout successfull");
            setIsAuthenticated(false);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="profile-container">
            <header className="profile-header">
                <ToastContainer />
                <h1>{content.profile.your_profile}</h1>
                <nav className='profile-nav'>
                    <li><Link to="/">{content.profile.nav.home}</Link></li>
                    <li><a href='#details'>{content.profile.nav.details}</a></li>
                    <li><a href='#rewards'>{content.profile.nav.rewards}</a></li>
                    <li><a href='#subscription'>{content.profile.nav.subs}</a></li>
                    <li><a href='#language'>{content.profile.nav.langs}</a></li>
                    <li><a href='#posts'>{content.profile.nav.posts}</a></li>
                    <li style={{ cursor: "pointer" }} onClick={handleLogout}>Logout</li>
                </nav>
            </header>

            <div className="profile-body">
                <div className='section' id="details">
                    <h2>{content.profile.heading2}</h2>
                    <p><strong>{content.profile.name}:</strong> {userInfo?.data?.user?.name}</p>
                    <p><strong>{content.profile.email}:</strong> {userInfo?.data?.user?.email}</p>
                    <p><strong>{content.profile.phone}:</strong> +{userInfo?.data?.user?.phone}</p>
                </div>

                <div className='section' id='rewards'>
                    <h2>{content.profile.heading3}</h2>
                    <p><strong>{content.profile.points}:</strong> {userInfo.data.user.points}</p>
                    <p><strong>{content.profile.followers}:</strong> {userInfo.data.user.followers.length}</p>
                    <p><strong>{content.profile.followed}:</strong> {userInfo.data.user.followed.length}</p>
                </div>
                <div className='section' id='subscription'>
                    <h2>{content.profile.subs_plan}</h2>
                    <p><strong>{content.profile.free_plan}:</strong>{content.profile.always_active}</p>
                    {
                        planInfo && planInfo.map((plan) => <p key={plan._id}><strong>{plan.planId.name}:</strong> {plan.planId.postLimit} posts/day. End Date {plan.endDate}</p>)
                    }
                    <p><Link to={"/subscription"}>{content.profile.other_plan}</Link></p>
                </div>
                <div className='section' id='language'>
                    <h2>{content.profile.heading4}</h2>
                    <select value={lang} onChange={(e) => {
                        setNewLang(e.target.value)
                        handleLanguageChange(e);
                    }} id='language-select'>
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="es">Spanish</option>
                        <option value="pt">Portuguese</option>
                        <option value="ta">Tamil</option>
                        <option value="bn">Bengali</option>
                        <option value="fr">French</option>
                    </select>
                </div>

                <div className='section' id='posts'>
                    <h2>{content.profile.nav.posts}</h2>
                    <div className='post-container'>
                        {
                            userPosts && userPosts.map((post) => <ProfilePost post={post} key={post._id} postFlag={postFlag} setPostFlag={setPostFlag} userFlag={userFlag} setUserFlag={setUserFlag} />)
                        }

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}




export default Profile;