import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminPanel from "../AdminPanel";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useBlogManagement } from "../../hooks/useBlogManagement";
import { useProductManagement } from "../../hooks/useProductManagement";
import "@testing-library/jest-dom";

// Mock all required hooks
jest.mock("../../contexts/AuthContext");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));
jest.mock("../../hooks/useBlogManagement");
jest.mock("../../hooks/useProductManagement");

// Mock child components
jest.mock("../blog/BlogForm", () => ({
  __esModule: true,
  default: jest.fn(({ onSubmit, onCancel }) => (
    <div data-testid="blog-form">
      <button onClick={() => onSubmit({ title: "Test" })}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )),
}));

jest.mock("../blog/BlogTable", () => ({
  __esModule: true,
  default: jest.fn(({ blogs, onEdit, onDelete }) => (
    <div data-testid="blog-table">
      {blogs.map((blog: any) => (
        <div key={blog._id}>
          <span>{blog.title}</span>
          <button onClick={() => onEdit(blog)}>Edit</button>
          <button onClick={() => onDelete(blog.slug)}>Delete</button>
        </div>
      ))}
    </div>
  )),
}));

jest.mock("../product/ProductForm", () => ({
  __esModule: true,
  default: jest.fn(({ onSubmit, onCancel }) => (
    <div data-testid="product-form">
      <button onClick={() => onSubmit(new FormData())}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )),
}));

jest.mock("../product/ProductTable", () => ({
  __esModule: true,
  default: jest.fn(({ products, onEdit, onDelete }) => (
    <div data-testid="product-table">
      {products.map((product: any) => (
        <div key={product._id}>
          <span>{product.name}</span>
          <button onClick={() => onEdit(product)}>Edit</button>
          <button onClick={() => onDelete(product.slug)}>Delete</button>
        </div>
      ))}
    </div>
  )),
}));

