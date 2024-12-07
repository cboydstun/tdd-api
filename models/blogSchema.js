// models/blogSchema.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  introduction: { type: String, required: true },
  body: { type: String, required: true },
  conclusion: { type: String, required: true },
  images: [{
    filename: { type: String, required: true },
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    mimetype: { type: String },
    size: { type: Number }
  }],
  excerpt: { type: String, maxlength: 200 },
  featuredImage: { type: String },
  categories: [{ type: String, trim: true }],
  tags: [{ type: String, trim: true }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishDate: { type: Date },
  lastModified: { type: Date },
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isApproved: { type: Boolean, default: false }
  }],
  meta: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    focusKeyword: { type: String }
  },
  readTime: { type: Number },
  isFeature: { type: Boolean, default: false },
  relatedPosts: [{ type: Schema.Types.ObjectId, ref: 'Blog' }]
}, { timestamps: true });

// Indexes for better query performance
blogSchema.index({ slug: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ categories: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ publishDate: -1 });

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
