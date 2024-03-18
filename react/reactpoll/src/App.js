import React from 'react';
import { BrowserRouter as Router, Routes ,Route} from 'react-router-dom';
import Home from './Home';
import Heading from './Heading'; 
import PollDetail from './pollDetail';
import VoteContent from './VoteContent';
import CreatePoll from './CreatePoll';
// import VoteOnPoll from './VoteOnPoll';
import  HomeProvider from './HomeProvider';
// import  useHomeContext from './useHomeContext';


function App() {
  return (
    <Router>
      <Heading/>
      <Routes>
      <Route
            path="/"
            element={
              <HomeProvider>
                <Home />
              </HomeProvider>
            }
          />
        <Route path="/pollDetail" element={<PollDetail />} />
        <Route path="/createPoll" element={<CreatePoll />} />
        <Route path="/VoteContent" element={<VoteContent />} />

      </Routes>
    </Router>
  );
}

export default App;

