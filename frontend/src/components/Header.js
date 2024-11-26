import React from 'react';

const Header = ({ title, subtitle }) => {
  return (
    <div className="py-6 px-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}

export default Header;