import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, ThumbsUp, Clock } from "lucide-react";

const FeedbackForum = ({ courseId, studentId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [likedPosts, setLikedPosts] = useState(new Set());

  // Fetch feedbacks
  useEffect(() => {
    axios
      .get(`http://localhost:8086/api/v1/student/course/${courseId}/feedback`)
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, [courseId]);

  // Submit new feedback
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!newFeedback.trim() || rating === 0) return;

    const payload = {
      student_id: studentId,
      course_id: courseId,
      review: newFeedback,
      rate: rating,
    };

    try {
      const res = await axios.post(
        `http://localhost:8086/api/v1/student/course/${courseId}/feedback`,
        payload
      );

      // Ensure response has required fields
      const safeFeedback = {
        feedback_id: res.data.feedback_id ?? Date.now(), // fallback id
        student_id: res.data.student_id ?? studentId,
        course_id: res.data.course_id ?? courseId,
        review: res.data.review ?? newFeedback,
        rate: res.data.rate ?? rating,
        likes: res.data.likes ?? 0,
      };

      setFeedbacks([safeFeedback, ...feedbacks]);
      setNewFeedback("");
      setRating(0);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleLike = (id) => {
    const newLikedPosts = new Set(likedPosts);
    const isLiked = likedPosts.has(id);
    if (isLiked) newLikedPosts.delete(id);
    else newLikedPosts.add(id);

    setLikedPosts(newLikedPosts);

    setFeedbacks(
      feedbacks.map((f) =>
        f.feedback_id === id
          ? { ...f, likes: isLiked ? f.likes - 1 : f.likes + 1 }
          : f
      )
    );
  };

  const getAvatarColor = (text) => {
    if (!text) return "bg-gray-400";
    const colors = [
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-green-500 to-green-600",
      "bg-gradient-to-br from-purple-500 to-purple-600",
      "bg-gradient-to-br from-orange-500 to-orange-600",
      "bg-gradient-to-br from-pink-500 to-pink-600",
    ];
    return colors[text.charCodeAt(0) % colors.length];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-br from-[#2CC295] to-[#2CC295]/80 p-3 rounded-xl shadow-lg">
          <Star className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#132D46] tracking-tight">
            Feedback Forum
          </h2>
          <p className="text-[#696E79] font-medium">
            Share your thoughts and rate the course
          </p>
        </div>
      </div>

      {/* Post New Feedback */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 overflow-hidden">
        <div className="bg-gradient-to-r from-[#132D46] to-[#191E29] px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Share Your Feedback</span>
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <textarea
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
            placeholder="Share your thoughts about the course..."
            rows="4"
            className="w-full border-2 border-[#191E29]/20 rounded-xl px-4 py-3 text-[#132D46] font-medium focus:border-[#2CC295] focus:ring-4 focus:ring-[#2CC295]/20 transition-all duration-200 resize-none"
          />

          {/* Star Rating */}
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer transition-all duration-200 ${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <button
            onClick={handleFeedbackSubmit}
            className="bg-gradient-to-r from-[#2CC295] to-[#2CC295]/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
          >
            <Star className="w-5 h-5" />
            <span>Post Feedback</span>
          </button>
        </div>
      </div>

      {/* Feedback Posts */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#132D46] flex items-center space-x-2">
            <Star className="w-5 h-5 text-[#2CC295]" />
            <span>Community Feedback</span>
            <span className="bg-[#2CC295]/20 text-[#2CC295] px-3 py-1 rounded-full text-sm font-semibold">
              {feedbacks.length}
            </span>
          </h3>
        </div>

        {feedbacks.map((feedback) => (
          <div
            key={feedback.feedback_id}
            className="bg-white rounded-2xl shadow-lg border border-[#191E29]/10 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="p-6 border-b border-[#191E29]/10">
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 ${getAvatarColor(
                    feedback.review?.[0]
                  )} rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}
                >
                  <span className="text-white font-bold text-sm">
                    {feedback.review?.[0] ?? "?"}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[#132D46] text-lg">
                      Student {feedback.student_id}
                    </h4>
                    {/* <span className="text-[#696E79] text-sm font-medium flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Just now</span>
                    </span> */}
                  </div>
                  <p className="text-[#132D46] font-medium mt-3 leading-relaxed">
                    {feedback.review}
                  </p>

                  {/* Display Rating */}
                  <div className="flex mt-2 space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${feedback.rate >= star
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gradient-to-r from-[#F8FFFE] to-[#F0FFF4] border-b border-[#191E29]/10">
              <button
                onClick={() => handleLike(feedback.feedback_id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${likedPosts.has(feedback.feedback_id)
                    ? "bg-[#2CC295] text-white shadow-lg"
                    : "bg-white text-[#132D46] hover:bg-[#2CC295]/10 border border-[#191E29]/10"
                  }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{feedback.likes || 0}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackForum;
