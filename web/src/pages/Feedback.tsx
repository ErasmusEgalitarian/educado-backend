import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

function Feedback() {
    const [feedbackList, setFeedbackList] = useState<Array<{
        courseId: string;
        rating: number;
        feedbackText: string;
    }>>([]);

    useEffect(() => {
        const requestOptions = {
            method: "GET",
        };

        fetch("http://localhost:8888/api/feedback/getFeedbackForCourse/672b77f5d51069fc04ceb924", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setFeedbackList(data);
                } else {
                    console.error('Expected an array of feedback');
                }
            })
            .catch((error) => console.error('Error fetching feedback:', error));
    }, []);

    return (
        <Layout meta="Feedback">
            <main className="flex-grow overflow-x-hidden bg-secondary h-screen font-['Montserrat']">
                <div className="text-center py-8 px-10 w-full">
                    <div className="inline-block">
                        <div className="text-left mt-16 mb-20 text-neutral-700 text-[32px] font-bold">
                            Course Feedback
                        </div>
                        {feedbackList.length > 0 ? (
                            <div className="grid gap-6">
                                {feedbackList.map((feedback, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-xl p-6 w-[1000px]">
                                        <h2 className="text-2xl font-bold mb-4">Feedback #{index + 1}</h2>
                                        <div className="flex items-center mb-2">
                                            <span className="text-lg font-semibold mr-2">Rating:</span>
                                            <span className="text-lg">{feedback.rating}/5</span>
                                        </div>
                                        <p>{feedback.feedbackText}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No feedback available</p>
                        )}
                    </div>
                </div>
            </main>
        </Layout>
    );
}

export default Feedback;