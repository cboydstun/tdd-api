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

  // Generate 72 reviews with varied content for demo
  const generateReviews = (): Review[] => {
    const comments = [
      "Amazing service! The bounce house was clean, delivered on time, and the kids had a blast. Will definitely use again for our next party!",
      "Professional service from start to finish. Setup and takedown were quick and efficient. Great value for money!",
      "Used SATX Bounce for my son's birthday. The equipment was in perfect condition and the staff was very helpful with all my questions.",
      "Fantastic experience! Everything was perfect and the kids couldn't have been happier.",
      "The team was punctual, professional, and the bounce house was spotless. Highly recommend!",
      "Best party rental service in San Antonio! The kids had an absolute blast.",
    ];

    const names = [
      "Sarah Johnson", "Michael Rodriguez", "Amanda Chen", "David Smith",
      "Maria Garcia", "John Davis", "Lisa Wilson", "James Martinez"
    ];

    return Array.from({ length: 72 }, (_, i) => ({
      id: `review-${i + 1}`,
      author: names[Math.floor(Math.random() * names.length)],
      rating: 5,
      comment: comments[Math.floor(Math.random() * comments.length)],
      date: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString(),
    }));
  };

  useEffect(() => {
    setReviews(generateReviews());
    setLoading(false);
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="w-4 h-4 text-yellow-400 fill-yellow-400"
        />
      );
    }

    return stars;
  };

  return (
    <div className="relative w-full h-[350px] overflow-hidden bg-gradient-to-b from-secondary-blue/10 to-secondary-blue/5 py-24">
      {/* Reviews Summary Card */}
      <div className="container mx-auto px-4 mb-12 relative z-10">
        <div className="flex justify-center items-center gap-8 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-2xl mx-auto border border-white/50">
          <div className="flex items-center gap-2">{renderStars(5)}</div>
          <div className="flex flex-col items-start">
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
              5.0 Rating on Google
            </p>
            <p className="text-gray-600 font-medium">
              Based on {reviews.length} verified reviews
            </p>
          </div>
        </div>
      </div>

      {/* Floating Reviews */}
      <div className="absolute inset-0 overflow-hidden">
        {!loading && reviews.map((review, index) => (
          <div
            key={review.id}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              animation: `float-up ${20 + Math.random() * 10}s linear infinite`,
              animationDelay: `${(index * -200) % 2000}ms`,
              opacity: 0.9,
            }}
          >
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/50 hover:bg-white/90 transition-all duration-300 max-w-xs transform hover:scale-105">
              <div className="flex items-center gap-2 mb-2">
                {renderStars(review.rating)}
              </div>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {review.comment}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center text-white text-sm">
                  {review.author[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm text-primary-purple">
                    {review.author}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add custom keyframes for the floating animation */}
      <style>
        {`
          @keyframes float-up {
            0% {
              transform: translateY(100vh) rotate(${Math.random() * 10 - 5}deg);
            }
            100% {
              transform: translateY(-100%) rotate(${Math.random() * 10 - 5}deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default CustomerReviews;