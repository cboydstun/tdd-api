import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Footer from "../Footer";
import "@testing-library/jest-dom";

// Mock the lucide-react icons
jest.mock("lucide-react", () => ({
  Phone: () => <div data-testid="phone-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />,
  Facebook: () => <div data-testid="facebook-icon" />,
  Instagram: () => <div data-testid="instagram-icon" />,
  Twitter: () => <div data-testid="twitter-icon" />,
}));

describe("Footer", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
  });

  it("renders company name and description", () => {
    expect(screen.getByText("SATX Bounce")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Making your events memorable with safe and clean bounce house rentals/i
      )
    ).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    expect(screen.getByText("Quick Links")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /blog/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /inventory/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /products/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
  });

  it("renders contact information", () => {
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("(210) 555-0123")).toBeInTheDocument();
    expect(screen.getByText("info@satxbounce.com")).toBeInTheDocument();
    expect(screen.getByText("San Antonio, TX")).toBeInTheDocument();
  });

  it("renders social media icons", () => {
    expect(screen.getByTestId("facebook-icon")).toBeInTheDocument();
    expect(screen.getByTestId("instagram-icon")).toBeInTheDocument();
    expect(screen.getByTestId("twitter-icon")).toBeInTheDocument();
  });

  it("renders contact icons", () => {
    expect(screen.getByTestId("phone-icon")).toBeInTheDocument();
    expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
    expect(screen.getByTestId("map-pin-icon")).toBeInTheDocument();
  });

  it("renders copyright notice with current year", () => {
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} SATX Bounce. All rights reserved.`)
    ).toBeInTheDocument();
  });
});
