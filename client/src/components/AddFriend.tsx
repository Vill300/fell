import React, { useState } from 'react';
import axios from 'axios';

const AddFriend: React.FC = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/friends/add/${username}`);
      setMessage('Friend request sent!');
      setUsername('');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error adding friend');
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h3 className="text-white text-lg mb-4">Add Friend</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Friend
        </button>
      </form>
      {message && <p className="text-green-500 mt-3">{message}</p>}
    </div>
  );
};

export default AddFriend;