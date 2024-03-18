import React, { createContext, useState } from 'react';

const HomeContext = createContext();

// const HomeProvider = ({ children }) => {
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [filteredPolls, setFilteredPolls] = useState([]);

//   const updateSelectedTags = (tags) => {
//     setSelectedTags(tags);
//   };
//   const updateFilteredPolls = (polls) => {
//     setFilteredPolls(polls);
//   };

//   return (
//     <HomeContext.Provider value={{ selectedTags, updateSelectedTags, filteredPolls, updateFilteredPolls }}>
//       {children}
//     </HomeContext.Provider>
//   );
// };

export default HomeContext ;
