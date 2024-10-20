import React from 'react';
import Body from './Body';
import CoverPage from './CoverPage';
import Header from './Header';
import Footer from './footer/Footer';

function Home() {
 
  return (
    <div className='home'>
       <Header/>
       <CoverPage/>
       <Body/>
       <Footer/>
    </div>
  )
}

export default Home