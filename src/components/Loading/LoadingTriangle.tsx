
const LoadingTriangle = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-0 h-0">
        <div className="absolute top-0 left-0 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[60px] border-b-blue-500 animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingTriangle;
