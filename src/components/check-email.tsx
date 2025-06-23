// src/components/CheckEmail.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const CheckEmail = () => {
  const navigate = useNavigate();
  const userEmail = JSON.parse(localStorage.getItem('user') || '{}').email;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/homepage');
    }, 5000); // Redirect after 5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#00421D] p-4">
      <div className="p-8 rounded-xl shadow-2xl w-full max-w-md ring-2 ring-green-900 bg-green-900 ring-opacity-50">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-3xl font-bold text-yellow-300 mb-4">
            Check Your Email
          </h2>
          <p className="text-green-100 text-center">
            We've sent a verification link to <span className="font-bold text-yellow-200">{userEmail}</span>.
            Please check your inbox and verify your email address.
          </p>
          <p className="text-green-200 mt-4 text-sm">
            You'll be redirected automatically in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;