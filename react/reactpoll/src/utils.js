
export const generatePollDetailURL = (pollId) => {
  console.log({pollId});
    return `http://localhost:3000/pollDetail?id=${pollId}`;
    
  };