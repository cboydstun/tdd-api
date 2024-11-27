import React from "react";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";
import axios, { AxiosError } from "axios";
import "@testing-library/jest-dom";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Test component that uses the auth context and exposes it
function TestComponent({
  onMount,
}: {
  onMount?: (auth: ReturnType<typeof useAuth>) => void;
}) {
  const auth = useAuth();

  // Call onMount with the auth object if provided
  React.useEffect(() => {
    if (onMount) {
      onMount(auth);
    }
  }, [auth, onMount]);

  return (
    <div>
      <div data-testid="auth-status">{auth.isAuthenticated.toString()}</div>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset axios headers
    delete axios.defaults.headers.common["Authorization"];
  });

  it("provides initial unauthenticated state", () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent("false");
  });

  it("restores authentication state from localStorage", () => {
    mockLocalStorage.getItem.mockReturnValue("test-token");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent("true");
    expect(axios.defaults.headers.common["Authorization"]).toBe(
      "Bearer test-token"
    );
  });

  it("handles successful login", async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: "test-token" },
    });

    let authContext!: ReturnType<typeof useAuth>;

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent
            onMount={(auth) => {
              authContext = auth;
            }}
          />
        </AuthProvider>
      );
    });

    let result;
    await act(async () => {
      result = await authContext.login("test@example.com", "password");
    });

    expect(result).toBe(true);
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/v1/users/login", {
      email: "test@example.com",
      password: "password",
    });
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "token",
      "test-token"
    );
    expect(axios.defaults.headers.common["Authorization"]).toBe(
      "Bearer test-token"
    );
    expect(screen.getByTestId("auth-status")).toHaveTextContent("true");
  });

  it("handles failed login with server error", async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const errorMessage = "Invalid credentials";
    const mockError = new Error(errorMessage) as AxiosError;
    mockError.isAxiosError = true;
    mockError.response = {
      data: { error: errorMessage },
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      config: {} as any,
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    let authContext!: ReturnType<typeof useAuth>;

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent
            onMount={(auth) => {
              authContext = auth;
            }}
          />
        </AuthProvider>
      );
    });

    await act(async () => {
      await expect(
        authContext.login("test@example.com", "password")
      ).rejects.toThrow(errorMessage);
    });

    expect(screen.getByTestId("auth-status")).toHaveTextContent("false");
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });

  it("handles failed login with network error", async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const mockError = new Error("An error occurred during login") as AxiosError;
    mockError.isAxiosError = true;
    // Don't set response property to simulate a network error
    mockedAxios.post.mockRejectedValueOnce(mockError);

    let authContext!: ReturnType<typeof useAuth>;

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent
            onMount={(auth) => {
              authContext = auth;
            }}
          />
        </AuthProvider>
      );
    });

    await act(async () => {
      await expect(
        authContext.login("test@example.com", "password")
      ).rejects.toThrow("An error occurred during login");
    });

    expect(screen.getByTestId("auth-status")).toHaveTextContent("false");
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });

  it("handles logout", async () => {
    mockLocalStorage.getItem.mockReturnValue("test-token");

    let authContext!: ReturnType<typeof useAuth>;

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent
            onMount={(auth) => {
              authContext = auth;
            }}
          />
        </AuthProvider>
      );
    });

    await act(async () => {
      authContext.logout();
    });

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("token");
    expect(axios.defaults.headers.common["Authorization"]).toBeUndefined();
    expect(screen.getByTestId("auth-status")).toHaveTextContent("false");
  });

  it("throws error when useAuth is used outside AuthProvider", () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, "error");
    consoleSpy.mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useAuth must be used within an AuthProvider");

    consoleSpy.mockRestore();
  });

  it("handles login with missing token in response", async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        /* no token */
      },
    });

    let authContext!: ReturnType<typeof useAuth>;

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent
            onMount={(auth) => {
              authContext = auth;
            }}
          />
        </AuthProvider>
      );
    });

    let result;
    await act(async () => {
      result = await authContext.login("test@example.com", "password");
    });

    expect(result).toBe(false);
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    expect(screen.getByTestId("auth-status")).toHaveTextContent("false");
  });

  it("maintains authentication state across re-renders", () => {
    mockLocalStorage.getItem.mockReturnValue("test-token");

    const { rerender } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent("true");

    // Re-render with same props
    rerender(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent("true");
  });
});
