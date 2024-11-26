export interface Blog {
    _id: string;
    title: string;
    slug: string;
    introduction: string;
    body: string;
    conclusion: string;
    excerpt?: string;
    featuredImage?: string;
    categories?: string[];
    tags?: string[];
    status: "draft" | "published";
    publishDate?: string;
    readTime?: string;
}

export interface BlogFormData {
    title: string;
    introduction: string;
    body: string;
    conclusion: string;
    excerpt?: string;
    categories?: string;
    tags?: string;
    status: "draft" | "published";
}
