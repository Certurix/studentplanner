import React from "react";
import { Button } from "flowbite-react";

const Header = ({ title, subtitle, btnData, onClick }) => {
	return (
		<header className="py-6 px-8 flex justify-between items-center">
			<div>
				<h1 className="text-2xl font-bold">{title}</h1>
				<p className="text-gray-500 mt-1">{subtitle}</p>
			</div>
			<nav>
				{btnData.map((btn, index) => (
					<Button
						key={index}
						color="blue"
						onClick={btn.onClick || onClick}
						className="flex items-center"
					>
						{btn.icon && <span className="mr-2">{btn.icon}</span>}
						{btn.text}
					</Button>
				))}
			</nav>
		</header>
	);
};

export default Header;
