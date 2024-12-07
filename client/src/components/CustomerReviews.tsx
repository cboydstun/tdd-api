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
          className="w-5 h-5 text-primary-blue fill-primary-blue"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="w-5 h-5 text-primary-blue fill-primary-blue"
        />
      );
    }

    return stars;
  };

  return (
    <div className="w-full bg-secondary-blue/5 py-12 rounded-xl">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary-purple">
          Customer Reviews
        </h2>

        {/* Reviews Summary */}
        <div className="flex justify-center items-center gap-8 mb-12 bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-2">{renderStars(5)}</div>
          <div className="flex flex-col items-start">
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
              5.0 Rating on Google
            </p>
            <p className="text-gray-600 font-medium">
              Based on {reviews.length} reviews
            </p>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-8 text-primary-blue font-semibold">
              Loading reviews...
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl border-2 border-transparent hover:border-secondary-blue/20 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Quote className="w-8 h-8 text-primary-blue mb-4" />
                <div className="flex items-center gap-2 mb-4">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-600 mb-6 line-clamp-4 text-lg">
                  {review.comment}
                </p>
                <div className="flex items-center gap-4">
                  {review.photoUrl ? (
                    <img
                      src={review.photoUrl}
                      alt={review.author}
                      className="w-12 h-12 rounded-full ring-2 ring-primary-blue/20"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {review.author[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-primary-purple text-lg">
                      {review.author}
                    </p>
                    <p className="text-gray-500 font-medium">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;
