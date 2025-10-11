import React, { useState, useEffect } from "react";

import CourseServices from "../../unplaced/services/course.services";
import { BACKEND_URL } from "../config/environment";

import Loading from "./Loading";

interface Feedback {
  _id: string;
  rating: number;
  feedbackText: string;
  dateCreated: string;
}

interface FeedbackBoxProps {
  id: string;
  token: string;
}

const FeedbackBox: React.FC<FeedbackBoxProps> = ({ id, token }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (id !== "" && token !== "") {
        try {
          const response = await CourseServices.getCourseFeedback(
            `${BACKEND_URL}/api/feedback/${id}`,
            token,
          );
          setFeedbacks(response.data);
        } catch (error) {
          console.error("Error fetching feedbacks:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFeedbacks();
  }, [id, token]);

  if (loading) return <Loading />;

  return (
    <div className="feedback-box bg-transparent p-4 rounded-sm overflow-y-auto max-h-[500px] w-[80%]">
      {feedbacks.length > 0 ? (
        feedbacks.map((feedback, index) => (
          <React.Fragment key={feedback._id}>
            <div className="feedback-item mb-2">
              <p className="text-sm">Avaliação: {feedback.rating} de 5</p>
              <p className="text-sm">{feedback.feedbackText}</p>
              <small className="text-gray-500">
                Em {new Date(feedback.dateCreated).toLocaleDateString()}
              </small>
            </div>
            {index < feedbacks.length - 1 && <hr className="my-2" />}
          </React.Fragment>
        ))
      ) : (
        <p>Nenhum feedback disponível para este curso.</p>
      )}
    </div>
  );
};

export default FeedbackBox;
