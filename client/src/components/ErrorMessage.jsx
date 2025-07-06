const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <p className="mt-1 text-red-500 text-xs font-medium flex items-center gap-1 animate-fade-in">
      <svg width="18" height="18" fill="none" className="inline-block">
        <circle cx="8" cy="8" r="8" fill="#f87171" />
        <text x="8" y="12" textAnchor="middle" fontSize="10" fill="#fff">
          !
        </text>
      </svg>
      {message}
    </p>
  );
};

export default ErrorMessage;