describe("AdminPanel", () => {
  const mockNavigate = jest.fn();
  const mockFetchBlogs = jest.fn();
  const mockCreateBlog = jest.fn();
  const mockUpdateBlog = jest.fn();
  const mockDeleteBlog = jest.fn();
  const mockFetchProducts = jest.fn();
  const mockCreateProduct = jest.fn();
  const mockUpdateProduct = jest.fn();
  const mockDeleteProduct = jest.fn();

  const mockBlogs = [
    { _id: "1", title: "Blog 1", slug: "blog-1" },
    { _id: "2", title: "Blog 2", slug: "blog-2" },
  ];

  const mockProducts = [
    { _id: "1", name: "Product 1", slug: "product-1" },
    { _id: "2", name: "Product 2", slug: "product-2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    (useBlogManagement as jest.Mock).mockReturnValue({
      blogs: mockBlogs,
      loading: false,
      error: null,
      fetchBlogs: mockFetchBlogs,
      createBlog: mockCreateBlog,
      updateBlog: mockUpdateBlog,
      deleteBlog: mockDeleteBlog,
    });
    (useProductManagement as jest.Mock).mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
      fetchProducts: mockFetchProducts,
      createProduct: mockCreateProduct,
      updateProduct: mockUpdateProduct,
      deleteProduct: mockDeleteProduct,
    });
  });

  it("redirects to login if not authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
    render(<AdminPanel />);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("fetches blogs and products on mount", () => {
    render(<AdminPanel />);
    expect(mockFetchBlogs).toHaveBeenCalled();
    expect(mockFetchProducts).toHaveBeenCalled();
  });

  it("shows loading state when fetching data", () => {
    (useBlogManagement as jest.Mock).mockReturnValue({
      blogs: [],
      loading: true,
      error: null,
      fetchBlogs: mockFetchBlogs,
    });
    (useProductManagement as jest.Mock).mockReturnValue({
      products: [],
      loading: true,
      error: null,
      fetchProducts: mockFetchProducts,
    });

    render(<AdminPanel />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("switches between blog and product panels", () => {
    render(<AdminPanel />);

    // Initially shows blog panel
    expect(screen.getByTestId("blog-table")).toBeInTheDocument();

    // Switch to products using the button (not the select)
    const productButton = screen.getByRole("button", {
      name: /product management/i,
    });
    fireEvent.click(productButton);
    expect(screen.getByTestId("product-table")).toBeInTheDocument();
  });

  it("handles blog creation", async () => {
    mockCreateBlog.mockResolvedValueOnce(true);
    render(<AdminPanel />);

    // Open form
    fireEvent.click(screen.getByText("Create New Post"));
    expect(screen.getByTestId("blog-form")).toBeInTheDocument();

    // Submit form
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() => {
      expect(mockCreateBlog).toHaveBeenCalled();
    });
  });

  it("handles blog editing", async () => {
    mockUpdateBlog.mockResolvedValueOnce(true);
    render(<AdminPanel />);

    // Click edit on first blog
    fireEvent.click(screen.getAllByText("Edit")[0]);
    expect(screen.getByTestId("blog-form")).toBeInTheDocument();

    // Submit form
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() => {
      expect(mockUpdateBlog).toHaveBeenCalled();
    });
  });

  it("handles blog deletion", () => {
    render(<AdminPanel />);
    fireEvent.click(screen.getAllByText("Delete")[0]);
    expect(mockDeleteBlog).toHaveBeenCalledWith(mockBlogs[0].slug);
  });

  it("handles product creation", async () => {
    mockCreateProduct.mockResolvedValueOnce(true);
    render(<AdminPanel />);

    // Switch to products panel using the button
    const productButton = screen.getByRole("button", {
      name: /product management/i,
    });
    fireEvent.click(productButton);

    // Open form
    fireEvent.click(screen.getByText("Create New Product"));
    expect(screen.getByTestId("product-form")).toBeInTheDocument();

    // Submit form
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() => {
      expect(mockCreateProduct).toHaveBeenCalled();
    });
  });

  it("handles product editing", async () => {
    mockUpdateProduct.mockResolvedValueOnce(true);
    render(<AdminPanel />);

    // Switch to products panel using the button
    const productButton = screen.getByRole("button", {
      name: /product management/i,
    });
    fireEvent.click(productButton);

    // Click edit on first product
    fireEvent.click(screen.getAllByText("Edit")[0]);
    expect(screen.getByTestId("product-form")).toBeInTheDocument();

    // Submit form
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() => {
      expect(mockUpdateProduct).toHaveBeenCalled();
    });
  });

  it("handles product deletion", () => {
    render(<AdminPanel />);
    const productButton = screen.getByRole("button", {
      name: /product management/i,
    });
    fireEvent.click(productButton);
    fireEvent.click(screen.getAllByText("Delete")[0]);
    expect(mockDeleteProduct).toHaveBeenCalledWith(mockProducts[0].slug);
  });

  it("shows error messages", () => {
    const error = "Failed to fetch data";
    (useBlogManagement as jest.Mock).mockReturnValue({
      blogs: [],
      loading: false,
      error,
      fetchBlogs: mockFetchBlogs,
    });

    render(<AdminPanel />);
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it("handles form cancellation", () => {
    render(<AdminPanel />);

    // Open blog form
    fireEvent.click(screen.getByText("Create New Post"));
    expect(screen.getByTestId("blog-form")).toBeInTheDocument();

    // Cancel form
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByTestId("blog-form")).not.toBeInTheDocument();
  });

  it("handles mobile view panel switching", () => {
    render(<AdminPanel />);

    // Find the select element
    const select = screen.getByRole("combobox");

    // Change to products
    fireEvent.change(select, { target: { value: "products" } });
    expect(screen.getByTestId("product-table")).toBeInTheDocument();

    // Change back to blogs
    fireEvent.change(select, { target: { value: "blogs" } });
    expect(screen.getByTestId("blog-table")).toBeInTheDocument();
  });
});
