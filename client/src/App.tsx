import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import AddFriend from './components/AddFriend';
import FriendsList from './components/FriendsList';
import Chat from './components/Chat';
import Settings from './components/Settings';

const AppContent: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [selectedFriend, setSelectedFriend] = useState<{ id: string; username: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'settings'>('chat');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Discord Clone</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user.username}</span>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <AddFriend />
            <FriendsList onSelectFriend={setSelectedFriend} />
          </div>
          <div className="md:col-span-2">
            <div className="bg-gray-800 rounded-lg mb-4">
              <div className="flex border-b border-gray-700">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-6 py-3 ${activeTab === 'chat' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-6 py-3 ${activeTab === 'settings' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Settings
                </button>
              </div>
              <div className="p-4">
                {activeTab === 'chat' ? (
                  selectedFriend ? (
                    <Chat friendId={selectedFriend.id} friendUsername={selectedFriend.username} />
                  ) : (
                    <div className="h-96 flex items-center justify-center">
                      <p className="text-gray-400">Select a friend to start chatting</p>
                    </div>
                  )
                ) : (
                  <Settings />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
