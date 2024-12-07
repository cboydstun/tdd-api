import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBlogManagement } from "../hooks/useBlogManagement";
import { useProductManagement } from "../hooks/useProductManagement";
import { useContactManagement } from "../hooks/useContactManagement";
import { Blog } from "../types/blog";
import { Product } from "../types/product";
import { Contact } from "../types/contact";
import BlogForm from "./blog/BlogForm";
import BlogTable from "./blog/BlogTable";
import ProductForm from "./product/ProductForm";
import ProductTable from "./product/ProductTable";
import ContactForm from "./contact/ContactForm";
import ContactTable from "./contact/ContactTable";

type ActivePanel = "blogs" | "products" | "contacts";

export default function AdminPanel() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    blogs,
    loading: blogsLoading,
    error: blogsError,
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  } = useBlogManagement();

  const {
    products,
    loading: productsLoading,
    error: productsError,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProductManagement();

  const {
    contacts,
    loading: contactsLoading,
    error: contactsError,
    fetchContacts,
    updateContact,
    deleteContact,
  } = useContactManagement();

  const [activePanel, setActivePanel] = useState<ActivePanel>("blogs");
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    fetchBlogs();
    fetchProducts();
    fetchContacts();
  }, [fetchBlogs, fetchProducts, fetchContacts]);

  const handleBlogSubmit = async (formData: any) => {
    const success = editingBlog
      ? await updateBlog(editingBlog.slug, formData)
      : await createBlog(formData);

    if (success) {
      setShowBlogForm(false);
      setEditingBlog(null);
    }
  };

  const handleProductSubmit = async (formData: FormData) => {
    const success = editingProduct
      ? await updateProduct(editingProduct.slug, formData)
      : await createProduct(formData);

    if (success) {
      setShowProductForm(false);
      setEditingProduct(null);
    }
  };

  const handleContactSubmit = async (formData: Partial<Contact>) => {
    if (editingContact) {
      const success = await updateContact(editingContact._id, formData);
      if (success) {
        setShowContactForm(false);
        setEditingContact(null);
      }
    }
  };

  const handleBlogEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setShowBlogForm(true);
  };

  const handleProductEdit = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleContactEdit = (contact: Contact) => {
    setEditingContact(contact);
    setShowContactForm(true);
  };

  const handleBlogCancel = () => {
    setShowBlogForm(false);
    setEditingBlog(null);
  };

  const handleProductCancel = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleContactCancel = () => {
    setShowContactForm(false);
    setEditingContact(null);
  };

  if (blogsLoading || productsLoading || contactsLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <div className="sm:hidden">
                <select
                  value={activePanel}
                  onChange={(e) =>
                    setActivePanel(e.target.value as ActivePanel)
                  }
                  className="block w-full rounded-md border-gray-300 focus:border-primary-purple focus:ring-primary-purple"
                >
                  <option value="blogs">Blog Management</option>
                  <option value="products">Product Management</option>
                  <option value="contacts">Contact Management</option>
                </select>
              </div>
              <div className="hidden sm:block">
                <nav className="flex space-x-4" aria-label="Tabs">
                  <button
                    onClick={() => setActivePanel("blogs")}
                    className={`px-3 py-2 font-medium text-sm rounded-md ${
                      activePanel === "blogs"
                        ? "bg-primary-purple text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Blog Management
                  </button>
                  <button
                    onClick={() => setActivePanel("products")}
                    className={`px-3 py-2 font-medium text-sm rounded-md ${
                      activePanel === "products"
                        ? "bg-primary-purple text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Product Management
                  </button>
                  <button
                    onClick={() => setActivePanel("contacts")}
                    className={`px-3 py-2 font-medium text-sm rounded-md ${
                      activePanel === "contacts"
                        ? "bg-primary-purple text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Contact Management
                  </button>
                </nav>
              </div>
            </div>

            {activePanel === "blogs" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Blog Management
                  </h1>
                  <button
                    onClick={() => {
                      setShowBlogForm(true);
                      setEditingBlog(null);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-purple hover:bg-primary-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple"
                  >
                    Create New Post
                  </button>
                </div>

                {blogsError && (
                  <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                    {blogsError}
                  </div>
                )}

                {showBlogForm ? (
                  <BlogForm
                    onSubmit={handleBlogSubmit}
                    onCancel={handleBlogCancel}
                    initialData={editingBlog || undefined}
                  />
                ) : (
                  <BlogTable
                    blogs={blogs}
                    onEdit={handleBlogEdit}
                    onDelete={deleteBlog}
                  />
                )}
              </div>
            )}

            {activePanel === "products" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Product Management
                  </h1>
                  <button
                    onClick={() => {
                      setShowProductForm(true);
                      setEditingProduct(null);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-purple hover:bg-primary-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple"
                  >
                    Create New Product
                  </button>
                </div>

                {productsError && (
                  <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                    {productsError}
                  </div>
                )}

                {showProductForm ? (
                  <ProductForm
                    onSubmit={handleProductSubmit}
                    onCancel={handleProductCancel}
                    initialData={editingProduct || undefined}
                  />
                ) : (
                  <ProductTable
                    products={products}
                    onEdit={handleProductEdit}
                    onDelete={deleteProduct}
                  />
                )}
              </div>
            )}

            {activePanel === "contacts" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Contact Management
                  </h1>
                </div>

                {contactsError && (
                  <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                    {contactsError}
                  </div>
                )}

                {showContactForm ? (
                  <ContactForm
                    onSubmit={handleContactSubmit}
                    onCancel={handleContactCancel}
                    initialData={editingContact || undefined}
                  />
                ) : (
                  <ContactTable
                    contacts={contacts}
                    onEdit={handleContactEdit}
                    onDelete={deleteContact}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
