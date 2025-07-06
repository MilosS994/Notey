const Loader = ({ size = "md" }) => {
  let loaderSize;
  switch (size) {
    case "sm":
      loaderSize = "h-4 w-4";
      break;
    case "lg":
      loaderSize = "h-12 w-12";
      break;
    default:
      loaderSize = "h-8 w-8";
  }

  return (
    <div className="flex justify-center" role="status" aria-label="Loading">
      <div
        className={`${loaderSize} border-slate-600 border-2 rounded-full animate-spin border-t-transparent aspect-square`}
      />
    </div>
  );
};

export default Loader;
