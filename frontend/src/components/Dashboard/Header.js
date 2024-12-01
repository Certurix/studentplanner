// frontend/src/components/Header.js

import React from "react";
import { Button } from "react-bootstrap";

const Header = ({ title, subtitle, btnData, onClick }) => {
  return (
    <div className="py-6 px-8 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-500 mt-1">{subtitle}</p>
      </div>
      <div>
        {btnData.map((btn, index) => (
          <Button
            key={index}
            variant="primary"
            onClick={btn.onClick || onClick}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
          >
            {btn.icon && <span className="mr-2">{btn.icon}</span>}
            {btn.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Header;
