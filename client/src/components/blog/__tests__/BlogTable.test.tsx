import { render, screen, fireEvent } from "@testing-library/react";
import BlogTable from "../BlogTable";
import { Blog } from "../../../types/blog";
import "@testing-library/jest-dom";

describe("BlogTable", () => {
  const mockBlogs: Blog[] = [
    {
      _id: "1",
      title: "Published Blog",
      slug: "published-blog",
      introduction: "Intro 1",
      body: "Body 1",
      conclusion: "Conclusion 1",
      status: "published",
      publishDate: "2024-03-15T00:00:00.000Z",
    },
    {
      _id: "2",
      title: "Draft Blog",
      slug: "draft-blog",
      introduction: "Intro 2",
      body: "Body 2",
      conclusion: "Conclusion 2",
      status: "draft",
    },
  ];

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders table headers correctly", () => {
    render(
      <BlogTable
        blogs={mockBlogs}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders blog data correctly", () => {
    render(
      <BlogTable
        blogs={mockBlogs}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Check titles
    expect(screen.getByText("Published Blog")).toBeInTheDocument();
    expect(screen.getByText("Draft Blog")).toBeInTheDocument();

    // Check statuses
    const publishedStatus = screen.getByText("published");
    const draftStatus = screen.getByText("draft");
    expect(publishedStatus).toHaveClass("bg-green-100", "text-green-800");
    expect(draftStatus).toHaveClass("bg-yellow-100", "text-yellow-800");

    // Check dates - use regex to match date format
    const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}/;
    const dateElements = screen.getAllByText(dateRegex);
    expect(dateElements).toHaveLength(1); // One published blog with date
    expect(screen.getByText("Not published")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    render(
      <BlogTable
        blogs={mockBlogs}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockBlogs[0]);
  });

  it("shows confirmation dialog and calls onDelete when confirmed", () => {
    // Mock window.confirm
    const mockConfirm = jest.fn(() => true);
    window.confirm = mockConfirm;

    render(
      <BlogTable
        blogs={mockBlogs}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this blog?"
    );
    expect(mockOnDelete).toHaveBeenCalledWith(mockBlogs[0].slug);
  });

  it("does not call onDelete when confirmation is cancelled", () => {
    // Mock window.confirm to return false
    const mockConfirm = jest.fn(() => false);
    window.confirm = mockConfirm;

    render(
      <BlogTable
        blogs={mockBlogs}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it("renders empty table when no blogs provided", () => {
    render(
      <BlogTable blogs={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    // Headers should still be present
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    // But no blog data
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("applies correct styling to action buttons", () => {
    render(
      <BlogTable
        blogs={mockBlogs}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getAllByText("Edit")[0];
    const deleteButton = screen.getAllByText("Delete")[0];

    expect(editButton).toHaveClass(
      "text-primary-purple",
      "hover:text-primary-blue"
    );
    expect(deleteButton).toHaveClass("text-red-600", "hover:text-red-900");
  });

  it("maintains table structure with varying content lengths", () => {
    const longBlog: Blog = {
      _id: "3",
      title: "Very Long Title That Should Not Break Layout".repeat(3),
      slug: "long-title",
      introduction: "Intro",
      body: "Body",
      conclusion: "Conclusion",
      status: "published",
      publishDate: "2024-03-15T00:00:00.000Z",
    };

    render(
      <BlogTable
        blogs={[longBlog]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Check that the table maintains its structure
    const titleCell = screen.getByText(longBlog.title).closest("td");
    expect(titleCell).toHaveClass("whitespace-nowrap");
  });
});
