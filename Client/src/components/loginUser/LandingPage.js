// import Spline from '@splinetool/react-spline';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../footer/Footer';
import './landingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <div className="cover-section">
            {/* <main style={{ width: "100vw", border: "4px solid red" }}>
                <Spline scene="https://prod.spline.design/v2MX-NpoeqtsYqsW/scene.splinecode" />
                <Spline style={{ border: "5px solid green", width: "100vw", maxWidth: "600px", margin: "auto" }} scene="https://prod.spline.design/XsiS6Rpwdjx6ddGl/scene.splinecode" />
            </main> */}
                <div className="overlay">
                    <h1 className="app-name">Connect, Share, and Explore with ConnectSphere</h1>
                    <div className="animated-text">
                        <p>Your gateway to connect with friends.</p>
                        <p>Share your moments, live your life!</p>
                        <p>Join now to explore the world of ConnectSphere.</p>
                    </div>
                </div>
            </div>

            <div className="login-section">
                <Outlet /> {/* Original Login component */}
            </div>
            <Footer />
        </div>
    );
};

export default LandingPage;


