import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Circles } from 'react-loader-spinner';
import { Navigate, Outlet, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import langs from "../utils/languages";

const ProtectedRoute = () => {
  const { userInfo, userInfoFlag, setUserInfoFlag,setPlanInfo, setUserInfo, setLang, isAuthenticated, setIsAuthenticated, setPostIdFromSearchUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const postIdSearch=searchParams.get("postId")
  console.log("Post Id",postIdSearch);

  const getUserProfile = async () => {
    try {
      const res = await axios.get("https://new-social-media-application.onrender.com/api/auth/profile", { withCredentials : true });

      if (res) {
        setIsAuthenticated(true);
        setUserInfo(res);
        setLang(res.data?.user?.language);

        ////Change theme according to language
        // Remove all previous attributes
        const bodyAttributes = document.body.attributes;
        for (let i = 0; i < bodyAttributes.length; i++) {
          document.body.removeAttribute(bodyAttributes[i].name)
        }
        let selectedLang = res.data?.user?.language;
        let attribute = langs[0][selectedLang];
        document.body.setAttribute(attribute.themeKey, attribute.themeValue)
        // set plan detail.
        const plans = res.data.user?.subscription.filter((item) => item.isActive === true);
        setPlanInfo(plans);

      }

    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false); // Set loading to false after authentication check
    }
  };

  useEffect(()=>{
    if(postIdSearch){
      setPostIdFromSearchUrl(postIdSearch);
    }
  },[])

  useEffect(() => {
    getUserProfile();
  }, [userInfoFlag]);

  // If still checking authentication, show a loader or nothing
  if (loading) {
    return <div style={{ height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}><Circles
      height="80"
      width="80"
      color="#4fa94d"
      ariaLabel="circles-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    /></div>;
  }

  // If authenticated, render the children (Outlet), otherwise redirect to login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
