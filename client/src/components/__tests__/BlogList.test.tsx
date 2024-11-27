import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import BlogList from "../BlogList";
import "@testing-library/jest-dom";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("BlogList", () => {
  const mockBlogs = [
    {
      _id: "1",
      title: "First Blog Post",
      slug: "first-blog-post",
      excerpt: "This is the first blog post excerpt",
      publishDate: "2024-03-15T00:00:00.000Z",
      readTime: "5",
      featuredImage: "image1.jpg",
    },
    {
      _id: "2",
      title: "Second Blog Post",
      slug: "second-blog-post",
      excerpt: "This is the second blog post excerpt",
      publishDate: "2024-03-16T00:00:00.000Z",
      // No readTime or featuredImage to test optional fields
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>
    );

    // Look for the loading spinner by its class instead of role
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin");
  });

  it("shows error message when API call fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch blogs")).toBeInTheDocument();
    });
  });

  it("renders blog posts successfully", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockBlogs });

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText("Blog Posts")).toBeInTheDocument();
    });

    // Check if both blog posts are rendered
    expect(screen.getByText("First Blog Post")).toBeInTheDocument();
    expect(screen.getByText("Second Blog Post")).toBeInTheDocument();
  });

  it("renders optional fields when present", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockBlogs });

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Blog Posts")).toBeInTheDocument();
    });

    // First blog has readTime
    expect(screen.getByText("5 min read")).toBeInTheDocument();

    // First blog has featured image
    const firstBlogImage = screen.getByAltText("First Blog Post");
    expect(firstBlogImage).toBeInTheDocument();
    expect(firstBlogImage).toHaveAttribute("src", "image1.jpg");
  });

  it("handles missing optional fields gracefully", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockBlogs });

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Blog Posts")).toBeInTheDocument();
    });

    // Second blog doesn't have readTime
    const secondBlogCard = screen.getByText("Second Blog Post").closest("a");
    expect(secondBlogCard).not.toHaveTextContent("min read");

    // Second blog doesn't have featured image
    expect(screen.queryAllByRole("img")).toHaveLength(1); // Only one image from first blog
  });

  it("formats dates correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockBlogs });

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Blog Posts")).toBeInTheDocument();
    });

    // Get all date elements and check their content
    const dateElements = screen.getAllByText(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
    expect(dateElements).toHaveLength(2);

    // Convert the dates to the same format as the component
    const firstDate = new Date(mockBlogs[0].publishDate).toLocaleDateString();
    const secondDate = new Date(mockBlogs[1].publishDate).toLocaleDateString();

    // Check if both dates are present
    expect(screen.getByText(firstDate)).toBeInTheDocument();
    expect(screen.getByText(secondDate)).toBeInTheDocument();
  });

  it("creates correct navigation links", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockBlogs });

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Blog Posts")).toBeInTheDocument();
    });

    // Check if links are created with correct slugs
    const firstBlogLink = screen.getByText("First Blog Post").closest("a");
    const secondBlogLink = screen.getByText("Second Blog Post").closest("a");

    expect(firstBlogLink).toHaveAttribute("href", "/blogs/first-blog-post");
    expect(secondBlogLink).toHaveAttribute("href", "/blogs/second-blog-post");
  });
});
