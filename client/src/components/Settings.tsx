import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState(user?.status || 'online');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [message, setMessage] = useState('');

  const handleStatusChange = async (newStatus: string) => {
    try {
      await axios.put('http://localhost:5000/api/auth/status', { status: newStatus });
      setStatus(newStatus);
      setMessage('Status updated successfully');
    } catch (error) {
      setMessage('Error updating status');
    }
  };

  const handleAvatarChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/auth/avatar', { avatar });
      setMessage('Avatar updated successfully');
    } catch (error) {
      setMessage('Error updating avatar');
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-white text-xl mb-6">Settings</h3>

      <div className="mb-6">
        <h4 className="text-white text-lg mb-3">Status</h4>
        <div className="flex space-x-2">
          {['online', 'away', 'busy', 'offline'].map(s => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`px-4 py-2 rounded capitalize ${
                status === s ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-white text-lg mb-3">Avatar URL</h4>
        <form onSubmit={handleAvatarChange} className="flex space-x-2">
          <input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="Enter avatar URL"
            className="flex-1 p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update
          </button>
        </form>
      </div>

      {message && <p className="text-green-500">{message}</p>}
    </div>
  );
};

export default Settings;