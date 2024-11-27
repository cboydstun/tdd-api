import { render, screen, within } from "@testing-library/react";
import HomePage from "../HomePage";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock the lucide-react icons
jest.mock("lucide-react", () => ({
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  Package: () => <div data-testid="package-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
}));

// Mock the CustomerReviews component
jest.mock("../CustomerReviews", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="customer-reviews-mock">Customer Reviews Mock</div>
  ),
}));

describe("HomePage", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  });

  describe("Hero Section", () => {
    it("renders main heading", () => {
      expect(
        screen.getByText(/San Antonio's Premier Bounce House Rentals/i)
      ).toBeInTheDocument();
    });

    it("renders subheading", () => {
      expect(
        screen.getByText(/Professional and timely bounce house rentals/i)
      ).toBeInTheDocument();
    });

    it("renders call-to-action buttons", () => {
      const heroSection = screen.getByRole("heading", {
        name: /San Antonio's Premier Bounce House Rentals/i,
      }).parentElement;
      expect(
        within(heroSection!).getByRole("button", { name: /Book Now/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /View Inventory/i })
      ).toBeInTheDocument();
    });

    it("renders customer reviews section", () => {
      expect(screen.getByTestId("customer-reviews-mock")).toBeInTheDocument();
    });
  });

  describe("Problem Section", () => {
    it("renders section heading", () => {
      expect(
        screen.getByText(/Planning a Party Shouldn't Be Stressful/i)
      ).toBeInTheDocument();
    });

    it("renders problem cards", () => {
      expect(
        screen.getByText(/Worried about safety and cleanliness?/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Need reliable and punctual service?/i)
      ).toBeInTheDocument();
    });
  });

  describe("Info Sections", () => {
    it("renders About Us section", () => {
      expect(
        screen.getByRole("heading", { name: /Choose Us/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/When you choose our party service/i)
      ).toBeInTheDocument();
    });

    it("renders Safety section", () => {
      expect(
        screen.getByRole("heading", {
          name: /Safe & Clean Inflatable Rentals/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /At SATX Bounce House Rentals, we understand that planning a party/i
        )
      ).toBeInTheDocument();
    });

    it("renders Customer Service section", () => {
      expect(
        screen.getByRole("heading", {
          name: /Great Customer Service for Event Rentals/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/we recognize that life can be unpredictable/i)
      ).toBeInTheDocument();
    });

    it("renders Pricing section", () => {
      expect(
        screen.getByRole("heading", { name: /Affordable Daily Pricing/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/we pride ourselves on transparency in pricing/i)
      ).toBeInTheDocument();
    });

    it("renders Delivery & Setup section", () => {
      expect(
        screen.getByRole("heading", {
          name: /Free Delivery & Setup for Party Rentals/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/we believe in providing a hassle-free experience/i)
      ).toBeInTheDocument();
    });
  });

  describe("Solution Section", () => {
    it("renders section heading", () => {
      expect(
        screen.getByRole("heading", { name: /Your One-Stop Party Solution/i })
      ).toBeInTheDocument();
    });

    it("renders all feature cards", () => {
      const featureSection = screen.getByRole("heading", {
        name: /Your One-Stop Party Solution/i,
      }).parentElement;
      expect(
        within(featureSection!).getByText(/Timely Service/i)
      ).toBeInTheDocument();
      expect(
        within(featureSection!).getByText(/Safe & Clean/i)
      ).toBeInTheDocument();
      expect(
        within(featureSection!).getByText(/No Deposit Required/i)
      ).toBeInTheDocument();
      expect(
        within(featureSection!).getByText(/Competitive Pricing/i)
      ).toBeInTheDocument();
    });

    it("renders feature icons", () => {
      expect(screen.getByTestId("clock-icon")).toBeInTheDocument();
      expect(screen.getByTestId("shield-icon")).toBeInTheDocument();
      expect(screen.getByTestId("package-icon")).toBeInTheDocument();
      expect(screen.getByTestId("dollar-sign-icon")).toBeInTheDocument();
    });
  });

  describe("Use Cases Section", () => {
    it("renders section heading", () => {
      expect(
        screen.getByRole("heading", { name: /Perfect For Any Occasion/i })
      ).toBeInTheDocument();
    });

    it("renders all event types", () => {
      expect(screen.getByText(/Birthday Parties/i)).toBeInTheDocument();
      expect(screen.getByText(/School Events/i)).toBeInTheDocument();
      expect(screen.getByText(/Church Functions/i)).toBeInTheDocument();
      expect(screen.getByText(/Community Gatherings/i)).toBeInTheDocument();
    });
  });

  describe("CTA Section", () => {
    it("renders section heading", () => {
      expect(
        screen.getByRole("heading", {
          name: /Ready to Make Your Event Unforgettable?/i,
        })
      ).toBeInTheDocument();
    });

    it("renders free delivery text", () => {
      expect(
        screen.getByText(/Book now and get free delivery within Loop 1604!/i)
      ).toBeInTheDocument();
    });

    it("renders contact button with icon", () => {
      expect(
        screen.getByRole("button", { name: /Contact Now/i })
      ).toBeInTheDocument();
      expect(screen.getByTestId("arrow-right-icon")).toBeInTheDocument();
    });
  });
});
