import { getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  manageUserApi,
  manageIgMediaAutomationApi,
} from "../../services/handleApi";
import { getAllIgMedia } from "../../services/igApis";
import { ContentIcon, DashboardIcon, PostsIcon } from "../../assets/icons";

const CommentAutomationPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("comment-automation");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [automations, setAutomations] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [automationType, setAutomationType] = useState("ANY_COMMENT");
  const [keywords, setKeywords] = useState("");
  const [replyText, setReplyText] = useState("");
  const [creatingAutomation, setCreatingAutomation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      const userRes = await manageUserApi("GET", {
        id: `${currentUser.username}::${currentUser.username}`,
      });
      if (userRes.success) {
        setUser(userRes.items?.[0]);
        fetchAutomations(userRes.items?.[0]?.id);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAutomations = async (userId) => {
    try {
      const response = await manageIgMediaAutomationApi("LIST", {
        userId: userId,
      });
      if (response?.success) {
        setAutomations(response.items || []);
      }
    } catch (error) {
      console.error("Error fetching automations:", error);
    }
  };

  const fetchPosts = async () => {
    if (!user?.instagramDetails?.instagramRefreshToken) {
      alert("Please connect your Instagram account first");
      return;
    }

    setLoadingPosts(true);
    try {
      const postsRes = await getAllIgMedia(
        user.instagramDetails.instagramRefreshToken
      );
      if (postsRes) {
        setPosts(postsRes || []);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleCreateAutomation = () => {
    setShowCreateModal(true);
    setCreateStep(1);
    setSelectedPost(null);
    setAutomationType("ANY_COMMENT");
    setKeywords("");
    setReplyText("");
    fetchPosts();
  };

  const handleSelectPost = (post) => {
    setSelectedPost(post);
    setCreateStep(2);
  };

  const handleNextStep = () => {
    if (createStep === 2) {
      setCreateStep(3);
    } else if (createStep === 3 && automationType === "SPECIFIC_KEYWORD") {
      setCreateStep(4);
    } else if (createStep === 3 && automationType === "ANY_COMMENT") {
      setCreateStep(5);
    } else if (createStep === 4) {
      setCreateStep(5);
    }
  };

  const handleSubmitAutomation = async () => {
    if (!replyText.trim()) {
      alert("Please enter reply text");
      return;
    }

    setCreatingAutomation(true);
    try {
      const automationData = {
        id: selectedPost.id,
        userId: user.id,
        mediaType: selectedPost.media_type,
        mediaUrl: selectedPost.media_url,
        // postedAt: selectedPost.timestamp,
        isActive: true,
        automationType: "COMMENT_ONLY",
        automationTrigger: automationType,
        replyCommentText: replyText,
      };

      if (automationType === "SPECIFIC_KEYWORD") {
        automationData.keywords = keywords.split(",").map((k) => k.trim());
      }

      const response = await manageIgMediaAutomationApi(
        "CREATE",
        automationData
      );

      if (response?.success) {
        setShowSuccessModal(true);
        setShowCreateModal(false);
        fetchAutomations(user.id);
      } else {
        throw new Error(response?.message || "Failed to create automation");
      }
    } catch (error) {
      console.error("Error creating automation:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setCreatingAutomation(false);
    }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateStep(1);
    setSelectedPost(null);
    setAutomationType("ANY_COMMENT");
    setKeywords("");
    setReplyText("");
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const menuItems = [
    { id: "dashboard", icon: <DashboardIcon />, label: "Dashboard" },
    { id: "posts", icon: <PostsIcon />, label: "Posts" },
    { id: "content-posting", icon: <ContentIcon />, label: "Content Posting" },
    { id: "comment-automation", icon: "🤖", label: "Comment Automation" },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getMediaIcon = (type, productType) => {
    if (productType === "REELS") return "🎬";
    if (type === "VIDEO") return "🎥";
    if (type === "CAROUSEL_ALBUM") return "📷";
    return "📸";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F1F1] to-[#D4D4D4] flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-[#D4D4D4] transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 border-b border-[#D4D4D4]">
          <img src="/briggoLogo.svg" alt="" className="h-12 w-28" />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <a
              href={`/${item.id}`}
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white shadow-lg"
                  : "text-[#919191] hover:bg-[#F1F1F1] hover:text-[#2B2B2B]"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-[#D4D4D4]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#F1F1F1] hover:bg-[#D4D4D4] transition-all duration-300 text-[#2B2B2B]"
          >
            <span className="text-xl">{sidebarOpen ? "◀" : "▶"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-[#D4D4D4] px-8 py-7">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2B2B2B]">
                Comment Automation
              </h1>
              {/* <p className="text-[#919191] mt-1">
                Automate your Instagram comment replies
              </p> */}
            </div>
            <div className="flex items-center gap-4">
              {/* <button
                onClick={handleCreateAutomation}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white hover:shadow-lg transition-all duration-300 font-medium flex items-center gap-2"
              >
                <span className="text-xl">➕</span>
                Create Automation
              </button> */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-[#2B2B2B] text-white hover:bg-[#919191] transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Automations List */}
        <div className="p-8">
          {loading ? (
            // Skeleton Loader
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg border border-[#D4D4D4] overflow-hidden animate-pulse"
                >
                  <div className="w-full h-48 bg-[#D4D4D4]"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-[#D4D4D4] rounded w-3/4"></div>
                    <div className="h-4 bg-[#D4D4D4] rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : automations.length === 0 ? (
            // No Automations State
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#2B2B2B] to-[#919191] rounded-full flex items-center justify-center">
                  <span className="text-6xl">🤖</span>
                </div>
                <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4">
                  No Automations Yet
                </h2>
                <p className="text-xl text-[#919191] mb-8">
                  Create your first comment automation to save time
                </p>
                <button
                  onClick={handleCreateAutomation}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <span className="text-2xl">➕</span>
                  Create Your First Automation
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-end mb-6">
                <button
                  onClick={handleCreateAutomation}
                  className="px-6 py-3 rounded-xl bg-[#2B2B2B] text-white hover:shadow-lg transition-all duration-300 font-medium flex items-center gap-2"
                >
                  <span className="text-xl">➕</span>
                  Create Automation
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {automations.map((automation) => (
                  <div
                    key={automation.id}
                    className="bg-white rounded-2xl shadow-lg border border-[#D4D4D4] overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Media Preview */}
                    <div className="relative">
                      <img
                        src={automation.mediaUrl}
                        alt="Post"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 bg-[#2B2B2B]/80 backdrop-blur-sm text-white rounded-full text-sm font-semibold">
                        {getMediaIcon(automation.mediaType)}
                      </div>
                      {automation.isActive ? (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white rounded-full text-sm font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                          Active
                        </div>
                      ) : (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-red-500/90 backdrop-blur-sm text-white rounded-full text-sm font-semibold">
                          Inactive
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#2B2B2B] px-3 py-1 bg-[#F1F1F1] rounded-full">
                          {automation.automationTrigger === "ANY_COMMENT"
                            ? "Reply to All"
                            : "Keyword Based"}
                        </span>
                        {/* <span className="text-xs text-[#919191]">
                        {formatDate(automation.postedAt)}
                      </span> */}
                      </div>

                      {automation.keywords &&
                        automation.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {automation.keywords.map((keyword, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full font-medium"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}

                      <div className="bg-[#F1F1F1] rounded-xl p-3">
                        <p className="text-xs text-[#919191] mb-1 font-semibold">
                          Reply Text:
                        </p>
                        <p className="text-sm text-[#2B2B2B] line-clamp-2">
                          {automation.replyCommentText}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Create Automation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h2 className="text-xl font-bold">
                    Create Comment Automation
                  </h2>
                  <p className="text-sm opacity-90">Step {createStep} of 5</p>
                </div>
              </div>
              <button
                onClick={closeCreateModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                disabled={creatingAutomation}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#D4D4D4] h-2">
              <div
                className="bg-gradient-to-r from-[#2B2B2B] to-[#919191] h-2 transition-all duration-300"
                style={{ width: `${(createStep / 5) * 100}%` }}
              ></div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Step 1: Select Post */}
              {createStep === 1 && (
                <div>
                  <h3 className="text-2xl font-bold text-[#2B2B2B] mb-4">
                    Select a Post
                  </h3>
                  <p className="text-[#919191] mb-6">
                    Choose the post you want to automate comment replies for
                  </p>

                  {loadingPosts ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="bg-[#F1F1F1] rounded-xl overflow-hidden animate-pulse"
                        >
                          <div className="w-full h-48 bg-[#D4D4D4]"></div>
                          <div className="p-3">
                            <div className="h-4 bg-[#D4D4D4] rounded w-3/4"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-[#919191]">No posts available</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {posts.map((post) => (
                        <div
                          key={post.id}
                          onClick={() => handleSelectPost(post)}
                          className={`bg-white rounded-xl overflow-hidden border-2 cursor-pointer hover:shadow-lg transition-all duration-300 ${
                            selectedPost?.id === post.id
                              ? "border-[#2B2B2B] shadow-lg scale-105"
                              : "border-[#D4D4D4]"
                          }`}
                        >
                          <img
                            src={post.thumbnail_url || post.media_url}
                            alt="Post"
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-3">
                            <p className="text-sm text-[#2B2B2B] font-medium truncate">
                              {post.media_product_type || post.media_type}
                            </p>
                            <p className="text-xs text-[#919191]">
                              {formatDate(post.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Choose Automation Type */}
              {createStep === 2 && (
                <div>
                  <h3 className="text-2xl font-bold text-[#2B2B2B] mb-4">
                    Choose Automation Type
                  </h3>
                  <p className="text-[#919191] mb-6">
                    Select how you want to trigger automated replies
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      onClick={() => setAutomationType("ANY_COMMENT")}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        automationType === "ANY_COMMENT"
                          ? "border-[#2B2B2B] bg-gradient-to-br from-[#F1F1F1] to-white shadow-lg"
                          : "border-[#D4D4D4] bg-white hover:border-[#919191]"
                      }`}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-[#2B2B2B] to-[#919191] rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">💬</span>
                      </div>
                      <h4 className="text-xl font-bold text-[#2B2B2B] mb-2">
                        Reply to All Comments
                      </h4>
                      <p className="text-[#919191]">
                        Automatically reply to every comment on this post
                      </p>
                    </div>

                    <div
                      onClick={() => setAutomationType("SPECIFIC_KEYWORD")}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        automationType === "SPECIFIC_KEYWORD"
                          ? "border-[#2B2B2B] bg-gradient-to-br from-[#F1F1F1] to-white shadow-lg"
                          : "border-[#D4D4D4] bg-white hover:border-[#919191]"
                      }`}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-[#2B2B2B] to-[#919191] rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">🔍</span>
                      </div>
                      <h4 className="text-xl font-bold text-[#2B2B2B] mb-2">
                        Keyword Based
                      </h4>
                      <p className="text-[#919191]">
                        Reply only when comments contain specific keywords
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Enter Keywords (if SPECIFIC_KEYWORD) */}
              {createStep === 3 && automationType === "SPECIFIC_KEYWORD" && (
                <div>
                  <h3 className="text-2xl font-bold text-[#2B2B2B] mb-4">
                    Enter Keywords
                  </h3>
                  <p className="text-[#919191] mb-6">
                    Add keywords separated by commas. Automation will trigger
                    when comments contain any of these keywords.
                  </p>

                  <div className="bg-[#F1F1F1] rounded-2xl p-6">
                    <label className="block text-sm font-semibold text-[#2B2B2B] mb-3">
                      Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="e.g., price, available, buy"
                      className="w-full px-4 py-3 border-2 border-[#D4D4D4] rounded-xl focus:border-[#2B2B2B] focus:outline-none transition-colors"
                    />
                    <p className="text-xs text-[#919191] mt-2">
                      Example: "price, cost, buy, available"
                    </p>

                    {keywords && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-[#2B2B2B] mb-2">
                          Preview:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {keywords.split(",").map((keyword, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                            >
                              {keyword.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4/5: Enter Reply Text */}
              {(createStep === 4 ||
                (createStep === 3 && automationType === "ANY_COMMENT")) && (
                <div>
                  <h3 className="text-2xl font-bold text-[#2B2B2B] mb-4">
                    Enter Reply Text
                  </h3>
                  <p className="text-[#919191] mb-6">
                    This message will be automatically posted as a reply
                  </p>

                  <div className="bg-[#F1F1F1] rounded-2xl p-6">
                    <label className="block text-sm font-semibold text-[#2B2B2B] mb-3">
                      Reply Comment Text
                    </label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your automated reply here..."
                      className="w-full px-4 py-3 border-2 border-[#D4D4D4] rounded-xl focus:border-[#2B2B2B] focus:outline-none resize-none transition-colors"
                      rows={6}
                    />
                    <p className="text-xs text-[#919191] mt-2">
                      {replyText.length} characters
                    </p>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {createStep === 5 && (
                <div>
                  <h3 className="text-2xl font-bold text-[#2B2B2B] mb-4">
                    Review Your Automation
                  </h3>
                  <p className="text-[#919191] mb-6">
                    Please review the details before activating
                  </p>

                  <div className="space-y-4">
                    {/* Selected Post */}
                    <div className="bg-[#F1F1F1] rounded-2xl p-4">
                      <p className="text-sm font-semibold text-[#919191] mb-2">
                        Selected Post
                      </p>
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            selectedPost?.thumbnail_url ||
                            selectedPost?.media_url
                          }
                          alt="Post"
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#2B2B2B]">
                            {selectedPost?.media_product_type ||
                              selectedPost?.media_type}
                          </p>
                          <p className="text-xs text-[#919191]">
                            {formatDate(selectedPost?.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Automation Type */}
                    <div className="bg-[#F1F1F1] rounded-2xl p-4">
                      <p className="text-sm font-semibold text-[#919191] mb-2">
                        Automation Type
                      </p>
                      <p className="text-lg font-bold text-[#2B2B2B]">
                        {automationType === "ANY_COMMENT"
                          ? "Reply to All Comments"
                          : "Keyword Based Reply"}
                      </p>
                    </div>

                    {/* Keywords */}
                    {automationType === "SPECIFIC_KEYWORD" && (
                      <div className="bg-[#F1F1F1] rounded-2xl p-4">
                        <p className="text-sm font-semibold text-[#919191] mb-2">
                          Keywords
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {keywords.split(",").map((keyword, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                            >
                              {keyword.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reply Text */}
                    <div className="bg-[#F1F1F1] rounded-2xl p-4">
                      <p className="text-sm font-semibold text-[#919191] mb-2">
                        Reply Text
                      </p>
                      <p className="text-sm text-[#2B2B2B] whitespace-pre-wrap">
                        {replyText}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#D4D4D4] px-6 py-4 bg-[#F1F1F1] flex items-center justify-between">
              <button
                onClick={closeCreateModal}
                className="px-6 py-2 bg-white border-2 border-[#D4D4D4] text-[#2B2B2B] rounded-xl font-medium hover:bg-[#F1F1F1] transition-all duration-300"
                disabled={creatingAutomation}
              >
                Cancel
              </button>

              {createStep < 5 ? (
                <button
                  onClick={handleNextStep}
                  disabled={
                    (createStep === 1 && !selectedPost) ||
                    (createStep === 3 &&
                      automationType === "SPECIFIC_KEYWORD" &&
                      !keywords.trim()) ||
                    (createStep === 3 &&
                      automationType === "ANY_COMMENT" &&
                      !replyText.trim()) ||
                    (createStep === 4 && !replyText.trim())
                  }
                  className="px-6 py-2 bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleSubmitAutomation}
                  disabled={creatingAutomation}
                  className="px-6 py-2 bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {creatingAutomation ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      Activate Automation
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-6xl">✅</span>
              </div>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-3">
                Automation Activated!
              </h2>
              <p className="text-lg text-[#919191] mb-6">
                Your comment automation is now active and will start replying to
                comments automatically
              </p>

              {/* Success Details */}
              <div className="bg-gradient-to-r from-[#F1F1F1] to-[#D4D4D4] rounded-2xl p-4 mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🤖</span>
                  <p className="text-sm font-semibold text-[#2B2B2B]">
                    What happens next?
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-[#2B2B2B] ml-8">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>
                      The system will monitor new comments on your post
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Automated replies will be posted instantly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>
                      You can manage or disable this automation anytime
                    </span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={closeSuccessModal}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentAutomationPage;
