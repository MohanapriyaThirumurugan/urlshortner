import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [bigurl, setBigUrl] = useState("");
  const [urls, setUrls] = useState([
    { bigurl: "https://www.example.com/1", smallurl: "short.ly/abc123", click: 5 },
    { bigurl: "https://www.example.com/2", smallurl: "short.ly/def456", click: 2 },
    { bigurl: "https://www.example.com/3", smallurl: "short.ly/ghi789", click: 10 },
  ]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const formhandle = async (e) => {
    e.preventDefault();
    if (!bigurl) {
      setErrorMessage('Please enter a URL.');
      setSuccessMessage("");
      return;
    }

    try {
      const response = await axios.post('https://url-backend-rmsl.onrender.com/', { bigurl });
      const { smallurl } = response.data;

      setUrls([...urls, { bigurl, smallurl, click: 0 }]);
      setSuccessMessage("Short URL created successfully!");
      setErrorMessage("");
      setBigUrl("");
    } catch (error) {
      console.error("Error creating short URL:", error);
      setErrorMessage("Failed to create short URL");
      setSuccessMessage("");
    }
  };

  const handleClick = async (smallurl) => {
    try {
      const response = await axios.get(`https://url-backend-rmsl.onrender.com/urlclick/${smallurl}`);
      const { clickcount } = response.data;

      setUrls((prevUrls) =>
        prevUrls.map((url) =>
          url.smallurl === smallurl ? { ...url, click: clickcount } : url
        )
      );
      window.open(`https://url-backend-rmsl.onrender.com/url/${smallurl}`, '_blank');
    } catch (error) {
      console.error("Error fetching updated click count:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-600 mb-6 md:mb-10">URL Shortener</h1>
      
      <form className="mb-6 md:mb-10" onSubmit={formhandle}>
        <div className="mb-4">
          <label className="block text-md md:text-lg font-medium text-gray-700">Enter Big URL</label>
          <input
            type="text"
            value={bigurl}
            onChange={(e) => setBigUrl(e.target.value)}
            className="w-full p-2 md:p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <div className='flex justify-end'>
          <button
            type="submit"
            className="w-36  py-2 md:py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-200 justify-center"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-2 md:px-4 py-2 border border-gray-300">S.No</th>
              <th className="px-2 md:px-4 py-2 border border-gray-300">Big URL</th>
              <th className="px-2 md:px-4 py-2 border border-gray-300">Short URL</th>
              <th className="px-2 md:px-4 py-2 border border-gray-300">Clicks</th>
              <th className="px-2 md:px-4 py-2 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-2 md:px-4 py-2 border border-gray-300">{index + 1}</td>
                <td className="px-2 md:px-4 py-2 border border-gray-300">{url.bigurl}</td>
                <td className="px-2 md:px-4 py-2 border border-gray-300 text-blue-600 underline">
                  {url.smallurl}
                </td>
                <td className="px-2 md:px-4 py-2 border border-gray-300">{url.click}</td>
                <td className="px-2 md:px-4 py-2 border border-gray-300">
                  <button
                    className="px-2 md:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400"
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
    </div>
  );
};

export default App;
