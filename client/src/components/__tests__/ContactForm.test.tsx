import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import ContactForm from "../ContactForm";
import { getApiUrl } from "../../utils/env";

// Mock axios and getApiUrl
jest.mock("axios");
jest.mock("../../utils/env", () => ({
  getApiUrl: jest.fn().mockReturnValue("http://test-api"),
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ContactForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<ContactForm />);

    // Required fields
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/when's the big day/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/party location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/tell us about your dream party/i)
    ).toBeInTheDocument();

    // Additional services checkboxes
    expect(screen.getByLabelText(/tables & chairs/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/generator/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/popcorn machine/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cotton candy/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/snow cones/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/petting zoo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pony rides/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dj services/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/overnight rental/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /let's make magic happen/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(<ContactForm />);

    fireEvent.click(
      screen.getByRole("button", { name: /let's make magic happen/i })
    );

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/party date is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/party zip code is required/i)
    ).toBeInTheDocument();
  });

  it("submits form successfully with valid data", async () => {
    render(<ContactForm />);

    mockedAxios.post.mockResolvedValueOnce({ data: {} });

    // Fill out the form
    await userEvent.type(screen.getByLabelText(/your name/i), "John Doe");
    await userEvent.type(
      screen.getByLabelText(/email address/i),
      "john@example.com"
    );
    await userEvent.type(
      screen.getByLabelText(/when's the big day/i),
      "2024-03-20"
    );
    await userEvent.type(screen.getByLabelText(/party location/i), "12345");
    await userEvent.type(
      screen.getByLabelText(/phone number/i),
      "123-456-7890"
    );
    await userEvent.type(
      screen.getByLabelText(/tell us about your dream party/i),
      "Test message"
    );

    // Toggle some additional services
    await userEvent.click(screen.getByLabelText(/tables & chairs/i));
    await userEvent.click(screen.getByLabelText(/popcorn machine/i));
    await userEvent.click(screen.getByLabelText(/dj services/i));

    // Submit the form
    fireEvent.click(
      screen.getByRole("button", { name: /let's make magic happen/i })
    );

    // Verify API call
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${getApiUrl()}/api/v1/contacts`,
        {
          bouncer: "John Doe",
          email: "john@example.com",
          partyDate: "2024-03-20",
          partyZipCode: "12345",
          phone: "123-456-7890",
          message: "Test message",
          sourcePage: "contact",
          tablesChairs: true,
          generator: false,
          popcornMachine: true,
          cottonCandyMachine: false,
          snowConeMachine: false,
          pettingZoo: false,
          ponyRides: false,
          dj: true,
          overnight: false,
        }
      );
    });

    // Verify success message
    expect(
      await screen.findByText(/woohoo! your message is on its way/i)
    ).toBeInTheDocument();
  });

  it("shows error message when API call fails", async () => {
    render(<ContactForm />);

    mockedAxios.post.mockRejectedValueOnce(new Error("API Error"));

    // Fill out required fields
    await userEvent.type(screen.getByLabelText(/your name/i), "John Doe");
    await userEvent.type(
      screen.getByLabelText(/email address/i),
      "john@example.com"
    );
    await userEvent.type(
      screen.getByLabelText(/when's the big day/i),
      "2024-03-20"
    );
    await userEvent.type(screen.getByLabelText(/party location/i), "12345");

    // Submit the form
    fireEvent.click(
      screen.getByRole("button", { name: /let's make magic happen/i })
    );

    // Verify error message
    expect(
      await screen.findByText(/oops! something went wrong/i)
    ).toBeInTheDocument();
  });

  it("clears form after successful submission", async () => {
    render(<ContactForm />);

    mockedAxios.post.mockResolvedValueOnce({ data: {} });

    // Fill out form
    await userEvent.type(screen.getByLabelText(/your name/i), "John Doe");
    await userEvent.type(
      screen.getByLabelText(/email address/i),
      "john@example.com"
    );
    await userEvent.type(
      screen.getByLabelText(/when's the big day/i),
      "2024-03-20"
    );
    await userEvent.type(screen.getByLabelText(/party location/i), "12345");
    await userEvent.click(screen.getByLabelText(/tables & chairs/i));
    await userEvent.click(screen.getByLabelText(/overnight/i));

    // Submit the form
    fireEvent.click(
      screen.getByRole("button", { name: /let's make magic happen/i })
    );

    // Verify fields are cleared
    await waitFor(() => {
      expect(screen.getByLabelText(/your name/i)).toHaveValue("");
      expect(screen.getByLabelText(/email address/i)).toHaveValue("");
      expect(screen.getByLabelText(/when's the big day/i)).toHaveValue("");
      expect(screen.getByLabelText(/party location/i)).toHaveValue("");
      expect(screen.getByLabelText(/tables & chairs/i)).not.toBeChecked();
      expect(screen.getByLabelText(/overnight/i)).not.toBeChecked();
    });
  });

  it("validates email format", async () => {
    render(<ContactForm />);

    // Fill out required fields with invalid email
    await userEvent.type(screen.getByLabelText(/your name/i), "John Doe");
    await userEvent.type(
      screen.getByLabelText(/email address/i),
      "invalid-email"
    );
    await userEvent.type(
      screen.getByLabelText(/when's the big day/i),
      "2024-03-20"
    );
    await userEvent.type(screen.getByLabelText(/party location/i), "12345");

    // Submit form
    fireEvent.click(
      screen.getByRole("button", { name: /let's make magic happen/i })
    );

    // Find the error message
    const errorMessage = await screen.findByText(
      "Please enter a valid email address"
    );
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-500");
  });

  it("validates phone number format", async () => {
    render(<ContactForm />);

    await userEvent.type(
      screen.getByLabelText(/phone number/i),
      "invalid-phone"
    );
    fireEvent.click(
      screen.getByRole("button", { name: /let's make magic happen/i })
    );

    expect(
      await screen.findByText(/please enter a valid phone number/i)
    ).toBeInTheDocument();
  });
});
