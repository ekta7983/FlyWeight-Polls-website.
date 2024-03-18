import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import useHomeContext from "./useHomeContext";
import { Button} from '@mui/material';
import './SideBar.css';

const CrtButton = () => {
  return (
    <Link to="/createPoll">
      <Button className="create-poll-home" variant="contained" color="primary">
        Create Poll
      </Button>
    </Link>
  );
};

const FilterButton = ({ onClick }) => {
  return (
    <div  className="filter-btn">
    <Button  variant="outlined"  onClick={onClick}>
      Filter by tags
    </Button></div>
  );
};

const Filter = ({ onTagChange }) => {
  const [tags, setTags] = useState([]);
  const { selectedTags, updateSelectedTags } = useHomeContext();
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/polls/tags/");
        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }
        const data = await response.json();
        setTags(data.tags);
      } catch (error) {
        console.error("Error fetching tags:", error.message);
      }
    };

    fetchTags();
  }, []);

  const handleTagChange = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((selectedTag) => selectedTag !== tag)
      : [...selectedTags, tag];

      updateSelectedTags(updatedTags);
    onTagChange(updatedTags);

    if (updatedTags.length === 0) {
      onTagChange([]);
    }
  };

  return (
    <div className='filter-box'>
      {tags.map((tag) => (
        <React.Fragment key={tag}>
          <label>
            <input
              type="checkbox"
              checked={selectedTags.includes(tag)}
              onChange={() => handleTagChange(tag)}
            />
            {tag}
          </label>
          <br />
          <br />
        </React.Fragment>
      ))}
    </div>
  );
};

const SideBar = ({ onFilterByTags }) => {
  const { selectedTags: homeSelectedTags, updateSelectedTags } = useHomeContext();
  const { filteredPolls, updateFilteredPolls } = useHomeContext();
// Use local state to store the fetched data
const [allPolls, setAllPolls] = useState([]);
const [filterButtonClicked, setFilterButtonClicked] = useState(false);

  // Default value for filteredPolls
  // const filteredPolls = []; // You can set an appropriate default value

  const fetchAllPolls = async () => {
    try {
      const allPollsResponse = await fetch('http://127.0.0.1:8000/polls/get_polls/');
      if (allPollsResponse.ok) {
        const allPollsData = await allPollsResponse.json();
        updateFilteredPolls(allPollsData); // Commented as it's not defined
        setFilterButtonClicked(true);
      } else {
        console.error('Error fetching all polls:', allPollsResponse.statusText);
        // Handle error as needed
      }
    } catch (error) {
      console.error('Error fetching all polls:', error.message);
    }
  };

  const handleFilterClick = async () => {
    const allPollsResponse = await fetch('http://127.0.0.1:8000/polls/get_polls/');
    try {
      // If all checkboxes are unchecked, fetch all polls
      if (homeSelectedTags.length === 0) {
        fetchAllPolls();
        // updateFilteredPolls(allPollsData); // Commented as it's not defined
      } else {
        const url = `http://127.0.0.1:8000/polls/get_polls_by_tags/?tags=${homeSelectedTags.join(',')}`;

        console.log("Generated URL:", url);

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          updateFilteredPolls(data); 
          updateSelectedTags(homeSelectedTags);// Commented as it's not defined
        } else {
          console.error("Error fetching filtered polls:", response.statusText);
        }
      }

      onFilterByTags(homeSelectedTags);
    } catch (error) {
      console.error("Error fetching polls by tags:", error.message);
    }
  };

  return (
    <div className="sidebar">
      <CrtButton/>
      <div className='sidebar-main' >
        <Filter onTagChange={updateSelectedTags} /> 
        <FilterButton onClick={handleFilterClick} />
      </div>
    </div>
  );
};

export default SideBar;
