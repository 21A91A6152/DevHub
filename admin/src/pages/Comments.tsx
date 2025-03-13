import { useState, useEffect } from "react";
import axios from "axios";
import { IPost, IComment } from "../types";
import { useRecoilValue } from "recoil";
import { tokenState } from "../store/atoms/auth";
import toast from "react-hot-toast";
import { ColorRing } from 'react-loader-spinner';
import { FaComments } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";

const Comments = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [sentiments, setSentiments] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const token = useRecoilValue(tokenState);

  document.title = "DevHub Admin | Manage Users Comments 💬";

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/v1/admin/posts/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedPosts = response.data.posts;
      setPosts(fetchedPosts);
      setLoading(false);

      // Run sentiment analysis for all comments
      const allComments = fetchedPosts.flatMap((post: IPost) => post.comments || []);
      const sentimentPromises = allComments.map(async (comment: IComment) => {
        try {
          const sentimentRes = await axios.post(
            "/api/v1/admin/sentimentanalysis",
            { comment: comment.content },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return { id: comment.id, sentiment: sentimentRes.data.sentiment };
        } catch (err) {
          console.error("Sentiment analysis failed for comment:", comment.content);
          return { id: comment.id, sentiment: "Unknown" };
        }
      });

      const sentimentResults = await Promise.all(sentimentPromises);
      const sentimentMap: { [key: string]: string } = {};
      sentimentResults.forEach(({ id, sentiment }) => {
        sentimentMap[id] = sentiment;
      });
      setSentiments(sentimentMap);

    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts & comments");
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`/api/v1/admin/comments/delete/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Comment deleted successfully');
      fetchPosts();
    } catch (error) {
      console.error("Error deleting comment", error);
      toast.error("Failed to delete comment");
    }
  };

  const downloadUsersCommentsReport = async () => {
    try {
      const response = await axios.get('/api/v1/admin/downloaduserscommentsreport', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'DevHub_Users_Comments_Report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading users comments report:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:ml-80">
      <div className="mx-5 mb-5 flex items-center justify-between">
        <span className="flex items-center text-xl font-bold decoration-sky-500 underline decoration-dotted">
          <div className="inline-block p-2 text-white bg-[#000435] rounded-lg mr-2">
            <FaComments size={23} />
          </div>
          All Comments
        </span>
        <button
          onClick={downloadUsersCommentsReport}
          className="flex items-center bg-[#000435] text-white p-2 px-4 rounded-lg hover:bg-sky-600 transition"
        >
          <TbReportAnalytics className="mr-2" />
          Download Report
        </button>
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
        posts.map((post) => (
          <div key={post.id} className="mx-5 lg:mr-11 mb-6 shadow-md border border-sky-500 rounded-xl p-4 bg-[#000435] text-white">
            <h2 className="text-lg font-bold mb-2 text-sky-400">Post: {post.title}</h2>
            {post.comments?.length > 0 ? (
              <table className="w-full text-sm text-center">
                <thead className="bg-sky-500 text-white uppercase">
                  <tr>
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Comment</th>
                    <th className="px-4 py-2">Sentiment</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {post.comments.map((comment: IComment) => (
                    <tr key={comment.id} className="hover:bg-blue-950 border-b border-sky-500">
                      <td className="py-2 font-semibold">{comment.user.username}</td>
                      <td className="py-2">{comment.content}</td>
                      <td className="py-2 font-medium text-sky-300">
                        {sentiments[comment.id] || "Analyzing..."}
                      </td>
                      <td className="py-2">{new Date(comment.createdAt).toLocaleDateString()}</td>
                      <td className="py-2">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded-md"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-300">No comments for this post.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
