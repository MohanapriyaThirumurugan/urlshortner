import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [bigurl, setbigurl] = useState("");
  const [urls, setUrls] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const formhandle = async (e) => {
    e.preventDefault();
    if (!bigurl) {
      setErrorMessage('Please fill in all fields');
      setSuccessMessage("");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000', { bigurl });
      const { smallurl } = response.data;

      setUrls([...urls, { bigurl, smallurl, click: 0 }]);
      setSuccessMessage("Your data has been successfully submitted!");
      setErrorMessage("");
      setbigurl("");
    } catch (error) {
      console.error("Error creating short URL:", error);
      setErrorMessage("Failed to create short URL");
      setSuccessMessage("");
    }
  };

  const handleClick = async (smallurl) => {
    try {
      // Open the short URL in a new tab
      window.open(`http://localhost:8000/url/${smallurl}`, '_blank');

      // Fetch the updated click count from the server
      const response = await axios.get(`http://localhost:8000/getclick/${smallurl}`);
      const { clickcount } = response.data;

      // Update the clicks count in the state
      setUrls((prevUrls) =>
        prevUrls.map((url) =>
          url.smallurl === smallurl ? { ...url, click: clickcount } : url
        )
      );
    } catch (error) {
      console.error("Error connecting to URL:", error);
    }
  };

  return (
    <div className='m-10'>
      <h1>URL Shortener</h1>
      <form action="">
        <div className='px-36 py-5 w-60'>
          <label>Big URL</label>
          <input 
            type='text' 
            className='border border-black px-60 py-6' 
            value={bigurl} 
            onChange={(e) => setbigurl(e.target.value)} 
          />
        </div>
        <div className='px-36 py-5 w-60'>
          <label>Submit</label>
          <button 
            type='submit' 
            className='border border-black px-20 py-1 text-blue-800' 
            onClick={formhandle}
          >
            Submit
          </button>
        </div>
      </form>

      <table className='min-w-full border-collapse border border-blue-600'>
        <thead>
          <tr>
            <th className='border border-blue-600 px-4 py-2'>S.no</th>
            <th className='border border-blue-600 px-4 py-2'>Big URL</th>
            <th className='border border-blue-600 px-4 py-2'>Short URL</th>
            <th className='border border-blue-600 px-4 py-2'>Clicks</th>
            <th className='border border-blue-600 px-4 py-2'>Action</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url, index) => (
            <tr key={index}>
              <td className='border border-blue-600 px-4 py-2'>{index + 1}</td>
              <td className='border border-blue-600 px-4 py-2'>{url.bigurl}</td>
              <td className='border border-blue-600 px-4 py-2'>{url.smallurl}</td>
              <td className='border border-blue-600 px-4 py-2'>{url.click}</td>
              <td className='border border-blue-600 px-4 py-2'>
                <button 
                  className='border border-blue-600 px-4 m-5'
                  onClick={() => handleClick(url.smallurl)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
