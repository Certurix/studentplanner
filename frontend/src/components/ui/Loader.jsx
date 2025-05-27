import React from 'react';
import { Spinner } from 'flowbite-react';

const Loader = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="flex items-center justify-center fixed inset-0 bg-gray-100 bg-opacity-75 z-50">
      <Spinner role="status">
      </Spinner>
    </div>
  );
};

export default Loader;