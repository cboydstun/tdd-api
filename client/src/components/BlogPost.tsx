import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import { getCloudinaryImageProps } from "../utils/cloudinary";
import { ArrowLeft } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

interface BlogPost {
  meta: {
    views: number;
    likes: number;
    shares: number;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
  };
  _id: string;
  title: string;
  slug: string;
  author: {
    _id: string;
    email: string;
  };
  introduction: string;
  body: string;
  conclusion: string;
  images: {
    filename: string;
    path: string;
    mimetype: string;
    size: number;
  }[];
  excerpt: string;
  featuredImage: string;
  categories: string[];
  tags: string[];
  status: string;
  comments: any[];
  isFeature: boolean;
  relatedPosts: any[];
  createdAt: string;
  updatedAt: string;
}

const ImageWithFallback = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageProps = getCloudinaryImageProps(src);

  return (
    <div
      className={`relative bg-secondary-blue/5 rounded-lg overflow-hidden ${
        !imageLoaded && !imageError ? "animate-pulse" : ""
      }`}
    >
      <img
        {...imageProps}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        onLoad={() => {
          setImageLoaded(true);
        }}
        onError={(e) => {
          console.error("Image failed to load:", imageProps.src, e);
          setImageError(true);
          setImageLoaded(true);
        }}
        aria-hidden={imageError}
      />
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary-blue/5">
          <p className="text-gray-500 font-medium">Image failed to load</p>
        </div>
      )}
    </div>
  );
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/blogs/${slug}`);
        setBlog(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to fetch blog post");
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Blog Post... | SATX Bounce House Rentals</title>
          <meta name="description" content="Loading blog post content..." />
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

  if (error || !blog) {
    return (
      <>
        <Helmet>
          <title>Blog Post Not Found | SATX Bounce House Rentals</title>
          <meta
            name="description"
            content="The requested blog post could not be found."
          />
        </Helmet>
        <div className="min-h-[400px] flex flex-col justify-center items-center">
          <p className="text-red-500 font-semibold text-lg mb-4">
            {error || "Blog post not found"}
          </p>
          <button
            onClick={() => navigate("/blogs")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blogs
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {blog.seo.metaTitle || `${blog.title} | SATX Bounce House Rentals`}
        </title>
        <meta
          name="description"
          content={blog.seo.metaDescription || blog.excerpt}
        />
        <meta
          name="keywords"
          content={`${blog.seo.focusKeyword}, ${blog.tags.join(", ")}`}
        />

        {/* Open Graph tags */}
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        {blog.featuredImage && (
          <meta property="og:image" content={blog.featuredImage} />
        )}

        {/* Article specific meta tags */}
        <meta property="article:published_time" content={blog.createdAt} />
        <meta property="article:modified_time" content={blog.updatedAt} />
        {blog.author?.email && (
          <meta property="article:author" content={blog.author.email} />
        )}
        {blog.categories.map((category) => (
          <meta property="article:section" content={category} key={category} />
        ))}
        {blog.tags.map((tag) => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}
      </Helmet>

      <div className="w-full bg-secondary-blue/5 py-12">
        <div className="container mx-auto px-4">
          <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <button
              onClick={() => navigate("/blogs")}
              className="inline-flex items-center gap-2 px-4 py-2 text-primary-blue hover:bg-secondary-blue/10 rounded-lg transition-colors duration-300 mb-8 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Blogs
            </button>

            {blog.featuredImage && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <ImageWithFallback
                  src={blog.featuredImage}
                  alt={`Featured image for ${blog.title}`}
                  className="aspect-video"
                />
              </div>
            )}

            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text mb-6">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
              {blog.author?.email && (
                <span className="font-medium text-primary-blue">
                  By {blog.author.email}
                </span>
              )}
              <span className="font-medium">
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-4">
                <span className="bg-secondary-blue/10 text-primary-blue px-3 py-1 rounded-full">
                  {blog.meta.views} views
                </span>
                <span className="bg-secondary-blue/10 text-primary-blue px-3 py-1 rounded-full">
                  {blog.meta.likes} likes
                </span>
                <span className="bg-secondary-blue/10 text-primary-blue px-3 py-1 rounded-full">
                  {blog.meta.shares} shares
                </span>
              </div>
            </div>

            {blog.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.categories.map((category, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-blue-400 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: blog.introduction }}
                className="mb-8 text-gray-600"
              />
              <div
                dangerouslySetInnerHTML={{ __html: blog.body }}
                className="mb-8 text-gray-600"
              />

              {blog.images && blog.images.length > 0 && (
                <div className="my-12">
                  <h3 className="text-2xl font-bold text-primary-purple mb-6">
                    Gallery
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blog.images.map((image, index) => (
                      <div
                        key={index}
                        className="rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                      >
                        <ImageWithFallback
                          src={image.filename}
                          alt={`Image ${index + 1} for ${blog.title}`}
                          className="aspect-video"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                dangerouslySetInnerHTML={{ __html: blog.conclusion }}
                className="text-gray-600"
              />
            </div>

            {blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h2 className="text-xl font-bold text-primary-purple mb-4">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-secondary-blue/10 text-primary-blue px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary-blue/20 transition-colors duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
