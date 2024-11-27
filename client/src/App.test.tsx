import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
// import * as AuthContext from "./contexts/AuthContext";

// Mock all component imports
jest.mock("./components/Layout", () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="mock-layout">{children}</div>;
  };
});

jest.mock("./components/HomePage", () => {
  return function MockHomePage() {
    return <div data-testid="mock-homepage">HomePage</div>;
  };
});

jest.mock("./components/BlogList", () => {
  return function MockBlogList() {
    return <div data-testid="mock-bloglist">BlogList</div>;
  };
});

jest.mock("./components/BlogPost", () => {
  return function MockBlogPost() {
    return <div data-testid="mock-blogpost">BlogPost</div>;
  };
});

jest.mock("./components/Login", () => {
  return function MockLogin() {
    return <div data-testid="mock-login">Login</div>;
  };
});

jest.mock("./components/AdminPanel", () => {
  return function MockAdminPanel() {
    return <div data-testid="mock-adminpanel">AdminPanel</div>;
  };
});

// Mock AuthContext
const mockAuthContext = {
  isAuthenticated: false,
  login: jest.fn(),
  logout: jest.fn(),
  loading: false,
};

jest.mock("./contexts/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => mockAuthContext,
}));

// Helper function to render with specific route
const renderWithRoute = (initialRoute: string = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
};

describe("App", () => {
  beforeEach(() => {
    // Reset mock auth context before each test
    mockAuthContext.isAuthenticated = false;
    jest.clearAllMocks();
  });

  it("renders layout component", () => {
    renderWithRoute("/");
    expect(screen.getByTestId("mock-layout")).toBeInTheDocument();
  });

  it("renders homepage on root route", () => {
    renderWithRoute("/");
    expect(screen.getByTestId("mock-homepage")).toBeInTheDocument();
  });

  it("renders blog list on /blogs route", () => {
    renderWithRoute("/blogs");
    expect(screen.getByTestId("mock-bloglist")).toBeInTheDocument();
  });

  it("renders blog post on /blogs/:slug route", () => {
    renderWithRoute("/blogs/test-blog");
    expect(screen.getByTestId("mock-blogpost")).toBeInTheDocument();
  });

  it("renders login page on /login route", () => {
    renderWithRoute("/login");
    expect(screen.getByTestId("mock-login")).toBeInTheDocument();
  });

  describe("Protected Admin Route", () => {
    it("renders admin panel when user is authenticated", () => {
      mockAuthContext.isAuthenticated = true;
      renderWithRoute("/admin");
      expect(screen.getByTestId("mock-adminpanel")).toBeInTheDocument();
    });

    it("redirects to login when user is not authenticated", () => {
      mockAuthContext.isAuthenticated = false;
      renderWithRoute("/admin");
      expect(screen.getByTestId("mock-login")).toBeInTheDocument();
    });
  });

  it("handles invalid routes", () => {
    renderWithRoute("/invalid-route");
    // Since we're using Routes from react-router-dom v6, it will show nothing for unmatched routes
    // We can either check for absence of other components or implement a "not found" route
    expect(screen.queryByTestId("mock-homepage")).not.toBeInTheDocument();
  });
});
