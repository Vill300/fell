import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? <Login /> : <Register />}
      <div className="text-center mt-4">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-400 hover:text-blue-300"
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;