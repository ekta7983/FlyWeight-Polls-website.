import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { useLocation,Link ,useNavigate } from 'react-router-dom';
import './pollD.css';
import PieChart from './PieChart'


function HeadPg2({questionText}) {
  return (
    <div className="heading2" >
             <h1 className='quest-head'>{questionText}</h1>
    </div>
  )
}
const VoteButton = ({ questionId, questionText, choices, pollData }) => {
  const navigate = useNavigate();

  const handleVoteClick = () => {
    // Navigate to VoteContent with pollData as state
    navigate('/VoteContent', { state: { pollData, questionId } });
    // console.log("in the handleVoteClick")
  };

    return (
      
      <Button variant="contained" onClick={handleVoteClick} style={{backgroundColor:'#1976D2' ,padding:'0.7rem' ,color:'white', borderRadius: '5px' ,margin:'0.5em'}}>
       Vote on this poll
      </Button>
      // </Link>
    );
  };
 
  const VoteTable = ({ choices }) => {
    return (
      <div>
        <TableContainer className='detail-table' component={Paper}>
      <Table  className='poll-tbl' >
        <TableHead className='tbl-head'>
          <TableRow className='tbl-row'>
            <TableCell className='tbl-cell-head' >Sno</TableCell>
            <TableCell className='tbl-cell-head' >Option</TableCell>
            <TableCell className='tbl-cell-head' >Votes</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
          {choices.map((choice, index) => (
            <TableRow key={index}>
              <TableCell className='tbl-cell' >{index + 1}.</TableCell>
              <TableCell className='tbl-cell' >{choice.ChoiceText}</TableCell>
              <TableCell className='tbl-cell' >{choice.Votes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
    </div>
    )
  }
const PollD = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const questionId = searchParams.get('id');
  const [pollData, setPollData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {const apiUrl = `http://127.0.0.1:8000/polls/get_polls_by_id/${questionId}`;
  console.log(questionId)
  console.log('API URL:', apiUrl);

  // Make a request to the Django API to get poll details
  fetch(apiUrl)
      .then(response => response.json())
      .then(data => setPollData(data))
      .catch(error => console.error('Error fetching poll details:', error));
  }, [questionId]);
    // console.log(pollData)
  if (!pollData) {
    return <div>Loading...</div>;
  }
  const chartData = [
    ['Choice', 'Votes'],
    ...pollData.Choices.map(choice => [choice.ChoiceText, choice.Votes]),
  ];

  const chartOptions = {
    // title: `Poll Results - ${pollData.Question}`,
    is3D: true,
  };
    return (
      <div className="page2">
        
            <HeadPg2 className='heading2' questionText={pollData.Question}/>
            <VoteButton className='vote-btn' questionId={questionId} questionText={pollData.Question} choices={pollData.Choices} pollData={pollData} />
            <div className='tbl-chart'>
        <div className='table' >
            <VoteTable choices={pollData.Choices}/>
            </div>
        <div className='chart'>
        {/* Pass chartData and chartOptions to PieChart */}
        <PieChart  className='chartie' chartData={chartData} chartOptions={chartOptions} />
      </div>
      </div>
      </div>
    );
  };


export default PollD;