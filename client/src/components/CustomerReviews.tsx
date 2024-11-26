import { useState, useEffect } from "react";
import { Star, StarHalf, Quote } from "lucide-react";

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  photoUrl?: string;
}

const CustomerReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Static fallback reviews in case API fails or during development
  const staticReviews: Review[] = [
    {
      id: "1",
      author: "Sarah Johnson",
      rating: 5,
      comment:
        "Amazing service! The bounce house was clean, delivered on time, and the kids had a blast. Will definitely use again for our next party!",
      date: "2024-03-15",
    },
    {
      id: "2",
      author: "Michael Rodriguez",
      rating: 5,
      comment:
        "Professional service from start to finish. Setup and takedown were quick and efficient. Great value for money!",
      date: "2024-03-10",
    },
    {
      id: "3",
      author: "Amanda Chen",
      rating: 5,
      comment:
        "Used SATX Bounce for my sons birthday. The equipment was in perfect condition and the staff was very helpful with all my questions.",
      date: "2024-03-05",
    },
  ];

  // Uncomment and implement this when ready to integrate with Google Business Profile API
  /*
  useEffect(() => {
    const fetchGoogleReviews = async () => {
      try {
        const response = await fetch('/api/google-reviews', {
          headers: {
            'Authorization': `Bearer ${process.env.GOOGLE_API_KEY}`
          }
        });
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews(staticReviews); // Fallback to static reviews
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleReviews();
  }, []);
  */

  // Using static reviews for now
  useEffect(() => {
    setReviews(staticReviews);
    setLoading(false);
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="w-5 h-5 text-secondary-purple fill-secondary-purple"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="w-5 h-5 text-secondary-purple fill-secondary-purple"
        />
      );
    }

    return stars;
  };

  return (
    <div className="mt-16">
      {/* Reviews Summary */}
      <div className="flex justify-center items-center gap-8 mb-12">
        <div className="flex items-center gap-2">{renderStars(5)}</div>
        <div className="flex flex-col items-start">
          <p className="text-2xl font-semibold text-primary-purple">
            5.0 Rating on Google
          </p>
          <p className="text-gray-600">Based on {reviews.length} reviews</p>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid md:grid-cols-3 gap-6 px-4">
        {loading ? (
          <div className="col-span-3 text-center py-8">Loading reviews...</div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:border-secondary-purple transition duration-300"
            >
              <Quote className="w-8 h-8 text-secondary-purple mb-4" />
              <div className="flex items-center gap-2 mb-3">
                {renderStars(review.rating)}
              </div>
              <p className="text-gray-700 mb-4 line-clamp-4">
                {review.comment}
              </p>
              <div className="flex items-center gap-3">
                {review.photoUrl ? (
                  <img
                    src={review.photoUrl}
                    alt={review.author}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-purple/10 flex items-center justify-center">
                    <span className="text-primary-purple font-semibold">
                      {review.author[0]}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-primary-purple">
                    {review.author}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerReviews;
