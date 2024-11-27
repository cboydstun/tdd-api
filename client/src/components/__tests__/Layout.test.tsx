import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import "@testing-library/jest-dom";

// Mock the Navigation and Footer components
jest.mock("../Navigation", () => ({
  __esModule: true,
  default: () => <div data-testid="navigation-mock">Navigation Mock</div>,
}));

jest.mock("../Footer", () => ({
  __esModule: true,
  default: () => <div data-testid="footer-mock">Footer Mock</div>,
}));

describe("Layout", () => {
  const renderLayout = (children: React.ReactNode = null) => {
    return render(
      <BrowserRouter>
        <Layout>{children}</Layout>
      </BrowserRouter>
    );
  };

  it("renders navigation component", () => {
    renderLayout();
    expect(screen.getByTestId("navigation-mock")).toBeInTheDocument();
  });

  it("renders footer component", () => {
    renderLayout();
    expect(screen.getByTestId("footer-mock")).toBeInTheDocument();
  });

  it("renders children content", () => {
    const testContent = <div data-testid="test-content">Test Content</div>;
    renderLayout(testContent);
    expect(screen.getByTestId("test-content")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("has correct layout structure and styling", () => {
    renderLayout();

    // Main container
    const container = screen.getByTestId("navigation-mock").parentElement;
    expect(container).toHaveClass("bg-white", "min-h-screen");

    // Content wrapper
    const contentWrapper =
      screen.getByTestId("navigation-mock").nextElementSibling;
    expect(contentWrapper).toHaveClass(
      "max-w-7xl",
      "mx-auto",
      "px-4",
      "sm:px-6",
      "lg:px-8"
    );
  });

  it("maintains correct component order", () => {
    renderLayout(<div data-testid="test-content">Test Content</div>);

    const container = screen.getByTestId("navigation-mock").parentElement;
    const children = Array.from(container?.children || []);

    expect(children[0]).toHaveAttribute("data-testid", "navigation-mock");
    expect(children[1]).toHaveClass("max-w-7xl"); // Content wrapper
    expect(children[2]).toHaveAttribute("data-testid", "footer-mock");
  });
});
