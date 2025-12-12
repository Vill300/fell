import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Friend {
  _id: string;
  username: string;
  avatar: string;
  status: string;
}

interface FriendsListProps {
  onSelectFriend: (friend: { id: string; username: string }) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ onSelectFriend }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/friends');
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async (friendId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/friends/${friendId}`);
      setFriends(friends.filter(friend => friend._id !== friendId));
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  if (loading) {
    return <div className="text-white">Loading friends...</div>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white text-lg mb-4">Friends</h3>
      {friends.length === 0 ? (
        <p className="text-gray-400">No friends yet</p>
      ) : (
        <ul>
          {friends.map(friend => (
            <li key={friend._id} className="flex items-center justify-between mb-2">
              <button
                onClick={() => onSelectFriend({ id: friend._id, username: friend.username })}
                className="flex items-center flex-1 text-left hover:bg-gray-700 p-2 rounded"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-full mr-3"></div>
                <span className="text-white">{friend.username}</span>
                <span className={`ml-2 text-xs px-2 py-1 rounded ${
                  friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                }`}>
                  {friend.status}
                </span>
              </button>
              <button
                onClick={() => removeFriend(friend._id)}
                className="text-red-500 hover:text-red-400 ml-2"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;