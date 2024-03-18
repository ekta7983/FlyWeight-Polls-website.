import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button} from '@mui/material';
import './VoteContent.css';

const VoteContent = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { pollData, questionId } = state || {};
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState(''); 
  // const { pollData: voteContentPollData, questionId } = state || {};
// console.log({selectedOption});

  const handleVoteSubmit = async (e) => {
    e.preventDefault();

    // Validate that at least one option is selected
    if (!selectedOption) {
      alert('Please select an option to vote');
      // You can set an error message or handle the validation as needed
      return;
    }


    // Extract questionId from pollData
    // const questionId = pollData ? pollData.QuestionId : null;
    console.log({pollData},{questionId})
    if (!questionId) {
      console.error('QuestionId is not available');
      return;
    }

    // Make a request to the API to increment votes
    const apiUrl = `http://127.0.0.1:8000/polls/update/${questionId}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          incrementOption: selectedOption,
        }),
      });

      const data = await response.json();
      console.log(data);

      // Handle success or error response as needed
      // setSuccessMessage(`You voted for "${selectedOption}"`);

      // Display success message in an alert
    alert(`You voted for "${selectedOption}"`);

    // After 2 seconds, navigate to the home page
    setTimeout(() => {
      // Replace '/home' with the correct path to your home page
      navigate('/');
    }, 2000);
    } catch (error) {
      console.error('Error incrementing votes:', error);
      // Handle error
    }
  };

  if (!pollData) {
    return <div>No poll data available</div>;
  }

  return (
    <div className="vote-on-poll">
      <div className='quest-choice'>
      
      <h1 className='question-h1'>{pollData.Question}</h1>
      <form className='form-choice' onSubmit={handleVoteSubmit}>
        {pollData.Choices.map((choice, index) => (
          <div key={index} className='option'>
            <input
              type="radio"
              name="voteOption"
              value={choice.ChoiceText}
              onChange={() => setSelectedOption(choice.ChoiceText)}
            />
            <label>{choice.ChoiceText}</label>
          </div>
        ))}
         <div className='btn-votie'> 
        <Button type="submit" className="vote-btn" variant="contained" color="primary" >Vote</Button></div>  
      </form>
      </div>
      {/* {successMessage && <h1 style={{ color: 'green' }}>{successMessage}</h1>} */}
    </div>
  );
};

export default VoteContent;
