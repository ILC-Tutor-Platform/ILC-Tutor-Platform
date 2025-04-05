import { useEffect, useState } from 'react';

const VerifyEmail = () => {
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');

    if (token) {
      verifyEmail(token);
    } else {
        console.log(token);
      setStatus('Invalid or missing token');
    }
  }, []);

  const verifyEmail = async (token:string) => {
    try {
      const response = await fetch('/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        setStatus('Email successfully verified!');
      } else {
        setStatus('Failed to verify email');
      }
    } catch (error) {
      setStatus('Error occurred while verifying email');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>{status}</h1>
    </div>
  );
};

export default VerifyEmail;
