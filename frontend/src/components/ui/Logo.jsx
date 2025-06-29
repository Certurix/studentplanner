const Logo = () => {
  return (
    <div className="flex justify-between items-center h-16">
      <div className="flex items-center space-x-3">
        <img src="logo.svg" className="h-10 w-10" alt="Logo StudentPlanner" />
        <span className="text-xl font-semibold text-gray-900">
          StudentPlanner
        </span>
      </div>
    </div>
  );
};

export default Logo;
