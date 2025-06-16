import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

// Define the API response interface
interface ApiResponse {
  message: string;
  receivedText: string;
  success: boolean;
  timestamp: string;
}

// Define error response interface
interface ApiErrorResponse {
  success: boolean;
  message: string;
  error?: string;
}

function About(){
  const [inputText, setInputText] = useState<string>('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to send POST request
  const sendMessage = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await axios.post<ApiResponse>('http://localhost:3000/api/message', {
        text: inputText
      });
      
      setResponse(result.data);
      console.log('Response:', result.data);
    } catch (err) {
      console.error('Error sending message:', err);
      
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputText(e.target.value);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>About</h1>
      
      {/* API Testing Section */}
      <div style={{ 
        margin: '20px 0', 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h3>Test API Message POST</h3>
        
        {/* Input for text */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="messageText" style={{ display: 'block', marginBottom: '5px' }}>
            Message Text:
          </label>
          <input
            id="messageText"
            type="text"
            value={inputText}
            onChange={handleInputChange}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            placeholder="Enter your message"
          />
        </div>
        
        {/* Send Button */}
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
        
        {/* Error Display */}
        {error && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {/* Response Display */}
        {response && (
          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '4px'
          }}>
            <h4>Response:</h4>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '10px', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '12px',
              whiteSpace: 'pre-wrap'
            }}>
              {JSON.stringify(response, null, 2)}
            </div>
            
            {/* Formatted Response */}
            <div style={{ marginTop: '10px' }}>
              <p><strong>Message:</strong> {response.message}</p>
              <p><strong>Received Text:</strong> {response.receivedText}</p>
              <p><strong>Success:</strong> {response.success ? 'Yes' : 'No'}</p>
              <p><strong>Timestamp:</strong> {new Date(response.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default About;