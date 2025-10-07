import React from 'react';

const AlertMessage = ({ type='info', message }) => {
  if (!message) return null;
  return (
    <div className={`alert alert-${type} mt-3`} role="alert">
      {message}
    </div>
  );
};

export default AlertMessage;
