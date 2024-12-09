import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  publishDate: string;
  readTime?: string;
}

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create blog listing structured data
  const createBlogListingSchema = (blogs: Blog[]) => {
    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "SATX Bounce House Rentals Blog",
      description:
        "Latest news, tips, and insights about bounce house rentals and party planning in San Antonio",
      blogPost: blogs.map((blog) => ({
        "@type": "BlogPosting",
        headline: blog.title,
        description: blog.excerpt,
        image: blog.featuredImage,
        datePublished: blog.publishDate,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${window.location.origin}/blogs/${blog.slug}`,
        },
      })),
    };
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/v1/blogs");
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch blogs");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Blog Posts... | SATX Bounce House Rentals</title>
          <meta
            name="description"
            content="Loading our latest blog posts and party planning insights..."
          />
        </Helmet>
        <div className="min-h-[400px] flex justify-center items-center">
          <div
            data-testid="loading-spinner"
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"
          />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error | SATX Bounce House Rentals Blog</title>
          <meta
            name="description"
            content="An error occurred while loading our blog posts."
          />
        </Helmet>
        <div className="min-h-[400px] flex justify-center items-center">
          <p className="text-red-500 font-semibold text-lg">{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Blog | Party Planning Tips & News | SATX Bounce House Rentals
        </title>
        <meta
          name="description"
          content="Read our latest blog posts about party planning tips, bounce house safety, event ideas, and more. Stay updated with SATX Bounce House Rentals in San Antonio."
        />
        <meta
          name="keywords"
          content="party planning blog, bounce house tips, event ideas, San Antonio parties, party safety tips, event planning guide"
        />

        {/* Open Graph tags */}
        <meta
          property="og:title"
          content="Blog | Party Planning Tips & News | SATX Bounce House Rentals"
        />
        <meta
          property="og:description"
          content="Read our latest blog posts about party planning tips, bounce house safety, event ideas, and more. Stay updated with SATX Bounce House Rentals in San Antonio."
        />
        <meta property="og:type" content="blog" />
        <meta property="og:url" content={window.location.href} />
        {blogs[0]?.featuredImage && (
          <meta property="og:image" content={blogs[0].featuredImage} />
        )}

        {/* Location specific meta tags */}
        <meta name="geo.region" content="US-TX" />
        <meta name="geo.placename" content="San Antonio" />
        <meta name="geo.position" content="29.4241;-98.4936" />
        <meta name="ICBM" content="29.4241, -98.4936" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(createBlogListingSchema(blogs))}
        </script>
      </Helmet>

      <div className="w-full bg-secondary-blue/5 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
                Blog Posts
              </span>
            </h1>
            <p className="text-white text-lg">
              Stay updated with our latest news and insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blogs/${blog.slug}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2 border-transparent hover:border-secondary-blue/20"
              >
                {blog.featuredImage && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-primary-blue mb-3 line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 border-t border-gray-100 pt-4">
                    <span className="font-medium">
                      {new Date(blog.publishDate).toLocaleDateString()}
                    </span>
                    {blog.readTime && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="font-medium bg-secondary-blue/10 text-primary-blue px-2 py-1 rounded-full">
                          {blog.readTime} min read
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogList;
