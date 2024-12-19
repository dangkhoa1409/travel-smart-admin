const ErrorMessage = ({message,className}) => {
    return (
        <div className={`text-red-500 text-[12px] ${className}`}>
            {message}
        </div>
    );
};

export default ErrorMessage;