import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getCloudinaryImageProps } from "../utils/cloudinary";

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
      className={`relative bg-gray-100 ${
        !imageLoaded && !imageError ? "animate-pulse" : ""
      }`}
    >
      <img
        {...imageProps}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
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
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-gray-500">Image failed to load</p>
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
      <div className="flex justify-center items-center min-h-[400px]">
        <div
          data-testid="loading-spinner"
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"
        />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || "Blog post not found"}</p>
        <button
          onClick={() => navigate("/blogs")}
          className="mt-4 text-primary-blue hover:underline"
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate("/blogs")}
        className="text-primary-blue hover:underline mb-8 inline-flex items-center"
      >
        ← Back to Blogs
      </button>

      {blog.featuredImage && (
        <div className="aspect-video mb-8 rounded-lg overflow-hidden">
          <ImageWithFallback
            src={blog.featuredImage}
            alt={`Featured image for ${blog.title}`}
          />
        </div>
      )}

      <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

      <div className="flex items-center text-sm text-gray-500 mb-8">
        {blog.author && <span>By {blog.author.email}</span>}
        <span className="mx-2">•</span>
        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        <span className="mx-2">•</span>
        <div className="flex items-center gap-4">
          <span>{blog.meta.views} views</span>
          <span>{blog.meta.likes} likes</span>
          <span>{blog.meta.shares} shares</span>
        </div>
      </div>

      {blog.categories.length > 0 && (
        <div className="flex gap-2 mb-8">
          {blog.categories.map((category, index) => (
            <span
              key={index}
              className="bg-secondary-blue/10 text-primary-blue px-3 py-1 rounded-full text-sm"
            >
              {category}
            </span>
          ))}
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        <div
          dangerouslySetInnerHTML={{ __html: blog.introduction }}
          className="mb-8"
        />
        <div dangerouslySetInnerHTML={{ __html: blog.body }} className="mb-8" />

        {blog.images && blog.images.length > 0 && (
          <>
            <div className="my-8">
              <h3 className="text-2xl font-semibold mb-4">Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blog.images.map((image, index) => {
                  return (
                    <div key={index} className="rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={image.filename}
                        alt={`Image ${index + 1} for ${blog.title}`}
                        className="aspect-video"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <div dangerouslySetInnerHTML={{ __html: blog.conclusion }} />
      </div>

      {blog.tags.length > 0 && (
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-lg font-semibold mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogPost;
