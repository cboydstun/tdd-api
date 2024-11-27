import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../Login";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock the hooks
jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("Login", () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup default mock implementations
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("renders login form", () => {
    render(<Login />);

    expect(
      screen.getByRole("heading", { name: /sign in to admin panel/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in to admin panel/i })
    ).toBeInTheDocument();
  });

  it("updates input values on change", async () => {
    render(<Login />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    await waitFor(() => {
      expect(emailInput).toHaveValue("test@example.com");
      expect(passwordInput).toHaveValue("password123");
    });
  });

  it("shows loading state during form submission", async () => {
    mockLogin.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(<Login />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in to admin panel/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Signing in...")).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    }, { timeout: 1000 });
  });

  it("navigates to admin panel on successful login", async () => {
    mockLogin.mockResolvedValue(undefined);
    render(<Login />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in to admin panel/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
      expect(mockNavigate).toHaveBeenCalledWith("/admin");
    });
  });

  it("displays error message on login failure", async () => {
    const errorMessage = "Invalid credentials";
    mockLogin.mockRejectedValue(new Error(errorMessage));
    
    render(<Login />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in to admin panel/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("handles non-Error login failures", async () => {
    mockLogin.mockRejectedValue("Unknown error");
    
    render(<Login />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in to admin panel/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to login")).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("requires email and password fields", () => {
    render(<Login />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it("validates email format", async () => {
    render(<Login />);

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
    
    await user.type(emailInput, "notanemail");
    await waitFor(() => {
      expect(emailInput.validity.valid).toBe(false);
    });

    await user.clear(emailInput);
    await user.type(emailInput, "test@example.com");
    await waitFor(() => {
      expect(emailInput.validity.valid).toBe(true);
    });
  });
});
