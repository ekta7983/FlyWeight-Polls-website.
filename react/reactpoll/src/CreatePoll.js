import CircularProgress from '@mui/material/CircularProgress';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button,TextField} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import './CreatePoll.css';


function Input1({ question, handleQuestionChange }) {
  return (
    <div>
        <h2>Question</h2>
        {/* <br />  */}
        <TextField className='text-field' variant="outlined" size="small" 
          value={question}
          placeholder='Type your poll question here'
          onChange={handleQuestionChange}
        />
    </div>
  );
}

function Input2({ options, handleOptionChange, handleAddOption, handleDeleteOption }) {
  const showDeleteIcons = options.length > 2;

  return (
    <div>
        <h2>Answer Options</h2>
        {/* <br /> */}
        {options.map((option, index) => (
          <div key={index} style={{marginBottom:'0.2rem'}}>
          <TextField className='text-field' variant="outlined" size="small"
              style={{ width: '70%' }}
              value={option}
              placeholder={`Option ${index + 1}`}
              onChange={(e) => handleOptionChange(index, e)}
            />
            {showDeleteIcons && (
            <ClearIcon
              onClick={() => handleDeleteOption(index)}
              className="delete-icon"
              style={{ cursor: 'pointer', marginLeft: '10px',padding:'7px' }}
            />
            )}
            <br/>
          </div>
        ))}
        <Button  color="primary" onClick={handleAddOption} style={{ padding: '0.3rem', borderRadius: '5px', border: 'solid grey 1px', margin: '0.5em' }}>
         Add Option
        </Button>
        <br/>
    </div>
  );
}

const CreateOption = ({ options, setOptions ,handleDeleteOption }) => {
  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, event) => {
    const newOptions = [...options];
    newOptions[index] = event.target.value;
    setOptions(newOptions);
  };
  const onDeleteOption = (index) => {
    handleDeleteOption(index);
  };


  return (
    <Input2 options={options} handleOptionChange={handleOptionChange} handleAddOption={handleAddOption}  handleDeleteOption={onDeleteOption} />
  );
};

const CreateTag = ({ tags, setTags }) => {
  const handleTagChange = (event) => {
    setTags(event.target.value);
  };

  return (
    <div>
        <h2>Comma Separated Tags</h2>
        {/* <br />  */}
        <TextField  variant="outlined" size="small"
          style={{ width: '70%' }}
          value={tags}
          placeholder='Tag1,Tag2,Tag3'
          onChange={handleTagChange}
        />
     
    </div>
  );
};

const CreatePollBtn = ({ handleCreatePoll, successMessage,loading }) => {
  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
      <Button onClick={handleCreatePoll} variant="contained" color="primary" style={{ padding: '0.3rem', borderRadius: '5px', border: 'solid grey 1px', margin: '0.5em' }}>
        Create Poll
      </Button>
      )}
     
    </div>
  );
};

function CreatePoll() {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [tags, setTags] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  
  
  
  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleDeleteOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };
  

  const handleCreatePoll = async () => {
    
      setLoading(true);
// Basic validations
if (question.trim() === '') {
  alert('Question field cannot be empty');
  setLoading(false);
  return;
}

if (options.filter((option) => option.trim() !== '').length < 2) {
  alert('At least two options should be filled');
  setLoading(false);
  return;
}

if (tags.trim() === '') {
  alert('At least one tag should be filled');
  setLoading(false);
  return;
}


    const apiUrl = 'http://127.0.0.1:8000/polls/create_poll/';

    const pollData = {
      Question: question,
      OptionVote: options.reduce((acc, option) => {
        acc[option] = 0; // You can set the initial vote count here
        return acc;
      }, {}),
      Tags: tags.split(',').map(tag => tag.trim()),
    };
    setLoading(true); 
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pollData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Poll created successfully:', data);
        setSuccessMessage('Poll created successfully');
         // Display success message in an alert
        alert('Poll created successfully');

        // After 2 seconds, navigate to the home page
        setTimeout(() => {
          navigate('/'); // Replace with the correct path to your home page
        }, 2000);
      // } else {
      //   console.error('Error creating poll:', data);
      //   setSuccessMessage('An error occurred!!');
      //   // Handle error as needed
      // }
      
      } else {
        console.error('Error creating poll:', data);
        setSuccessMessage('An error occured!!');
        
      }
      setLoading(false);
    } catch (error) {
      console.error('Error creating poll:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <div  className="create-poll-container">
        <Input1 question={question} handleQuestionChange={handleQuestionChange} />
        <br />
        <CreateOption options={options} setOptions={setOptions} handleDeleteOption={handleDeleteOption}/>
        <CreateTag tags={tags} setTags={setTags} />
      </div>
      <CreatePollBtn handleCreatePoll={handleCreatePoll}  successMessage={successMessage} loading={loading} />
    </div>
  );
}

export default CreatePoll;
