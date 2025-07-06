import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PrivateRoute from "./PrivateRoute";

const renderRoute = (user, adminOnly = false) =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user }}>
        <PrivateRoute adminOnly={adminOnly}>
          <div>Protected content</div>
        </PrivateRoute>
      </AuthContext.Provider>
    </MemoryRouter>
  );

test("show content if user is logged in", () => {
  renderRoute({ isAdmin: false });
  expect(screen.getByText("Protected content")).toBeInTheDocument();
});

test("don't show content if user is not logged in", () => {
  renderRoute(null);
  expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
});

test("don't show content if not an admin on admin route", () => {
  renderRoute({ isAdmin: false }, true);
  expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
});

test("show content if admin on the admin route", () => {
  renderRoute({ isAdmin: true }, true);
  expect(screen.getByText("Protected content")).toBeInTheDocument();
});
