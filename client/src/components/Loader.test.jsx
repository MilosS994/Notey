import { render, screen } from "@testing-library/react";
import Loader from "./Loader";

test("renders loader with default size", () => {
  render(<Loader />);
  const loader = screen.getByRole("status");
  expect(loader.firstChild).toHaveClass("h-8 w-8");
});

test("renders Loader with size='sm'", () => {
  render(<Loader size="sm" />);
  const loader = screen.getByRole("status");
  expect(loader.firstChild).toHaveClass("h-4 w-4");
});

test("renders Loader with size='lg'", () => {
  render(<Loader size="lg" />);
  const loader = screen.getByRole("status");
  expect(loader.firstChild).toHaveClass("h-12 w-12");
});

test("Loader has animate-spin class", () => {
  render(<Loader />);
  const loader = screen.getByRole("status");
  expect(loader.firstChild).toHaveClass("animate-spin");
});
