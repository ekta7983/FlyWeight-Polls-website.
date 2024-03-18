// MainContent.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { generatePollDetailURL } from './utils';
import  useHomeContext  from "./useHomeContext";
import  './MainContent.css';

function MainContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [displayedPolls, setDisplayedPolls] = useState([]);
  // const { selectedTags } =  useHomeContext();
  const { selectedTags, filteredPolls } = useHomeContext();
   // Use local state to store the fetched data
   const [allPolls, setAllPolls] = useState([]);
   const { filterButtonClicked } = useHomeContext();
   const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);



    useEffect(() => {
      const defaultUrl='http://127.0.0.1:8000/polls/get_polls/';
      const fetchData = async () => {
       
        try {
          
            const url = filterButtonClicked
            ? (selectedTags.length > 0
                ? `http://127.0.0.1:8000/polls/get_polls_by_tags/?tags=${selectedTags.join(',')}`
                : 'http://127.0.0.1:8000/polls/get_polls/')
            : defaultUrl;
            const response = await fetch(url);
  
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
  
            const data = await response.json();
  
            // Store the fetched data in local state
            setAllPolls(data);
          
        } catch (error) {
          console.error('Error fetching data:', error);
          setError(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [selectedTags, filterButtonClicked]); 

  // Use the filteredPolls if available, otherwise use allPolls
  const displayedPolls = filteredPolls.length > 0 ? filteredPolls : allPolls;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
      <div className='mainComp'>
        <div className='tableWrapper'>
         <TableContainer component={Paper} className='TableContainer'>
        <Table className="main-table">
          <TableHead className='TableHead'>
            <TableRow>
              <TableCell className="tbl-head">Sno</TableCell>
              <TableCell className="tbl-head">Poll Question</TableCell>
              <TableCell className="tbl-head">Votes</TableCell>
              <TableCell className="tbl-head">Tags</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {displayedPolls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((poll, index) => (
              <TableRow key={index}>
                <TableCell className="tbl-data">{index + 1}.</TableCell>
                <TableCell className="tbl-data" id="poll-question">
                  <Link to={generatePollDetailURL(poll.id)}>{poll.Question} </Link>
                </TableCell>
                <TableCell className="tbl-data">
                  {Object.values(poll.OptionVote).reduce((sum, count) => sum + count, 0)}
                </TableCell>
                <TableCell className="tbl-data" id="tags">
                  {poll.Tags.join(', ')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={displayedPolls.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </div>
      </div>
  );
}

export default MainContent;
