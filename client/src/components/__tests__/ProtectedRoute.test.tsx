import { render, screen } from "@testing-library/react";
import ProtectedRoute from "../ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock the useAuth hook
jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock the Navigate component
jest.mock("react-router-dom", () => ({
  Navigate: jest.fn(() => null),
}));

describe("ProtectedRoute", () => {
  // Helper function to mock useAuth return value
  const mockUseAuth = (isAuthenticated: boolean) => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated,
      login: jest.fn(),
      logout: jest.fn(),
    });
  };

  it("redirects to login when user is not authenticated", () => {
    mockUseAuth(false);

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Verify Navigate was called with correct props
    expect(Navigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "/login",
        replace: true,
      }),
      expect.anything()
    );

    // Verify protected content is not rendered
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders children when user is authenticated", () => {
    mockUseAuth(true);

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Verify protected content is rendered
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("throws error if used without AuthProvider", () => {
    // Mock useAuth to throw error as it would without context
    (useAuth as jest.Mock).mockImplementation(() => {
      throw new Error("useAuth must be used within an AuthProvider");
    });

    // Verify error is thrown
    expect(() => {
      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );
    }).toThrow("useAuth must be used within an AuthProvider");
  });
});
