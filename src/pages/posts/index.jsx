import { getCurrentUser, signOut } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  manageUserApi,
  postCommentOnInstagramAccountApi,
} from "../../services/handleApi";
import {
  getAllIgMedia,
  getIgMediaComments,
  getIgMediaInsights,
} from "../../services/igApis";
import {
  CommentIcon,
  ContentIcon,
  DashboardIcon,
  PostsIcon,
} from "../../assets/icons";

const PostsPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedAnalyticsPost, setSelectedAnalyticsPost] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [showLeaveCommentModal, setShowLeaveCommentModal] = useState(false);
  const [selectedCommentPost, setSelectedCommentPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  console.log("[posts]", posts);

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
        if (userRes.items?.[0]?.instagramDetails?.instagramRefreshToken) {
          fetchPosts(
            userRes.items?.[0]?.instagramDetails?.instagramRefreshToken
          );
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoading(false);
    }
  };

  const fetchPosts = async (token) => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const postsRes = await getAllIgMedia(token);
      if (postsRes) {
        setPosts(postsRes || []);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewComments = async (post) => {
    setSelectedPost(post);
    setShowCommentsModal(true);
    setLoadingComments(true);
    setComments([]);

    try {
      const commentsData = await getIgMediaComments(
        post.id,
        user?.instagramDetails?.instagramRefreshToken
      );
      setComments(commentsData || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const closeCommentsModal = () => {
    setShowCommentsModal(false);
    setSelectedPost(null);
    setComments([]);
  };

  const handleViewAnalytics = async (post) => {
    setSelectedAnalyticsPost(post);
    setShowAnalyticsModal(true);
    setLoadingAnalytics(true);
    setAnalytics([]);

    try {
      const analyticsData = await getIgMediaInsights(
        post.id,
        user?.instagramDetails?.instagramRefreshToken
      );
      setAnalytics(analyticsData || []);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const closeAnalyticsModal = () => {
    setShowAnalyticsModal(false);
    setSelectedAnalyticsPost(null);
    setAnalytics([]);
  };

  const handleLeaveComment = (post) => {
    setSelectedCommentPost(post);
    setShowLeaveCommentModal(true);
    setCommentText("");
    setCommentSuccess(false);
  };
  const closeLeaveCommentModal = () => {
    setShowLeaveCommentModal(false);
    setSelectedCommentPost(null);
    setCommentText("");
    setCommentSuccess(false);
  };
  const handlePostComment = async () => {
    if (!commentText.trim()) {
      alert("Please enter a comment");
      return;
    }
    setPostingComment(true);
    try {
      const result = await postCommentOnInstagramAccountApi({
        userId: user?.id,
        mediaId: selectedCommentPost.id,
        comment: commentText,
      });
      if (result.success) {
        setCommentSuccess(true);
        setCommentText("");
      } else {
        throw new Error(result.message || "Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert(`Error posting comment: ${error.message}`);
    } finally {
      setPostingComment(false);
    }
  };

  const menuItems = [
    { id: "dashboard", icon: <DashboardIcon />, label: "Dashboard" },
    { id: "posts", icon: <PostsIcon />, label: "Posts" },
    { id: "content-posting", icon: <ContentIcon />, label: "Content Posting" },
    {
      id: "comment-automation",
      icon: <CommentIcon />,
      label: "Comment Automation",
    },
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

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMediaIcon = (type, productType) => {
    if (productType === "REELS") return "🎬";
    if (type === "VIDEO") return "🎥";
    if (type === "CAROUSEL_ALBUM") return "📷";
    return "📸";
  };

  const INSTAGRAM_AUTH_URL =
    "https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=1505725710571824&redirect_uri=https://social.briggo.in/dashboard&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights";

  // Render comment with replies
  const renderComment = (comment, isReply = false) => (
    <div
      key={comment.id}
      className={`${
        isReply ? "ml-12 border-l-2 border-[#D4D4D4] pl-4" : ""
      } mb-4`}
    >
      <div className="bg-[#F1F1F1] rounded-xl p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2B2B2B] to-[#919191] rounded-full flex items-center justify-center text-white font-bold text-sm">
              {comment.username?.[0]?.toUpperCase() ||
                comment.from?.username?.[0]?.toUpperCase() ||
                "U"}
            </div>
            <div>
              <p className="font-semibold text-[#2B2B2B] text-sm">
                @{comment.username || comment.from?.username}
              </p>
              <p className="text-xs text-[#919191]">
                {formatDateTime(comment.timestamp)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {comment.hidden && (
              <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full font-semibold">
                Hidden
              </span>
            )}
            {comment.like_count > 0 && (
              <span className="text-xs px-2 py-1 bg-pink-100 text-pink-600 rounded-full font-semibold flex items-center gap-1">
                ❤️ {comment.like_count}
              </span>
            )}
          </div>
        </div>
        <p className="text-[#2B2B2B] text-sm whitespace-pre-wrap">
          {comment.text}
        </p>
      </div>

      {/* Render replies if they exist */}
      {comment.replies?.data && comment.replies.data.length > 0 && (
        <div className="mt-2">
          {comment.replies.data.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

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
              <h1 className="text-3xl font-bold text-[#2B2B2B]">Posts</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-[#2B2B2B] text-white hover:bg-[#919191] transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Posts Content */}
        <div className="p-8">
          {loading ? (
            // Skeleton Loader
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg border border-[#D4D4D4] overflow-hidden animate-pulse"
                >
                  <div className="w-full h-64 bg-[#D4D4D4]"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-[#D4D4D4] rounded w-3/4"></div>
                    <div className="h-4 bg-[#D4D4D4] rounded w-1/2"></div>
                    <div className="h-10 bg-[#D4D4D4] rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : !user?.instagramDetails?.instagramRefreshToken ? (
            // Connect Instagram CTA
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="bg-white rounded-3xl shadow-2xl border border-[#D4D4D4] p-12 max-w-2xl w-full text-center">
                <div className="mb-8">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#2B2B2B] to-[#919191] rounded-full flex items-center justify-center">
                    <span className="text-6xl">📸</span>
                  </div>
                  <h2 className="text-4xl font-bold text-[#2B2B2B] mb-4">
                    Connect Your Instagram
                  </h2>
                  <p className="text-xl text-[#919191] mb-8">
                    Link your Instagram account to view and manage your posts
                  </p>
                </div>

                <a
                  href={INSTAGRAM_AUTH_URL}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <span className="text-2xl">📸</span>
                  Connect Instagram Account
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
                </a>
              </div>
            </div>
          ) : posts.length === 0 ? (
            // No Posts Found
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#2B2B2B] to-[#919191] rounded-full flex items-center justify-center">
                  <span className="text-6xl">📭</span>
                </div>
                <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4">
                  No Posts Found
                </h2>
                <p className="text-xl text-[#919191]">
                  You haven't posted anything yet on Instagram
                </p>
              </div>
            </div>
          ) : (
            // Posts Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-lg border border-[#D4D4D4] overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  {/* Thumbnail */}
                  <div className="relative">
                    <img
                      src={post.thumbnail_url || post.media_url}
                      alt={post.caption || "Instagram post"}
                      className="w-full h-64 object-cover"
                    />
                    {/* Media Type Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 bg-[#2B2B2B]/80 backdrop-blur-sm text-white rounded-full text-sm font-semibold flex items-center gap-2">
                      <span>
                        {getMediaIcon(post.media_type, post.media_product_type)}
                      </span>
                      {post.media_product_type || post.media_type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Caption */}
                    {post.caption && (
                      <p className="text-[#2B2B2B] text-sm line-clamp-2">
                        Caption: {post.caption}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="flex flex-col gap-1 text-xs text-[#919191]">
                      <span>Media ID: {post.id}</span>
                      <span>Media Type: {post.media_type}</span>
                      <span>Media Product Type: {post.media_product_type}</span>
                      <span>TimeStamp: {formatDate(post.timestamp)}</span>
                    </div>

                    {/* Action Buttons Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Leave Comment Button */}
                      <button
                        onClick={() => handleLeaveComment(post)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#F1F1F1] hover:bg-gradient-to-r hover:from-[#2B2B2B] hover:to-[#919191] hover:text-white text-[#2B2B2B] rounded-lg font-medium transition-all duration-300 text-sm group"
                      >
                        <span className="text-base">💬</span>
                        <span>Leave Comment</span>
                      </button>

                      {/* Analytics Button */}
                      <button
                        onClick={() => handleViewAnalytics(post)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#F1F1F1] hover:bg-gradient-to-r hover:from-[#2B2B2B] hover:to-[#919191] hover:text-white text-[#2B2B2B] rounded-lg font-medium transition-all duration-300 text-sm group"
                      >
                        <span className="text-base">📊</span>
                        <span>Analytics</span>
                      </button>

                      {/* Check Comments Button */}
                      <button
                        onClick={() => handleViewComments(post)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#F1F1F1] hover:bg-gradient-to-r hover:from-[#2B2B2B] hover:to-[#919191] hover:text-white text-[#2B2B2B] rounded-lg font-medium transition-all duration-300 text-sm group"
                      >
                        <span className="text-base">👁️</span>
                        <span>See all Comments</span>
                      </button>

                      {/* View on Instagram Button */}
                      <a
                        href={`https://www.instagram.com/p/${post.shortcode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-sm"
                      >
                        <span className="text-base">🔗</span>
                        <span>View Post</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Comments Modal */}
      {showCommentsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <h2 className="text-xl font-bold">Post Comments</h2>
                  <p className="text-sm opacity-90">
                    {selectedPost?.caption
                      ? selectedPost.caption.substring(0, 50) +
                        (selectedPost.caption.length > 50 ? "..." : "")
                      : "View all comments"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCommentsModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
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

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingComments ? (
                // Loading State
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-[#F1F1F1] rounded-xl p-4 animate-pulse"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-[#D4D4D4] rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-[#D4D4D4] rounded w-32 mb-1"></div>
                          <div className="h-3 bg-[#D4D4D4] rounded w-24"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-[#D4D4D4] rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : comments.length === 0 ? (
                // No Comments State
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#2B2B2B] to-[#919191] rounded-full flex items-center justify-center mb-4">
                    <span className="text-5xl">💭</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#2B2B2B] mb-2">
                    No Comments Yet
                  </h3>
                  <p className="text-[#919191]">
                    Be the first to comment on this post!
                  </p>
                </div>
              ) : (
                // Comments List
                <div className="space-y-4">
                  <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <p className="text-sm font-semibold text-[#2B2B2B]">
                      📊 Total Comments: {comments.length}
                    </p>
                  </div>
                  {comments.map((comment) => renderComment(comment))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#D4D4D4] px-6 py-4 bg-[#F1F1F1]">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#919191]">
                  {comments.length > 0
                    ? `Showing ${comments.length} comment${
                        comments.length !== 1 ? "s" : ""
                      }`
                    : "No comments to display"}
                </p>
                <button
                  onClick={closeCommentsModal}
                  className="px-6 py-2 bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h2 className="text-xl font-bold">Post Analytics</h2>
                  <p className="text-sm opacity-90">
                    {selectedAnalyticsPost?.caption
                      ? selectedAnalyticsPost.caption.substring(0, 50) +
                        (selectedAnalyticsPost.caption.length > 50 ? "..." : "")
                      : "View post insights"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeAnalyticsModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
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

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingAnalytics ? (
                // Loading State
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="bg-[#F1F1F1] rounded-2xl p-5 animate-pulse"
                    >
                      <div className="w-10 h-10 bg-[#D4D4D4] rounded-lg mb-3"></div>
                      <div className="h-3 bg-[#D4D4D4] rounded w-20 mb-2"></div>
                      <div className="h-8 bg-[#D4D4D4] rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : analytics.length === 0 ? (
                // No Analytics State
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-5xl">📈</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#2B2B2B] mb-2">
                    No Analytics Available
                  </h3>
                  <p className="text-[#919191]">
                    Analytics data is not available for this post yet.
                  </p>
                </div>
              ) : (
                // Analytics Grid
                <div className="space-y-6">
                  {/* Post Preview */}
                  <div className="bg-gradient-to-r from-[#2B2B2B] to-[#919191] rounded-2xl p-4 border border-[#D4D4D4]">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          selectedAnalyticsPost?.thumbnail_url ||
                          selectedAnalyticsPost?.media_url
                        }
                        alt="Post"
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#F1F1F1] mb-1">
                          {selectedAnalyticsPost?.caption}
                        </p>
                        <p className="text-sm font-semibold text-[#F1F1F1] mb-1">
                          {selectedAnalyticsPost?.media_product_type ||
                            selectedAnalyticsPost?.media_type}
                        </p>
                        <p className="text-xs text-[#919191]">
                          Posted on{" "}
                          {formatDate(selectedAnalyticsPost?.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {analytics.map((metric) => {
                      const metricConfig = {
                        comments: {
                          icon: "💬",
                          label: "Comments",
                          color: "from-green-500 to-emerald-500",
                        },
                        likes: {
                          icon: "❤️",
                          label: "Likes",
                          color: "from-red-500 to-pink-500",
                        },
                        reach: {
                          icon: "📡",
                          label: "Reach",
                          color: "from-purple-500 to-indigo-500",
                        },
                        saved: {
                          icon: "🔖",
                          label: "Saves",
                          color: "from-yellow-500 to-orange-500",
                        },
                        shares: {
                          icon: "🔄",
                          label: "Shares",
                          color: "from-blue-500 to-cyan-500",
                        },
                        views: {
                          icon: "👁️",
                          label: "Views",
                          color: "from-indigo-500 to-purple-500",
                        },
                      };

                      const config =
                        metricConfig[metric.name] || metricConfig.views;

                      return (
                        <div
                          key={metric.name}
                          className="bg-[#F1F1F1] rounded-2xl p-5 hover:shadow-lg transition-all duration-300 border border-[#D4D4D4]"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div
                              className={`w-10 h-10 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center text-xl shadow-md`}
                            >
                              {config.icon}
                            </div>
                          </div>
                          <p className="text-[#919191] text-xs mb-1 font-medium uppercase">
                            {config.label}
                          </p>
                          <p className="text-3xl font-bold text-[#2B2B2B]">
                            {metric.values?.[0]?.value?.toLocaleString() || 0}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total Engagement */}
                  <div className="bg-gradient-to-r from-[#2B2B2B] to-[#919191] rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90 mb-1">
                          Total Engagement
                        </p>
                        <p className="text-4xl font-bold">
                          {analytics
                            .reduce(
                              (sum, metric) =>
                                sum + (metric.values?.[0]?.value || 0),
                              0
                            )
                            .toLocaleString()}
                        </p>
                      </div>
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <span className="text-3xl">⚡</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#D4D4D4] px-6 py-4 bg-[#F1F1F1]">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#919191]">
                  {analytics.length > 0
                    ? `Showing ${analytics.length} metric${
                        analytics.length !== 1 ? "s" : ""
                      }`
                    : "No analytics to display"}
                </p>
                <button
                  onClick={closeAnalyticsModal}
                  className="px-6 py-2 bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Leave Comment Modal */}
      {showLeaveCommentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col">
            {!commentSuccess ? (
              <>
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💬</span>
                    <div>
                      <h2 className="text-xl font-bold">Leave a Comment</h2>
                      <p className="text-sm opacity-90">
                        {selectedCommentPost?.caption
                          ? selectedCommentPost.caption.substring(0, 40) +
                            (selectedCommentPost.caption.length > 40
                              ? "..."
                              : "")
                          : "Post a comment on this post"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeLeaveCommentModal}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                    disabled={postingComment}
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
                {/* Modal Content */}
                <div className="p-6 space-y-4">
                  {/* Post Preview */}
                  <div className="bg-gradient-to-r from-[#F1F1F1] to-[#D4D4D4] rounded-2xl p-4 border border-[#D4D4D4]">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          selectedCommentPost?.thumbnail_url ||
                          selectedCommentPost?.media_url
                        }
                        alt="Post"
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#2B2B2B] mb-1">
                          {selectedCommentPost?.media_product_type ||
                            selectedCommentPost?.media_type}
                        </p>
                        <p className="text-xs text-[#919191]">
                          Posted on {formatDate(selectedCommentPost?.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Comment Input */}
                  <div>
                    <label className="block text-sm font-semibold text-[#2B2B2B] mb-2">
                      Your Comment
                    </label>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write your comment here..."
                      className="w-full px-4 py-3 border-2 border-[#D4D4D4] rounded-xl focus:border-[#2B2B2B] focus:outline-none resize-none transition-colors"
                      rows={5}
                      disabled={postingComment}
                    />
                    <p className="text-xs text-[#919191] mt-2">
                      {commentText.length} characters
                    </p>
                  </div>
                </div>
                {/* Modal Footer */}
                <div className="border-t border-[#D4D4D4] px-6 py-4 bg-[#F1F1F1] flex items-center justify-between">
                  <button
                    onClick={closeLeaveCommentModal}
                    className="px-6 py-2 bg-white border-2 border-[#D4D4D4] text-[#2B2B2B] rounded-xl font-medium hover:bg-[#F1F1F1] transition-all duration-300"
                    disabled={postingComment}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePostComment}
                    disabled={postingComment || !commentText.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {postingComment ? (
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
                        Posting...
                      </>
                    ) : (
                      <>
                        <span>Post Comment</span>
                        <span>✨</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              // Success State
              <>
                <div className="p-8 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#2B2B2B] to-[#919191] rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-6xl">✅</span>
                  </div>
                  <h2 className="text-3xl font-bold text-[#2B2B2B] mb-3">
                    Comment Posted Successfully!
                  </h2>
                  <p className="text-lg text-[#919191] mb-6">
                    Your comment has been posted to Instagram
                  </p>
                  {/* Success Details */}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={`https://www.instagram.com/p/${selectedCommentPost?.shortcode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      <span className="text-xl">📸</span>
                      View on Instagram
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
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                    <button
                      onClick={closeLeaveCommentModal}
                      className="px-6 py-3 bg-white border-2 border-[#D4D4D4] text-[#2B2B2B] rounded-xl font-semibold hover:bg-[#F1F1F1] transition-all duration-300"
                    >
                      Close
                    </button>
                  </div>
                  <p className="text-xs text-[#919191] mt-6">
                    It may take a few moments for your comment to appear on
                    Instagram
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsPage;
