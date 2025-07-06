import Loader from "./Loader";

const LoaderOverlay = ({ size = "lg" }) => (
  <div
    className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
    style={{ pointerEvents: "all" }}
    data-testid="loader-overlay"
  >
    <Loader size={size} />
  </div>
);

export default LoaderOverlay;
