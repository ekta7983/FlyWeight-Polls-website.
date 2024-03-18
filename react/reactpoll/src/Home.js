import React from 'react';
import SideBar from './SideBar'
import MainContent from './MainContent'
import HomeProvider from './HomeProvider'
import './Home.css' 
import useHomeContext from './useHomeContext'

function Home() {
  const { selectedTags, updateSelectedTags } = useHomeContext();

  const handleFilterByTags = (tags) => {
    updateSelectedTags(tags);
  };

  
  return (
     <HomeProvider>
    {/* <div className="App"> */}
         <div className='app'>
          <div  className='app-child'>
            <SideBar onFilterByTags={handleFilterByTags}/>
           </div>
           <MainContent/>
         </div>
         
        
    {/* </div> */}
    </HomeProvider>
  );
}

// export { HomeProvider, useHomeContext };
export default Home;

