import { render, screen } from "@testing-library/react";
import LoaderOverlay from "./LoaderOverlay";

test("renders overlay with black background and centers loader", () => {
  render(<LoaderOverlay />);
  const loaderOverlay = screen.getByTestId("loader-overlay");
  expect(loaderOverlay).toHaveClass("fixed inset-0 z-50");
});
