import { render, screen } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";

test("show error message if exists", () => {
  render(<ErrorMessage message="Error!" />);
  expect(screen.getByText("Error!")).toBeInTheDocument();
});

test("doesn't show anything when there is no message", () => {
  render(<ErrorMessage message="" />);
  expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
});
