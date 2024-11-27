import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navigation from "../Navigation";
import "@testing-library/jest-dom";

describe("Navigation", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
  });

  it("renders the company logo/name with correct link", () => {
    const logoLink = screen.getByRole("link", { name: /satx bounce/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders all navigation links", () => {
    // Router Links
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: /blog/i })).toHaveAttribute(
      "href",
      "/blogs"
    );
    expect(screen.getByRole("link", { name: /inventory/i })).toHaveAttribute(
      "href",
      "/inventory"
    );
    expect(screen.getByRole("link", { name: /products/i })).toHaveAttribute(
      "href",
      "/products"
    );

    // Regular anchor tags
    expect(screen.getByRole("link", { name: /pricing/i })).toHaveAttribute(
      "href",
      "#"
    );
    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute(
      "href",
      "#"
    );
    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute(
      "href",
      "#"
    );
  });

  it("renders the Book Now button", () => {
    const bookButton = screen.getByRole("button", { name: /book now/i });
    expect(bookButton).toBeInTheDocument();
    expect(bookButton).toHaveClass("bg-primary-blue");
  });

  it("has correct responsive classes", () => {
    // Navigation links container should be hidden on mobile
    const navLinksContainer = screen
      .getByRole("navigation")
      .querySelector(".hidden.md\\:flex");
    expect(navLinksContainer).toBeInTheDocument();
  });

  it("has sticky positioning", () => {
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("sticky", "top-0");
  });

  it("maintains proper z-index for overlay content", () => {
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("z-50");
  });
});
