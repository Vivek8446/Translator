import { useState, useEffect } from 'react';
import axios from 'axios';
import Translator from './Translator';

function Home() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data from API
  const fetchMessage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:3000/api/message');
      console.log('API Response:', response);
      
      setMessage(response.data.message);
    } catch (err:string | any) {
      console.error('Error fetching message:', err);
      setError(err.response?.data?.message || 'Failed to fetch message');
    } finally {
      setLoading(false);
    }
  };

  // Fetch message when component mounts
  useEffect(() => {
    fetchMessage();
  }, []);

  // Function to refresh the message
  const handleRefresh = () => {
    fetchMessage();
  };

  return (
    <>
      <div>
        <h1>Home</h1>
        
        {/* API Message Section */}
        <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3>API Message:</h3>
          
          {loading && <p>Loading...</p>}
          
          {error && (
            <div style={{ color: 'red' }}>
              <p>Error: {error}</p>
              <button onClick={handleRefresh}>Retry</button>
            </div>
          )}
          
          {!loading && !error && (
            <div>
              <p style={{ fontSize: '18px', color: 'green' }}>{message}</p>
              <button onClick={handleRefresh}>Refresh Message</button>
            </div>
          )}
        </div>
      </div>
      
      <Translator />
    </>
  );
}

export default Home;