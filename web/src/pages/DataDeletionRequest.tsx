import React from 'react';

const DataDeletionRequest: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
  };

  const headingStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '1.5rem',
    marginBottom: '20px',
  };

  const emailLinkStyle: React.CSSProperties = {
    textDecoration: 'underline',
    color: 'blue',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Data Deletion Request</h2>
      <p>
        If you wish to delete specific data associated with your account on Educado, please contact us at{' '}
        <a href="mailto:app.educado@gmail.com" style={emailLinkStyle}>
          app.educado@gmail.com
        </a>.
      </p>
      <p>
        Upon processing your request, the specified data such as personal identifiable information, course
        subscriptions, and related progress will be permanently removed from our systems.
      </p>
      <p>
        For any further inquiries or assistance, please don't hesitate to contact us via{' '}
        <a href="mailto:app.educado@gmail.com" style={emailLinkStyle}>
          app.educado@gmail.com
        </a>.
      </p>
    </div>
  );
};

export default DataDeletionRequest;
