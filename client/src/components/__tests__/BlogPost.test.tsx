import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BlogPost from "../BlogPost";
import axios from "axios";
import * as router from "react-router-dom";
import "@testing-library/jest-dom";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock useParams and useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

describe("BlogPost", () => {
  const mockBlog = {
    title: "Test Blog Post",
    introduction: "<p>Test introduction</p>",
    body: "<p>Test body content</p>",
    conclusion: "<p>Test conclusion</p>",
    featuredImage: "test-image.jpg",
    publishDate: "2024-03-15T00:00:00.000Z",
    readTime: "5",
    categories: ["Technology", "Programming"],
    tags: ["React", "Testing"],
    author: {
      email: "test@example.com",
    },
  };

  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (router.useParams as jest.Mock).mockReturnValue({ slug: "test-blog" });
    (router.useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("shows loading state initially", () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<BlogPost />);

    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin");
  });

  it("shows error message when API call fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

    render(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch blog post")).toBeInTheDocument();
    });

    // Should show back button
    const backButton = screen.getByText("Back to Blogs");
    expect(backButton).toBeInTheDocument();

    // Test navigation on back button click
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith("/blogs");
  });

  it("shows error when blog post is not found", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: null });

    render(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText("Blog post not found")).toBeInTheDocument();
    });
  });

  it("renders blog post with all fields", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockBlog });

    render(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText(mockBlog.title)).toBeInTheDocument();
    });

    // Check all content sections
    expect(screen.getByText("Test introduction")).toBeInTheDocument();
    expect(screen.getByText("Test body content")).toBeInTheDocument();
    expect(screen.getByText("Test conclusion")).toBeInTheDocument();

    // Check metadata
    expect(screen.getByText(`By ${mockBlog.author.email}`)).toBeInTheDocument();
    expect(screen.getByText("5 min read")).toBeInTheDocument();
    expect(
      screen.getByText(new Date(mockBlog.publishDate).toLocaleDateString())
    ).toBeInTheDocument();

    // Check image
    const image = screen.getByAltText(mockBlog.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockBlog.featuredImage);

    // Check categories and tags
    mockBlog.categories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
    mockBlog.tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it("renders blog post without optional fields", async () => {
    const minimalBlog = {
      ...mockBlog,
      featuredImage: undefined,
      readTime: undefined,
      author: undefined,
      categories: [],
      tags: [],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: minimalBlog });

    render(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText(minimalBlog.title)).toBeInTheDocument();
    });

    // Check that optional elements are not rendered
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByText(/min read/)).not.toBeInTheDocument();
    expect(screen.queryByText(/By/)).not.toBeInTheDocument();
    expect(screen.queryByText("Tags")).not.toBeInTheDocument();
  });

  it("navigates back when clicking back button", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockBlog });

    render(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText(mockBlog.title)).toBeInTheDocument();
    });

    const backButton = screen.getByText("← Back to Blogs");
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/blogs");
  });

  it("fetches blog post with correct slug", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockBlog });

    render(<BlogPost />);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/v1/blogs/test-blog");
    });
  });
});
