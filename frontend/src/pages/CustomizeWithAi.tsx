import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { IPost } from "../types";
import { tokenState, userState } from "../store/atoms/auth";
import { useRecoilValue } from "recoil";
import toast from "react-hot-toast";
import PostCodeWithPreview from "../components/PostCodeWithPreview";
import bgHero from "../assets/bgHero.png";

const CustomizeWithAi = () => {
  const user = useRecoilValue(userState);
  const { id } = useParams<{ id: string }>();
  const [customCssCode, setCustomCssCode] = useState("");
  const [customJsCode, setCustomJsCode] = useState("");
  const [query, setQuery] = useState("");
  const location = useLocation();
  const post: IPost = location.state.post;
  const token = useRecoilValue(tokenState);
  const [loading, setLoading] = useState(false);

  const handleCustomize = async () => {
    if (!user.verified) {
      toast.error("Please verify to access this feature 😟");
      return;
    }

    if (query === "") {
      toast.error("Please fill the input 😟");
      return;
    }
    toast.promise(
      (async () => {
        setLoading(true);
        try {
          const response = await axios.post(
            "/api/v1/posts/customize",
            { id, query },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCustomCssCode(response.data.css);
          setCustomJsCode(response.data.js);
          setLoading(false);
        } catch (error) {
          console.error("Failed to customize the code", error);
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            console.error("Error response:", axiosError.response.data);
          }
          setLoading(false);
          throw error;
        }
      })(),
      {
        loading: "Sending your request to server ⏳",
        success: "Customized successfully 😄",
        error: "Something went wrong 😔",
      }
    );
  };

  document.title='DevHub | Customize 🤖'

  return (
    <div className="-mt-20 w-full text-[#000435] bg-white dark:text-white dark:bg-[#000435] py-16 px-4" style={{ backgroundImage: `url(${bgHero})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="customize-page p-6 max-w-screen-xl mx-auto text-[#000435] bg-white dark:text-white dark:bg-[#000435]">
      <h1 className="text-3xl font-bold mb-5">✨ Customize Component with AI ✨</h1>
        <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">😀 Original Code Snippet</h2>
          <PostCodeWithPreview
            id={post.id}
            isOwner={false}
            codeSnippet={post.codeSnippet}
            jsCodeSnippet={post.jsCodeSnippet}
            handleCustomizeAi={() => {}}
            showCustomizeAiOption={false}
            showTogether={false}
          />
        </div>
        <input
          className="w-full p-3 mb-5 rounded text-[#000435] bg-white dark:text-white dark:bg-[#000435] border-2 border-sky-500 backdrop-blur-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="📝 Describe your customization here..."
          required
        />
        {loading ? (
          <button
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded mb-4 cursor-not-allowed"
            onClick={handleCustomize}
          >
            Please wait...
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded mb-4"
            onClick={handleCustomize}
          >
             Submit
          </button>
        )}
        {(customCssCode || customJsCode) && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#9b42c4] dark:text-white mb-2">
              🌟 Customized Code Snippet
            </h2>
            <PostCodeWithPreview
              id={post.id}
              isOwner={false}
              codeSnippet={customCssCode}
              jsCodeSnippet={customJsCode}
              handleCustomizeAi={() => {}}
              showCustomizeAiOption={false}
              showTogether={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizeWithAi;
