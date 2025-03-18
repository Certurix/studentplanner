import React from 'react';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Loader = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="flex items-center justify-center fixed inset-0 bg-gray-100 bg-opacity-75 z-50">
      <Spinner animation="border" role="status">
      </Spinner>
    </div>
  );
};

export default Loader;