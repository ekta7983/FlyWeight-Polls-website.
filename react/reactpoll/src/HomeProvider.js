import React, { useState, useEffect } from 'react';
import HomeContext from './HomeContext'

const HomeProvider = ({ children }) => {
      const [selectedTags, setSelectedTags] = useState([]);
      const [filteredPolls, setFilteredPolls] = useState([]);
    
      const updateSelectedTags = (tags) => {
        setSelectedTags(tags);
      };
      const updateFilteredPolls = (polls) => {
        setFilteredPolls(polls);
      };
    
      return (
        <HomeContext.Provider value={{ selectedTags, updateSelectedTags, filteredPolls, updateFilteredPolls }}>
          {children}
        </HomeContext.Provider>
      );
    };
    
    export default HomeProvider;