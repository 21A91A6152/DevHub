import { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { tokenState } from "../store/atoms/auth";
import { IFeedback } from "../types";
import { ColorRing } from "react-loader-spinner";
import { VscFeedback } from "react-icons/vsc";
import toast from "react-hot-toast";

const GetFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [sentiments, setSentiments] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const token = useRecoilValue(tokenState);

  document.title = "DevHub Admin | Manage Feedbacks 💬";

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("/api/v1/admin/getfeedback", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const feedbackData = response.data;
        setFeedbacks(feedbackData);
        setLoading(false);

        // Sentiment analysis via your own backend API
        const sentimentPromises = feedbackData.map(async (feedback: IFeedback) => {
          try {
            const sentimentRes = await axios.post(
              "/api/v1/admin/sentimentanalysis", // 👈 updated to internal route
              { comment: feedback.comment },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return { id: feedback.id, sentiment: sentimentRes.data.sentiment };
          } catch (err) {
            console.error("Sentiment analysis failed for comment:", feedback.comment);
            return { id: feedback.id, sentiment: "Unknown" };
          }
        });

        const sentimentResults = await Promise.all(sentimentPromises);
        const sentimentMap: { [key: string]: string } = {};
        sentimentResults.forEach(({ id, sentiment }) => {
          sentimentMap[id] = sentiment;
        });

        setSentiments(sentimentMap);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        setLoading(false);
        toast.error("Failed to fetch feedbacks");
      }
    };

    fetchFeedbacks();
  }, [token]);

  const handleToggleVisibility = async (feedbackId: string) => {
    try {
      await axios.patch(
        `/api/v1/admin/toggleFeedbackVisibility/${feedbackId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Feedback visibility updated");

      setFeedbacks((prev) =>
        prev.map((feedback) =>
          feedback.id === feedbackId ? { ...feedback, visible: !feedback.visible } : feedback
        )
      );
    } catch (error) {
      console.error("Error updating feedback visibility:", error);
      toast.error("Error updating feedback visibility");
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    try {
      await axios.delete(`/api/v1/admin/deletefeedback/${feedbackId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Feedback deleted successfully");
      setFeedbacks((prev) => prev.filter((feedback) => feedback.id !== feedbackId));
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Error deleting feedback");
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:ml-80">
      <div className="mx-5 mb-5">
        <span className="flex items-center text-xl font-bold decoration-sky-500 decoration-dotted underline">
          <div className="inline-block p-2 text-white bg-[#000435] rounded-lg mr-2">
            <VscFeedback size={23} />
          </div>
          All Feedbacks
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-80">
          <ColorRing
            visible={true}
            height="100"
            width="100"
            colors={["#000435", "rgb(14 165 233)", "rgb(243 244 246)", "#000435", "rgb(14 165 233)"]}
          />
        </div>
      ) : (
        <div className="mx-5 lg:mr-11 overflow-x-auto shadow-md rounded-xl mb-5">
          <table className="w-full rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs md:text-sm text-white uppercase bg-sky-500 text-center">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-8 py-3">Comment</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Sentiment</th>
                <th className="px-6 py-3">Created At</th>
                <th className="px-16 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback) => (
                <tr
                  key={feedback.id}
                  className="text-xs md:text-sm text-center border-b bg-[#000435] border-sky-500 hover:bg-blue-950 hover:text-white"
                >
                  <td className="px-8">
                    <span className="font-bold">{feedback.user.username}</span>
                  </td>
                  <td className="px-8 py-4 font-semibold">{feedback.comment}</td>
                  <td className="px-8 py-4 font-semibold">{feedback.rating}</td>
                  <td className="px-6 py-4 font-semibold">
                    {sentiments[feedback.id] || "Analyzing..."}
                  </td>
                  <td className="px-8 py-4 font-semibold">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-4 grid grid-cols-1 gap-3 justify-center md:grid-cols-2">
                    <button
                      className={`font-semibold rounded-md p-2 text-white border-2 ${
                        feedback.visible ? "bg-red-500 hover:bg-red-600" : "bg-sky-500 hover:bg-sky-600"
                      }`}
                      onClick={() => handleToggleVisibility(feedback.id)}
                    >
                      {feedback.visible ? "Hide" : "Show"}
                    </button>
                    <button
                      className="font-semibold rounded-md p-2 text-white border-2 bg-red-500 hover:bg-red-600"
                      onClick={() => handleDeleteFeedback(feedback.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GetFeedbacks;
