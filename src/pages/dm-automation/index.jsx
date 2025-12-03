import { getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  manageUserApi,
  manageIgDMAutomationApi,
} from "../../services/handleApi";
import {
  CommentIcon,
  ContentIcon,
  DashboardIcon,
  PostsIcon,
} from "../../assets/icons";

const DMAutomationPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dm-automation");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [automations, setAutomations] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [triggerText, setTriggerText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [creatingAutomation, setCreatingAutomation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [automationToDelete, setAutomationToDelete] = useState(null);

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
      const response = await manageIgDMAutomationApi("LIST", {
        userId: userId,
      });
      if (response?.success) {
        setAutomations(response.items || []);
      }
    } catch (error) {
      console.error("Error fetching automations:", error);
    }
  };

  const handleCreateAutomation = () => {
    setShowCreateModal(true);
    setTriggerText("");
    setReplyText("");
  };

  const handleSubmitAutomation = async () => {
    if (!triggerText.trim()) {
      alert("Please enter trigger text");
      return;
    }
    if (!replyText.trim()) {
      alert("Please enter reply text");
      return;
    }

    setCreatingAutomation(true);
    try {
      const automationData = {
        id: `${Date.now()}`,
        userId: user.id,
        igAccountId: user.instagramDetails?.userId || "",
        triggerText: triggerText.trim(),
        replyText: replyText.trim(),
      };

      const response = await manageIgDMAutomationApi("CREATE", automationData);

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

  const handleDeleteClick = (automation) => {
    setAutomationToDelete(automation);
    setShowDeleteModal(true);
  };

  const handleDeleteAutomation = async () => {
    if (!automationToDelete) return;
    setDeletingId(automationToDelete.id);
    try {
      const response = await manageIgDMAutomationApi("DELETE", {
        id: automationToDelete.id,
      });
      if (response?.success) {
        setAutomations(
          automations.filter((a) => a.id !== automationToDelete.id)
        );
        setShowDeleteModal(false);
        setAutomationToDelete(null);
      } else {
        throw new Error(response?.message || "Failed to delete automation");
      }
    } catch (error) {
      console.error("Error deleting automation:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setAutomationToDelete(null);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setTriggerText("");
    setReplyText("");
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const menuItems = [
    { id: "dashboard", icon: <DashboardIcon />, label: "Dashboard" },
    { id: "posts", icon: <PostsIcon />, label: "Posts" },
    { id: "content-posting", icon: <ContentIcon />, label: "Content Posting" },
    {
      id: "content-scheduling",
      icon: <ContentIcon />,
      label: "Content Scheduling",
    },
    {
      id: "comment-automation",
      icon: <CommentIcon />,
      label: "Comment Automation",
    },
    {
      id: "dm-automation",
      icon: <CommentIcon />,
      label: "DM Automation",
    },
    {
      id: "inbox",
      icon: <CommentIcon />,
      label: "Inbox",
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
                DM Automation
              </h1>
              {/* <p className="text-[#919191] mt-1">
                Automate your Instagram direct message replies
              </p> */}
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
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-[#D4D4D4] rounded w-3/4"></div>
                    <div className="h-4 bg-[#D4D4D4] rounded w-full"></div>
                    <div className="h-4 bg-[#D4D4D4] rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : automations.length === 0 ? (
            // No Automations State
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#2B2B2B] to-[#919191] rounded-full flex items-center justify-center">
                  <span className="text-6xl">💬</span>
                </div>
                <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4">
                  No DM Automations Yet
                </h2>
                <p className="text-xl text-[#919191] mb-8">
                  Create your first DM automation to respond instantly
                </p>
                <button
                  onClick={handleCreateAutomation}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <span className="text-2xl">➕</span>
                  Create Your First DM Automation
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
                    className="bg-white rounded-2xl shadow-lg relative group border border-[#D4D4D4] overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    <button
                      onClick={() => handleDeleteClick(automation)}
                      disabled={deletingId === automation.id}
                      className="absolute top-3 right-3 z-10 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      title="Delete automation"
                    >
                      {deletingId === automation.id ? (
                        <svg
                          className="animate-spin h-4 w-4"
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
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                    <div className="p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#2B2B2B] to-[#919191] rounded-full flex items-center justify-center">
                          <span className="text-2xl">💬</span>
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                          Active
                        </div>
                      </div>

                      {/* Trigger Text */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                        <p className="text-xs text-[#919191] mb-1 font-semibold uppercase">
                          Trigger Text
                        </p>
                        <p className="text-sm text-[#2B2B2B] font-medium">
                          "{automation.triggerText}"
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center">
                        <svg
                          className="w-6 h-6 text-[#919191]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </div>

                      {/* Reply Text */}
                      <div className="bg-[#F1F1F1] rounded-xl p-4">
                        <p className="text-xs text-[#919191] mb-1 font-semibold uppercase">
                          Auto Reply
                        </p>
                        <p className="text-sm text-[#2B2B2B] line-clamp-3">
                          {automation.replyText}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="pt-2 border-t border-[#D4D4D4]">
                        <p className="text-xs text-[#919191]">
                          When someone DMs the trigger text, they'll receive
                          this automated reply
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
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <h2 className="text-xl font-bold">Create DM Automation</h2>
                  <p className="text-sm opacity-90">
                    Set up automatic replies for Instagram DMs
                  </p>
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

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* How it works */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h3 className="font-bold text-[#2B2B2B] mb-1">
                        How it works
                      </h3>
                      <p className="text-sm text-[#919191]">
                        When someone sends a DM containing the trigger text,
                        they'll automatically receive your reply message. This
                        helps you respond instantly to common inquiries.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trigger Text Input */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm font-bold text-[#2B2B2B] mb-2 block">
                      Trigger Text
                    </span>
                    <span className="text-xs text-[#919191] block mb-3">
                      What word or phrase should activate this automation?
                    </span>
                    <input
                      type="text"
                      value={triggerText}
                      onChange={(e) => setTriggerText(e.target.value)}
                      placeholder="e.g., price, info, availability"
                      className="w-full px-4 py-3 border-2 border-[#D4D4D4] rounded-xl focus:border-[#2B2B2B] focus:outline-none transition-colors text-[#2B2B2B]"
                    />
                  </label>

                  {triggerText && (
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                      <p className="text-xs text-blue-600 font-semibold mb-1">
                        Preview trigger:
                      </p>
                      <p className="text-sm text-[#2B2B2B]">
                        When DM contains: "
                        <span className="font-bold">{triggerText}</span>"
                      </p>
                    </div>
                  )}
                </div>

                {/* Reply Text Input */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm font-bold text-[#2B2B2B] mb-2 block">
                      Reply Text
                    </span>
                    <span className="text-xs text-[#919191] block mb-3">
                      What message should be sent automatically?
                    </span>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your automated reply here..."
                      className="w-full px-4 py-3 border-2 border-[#D4D4D4] rounded-xl focus:border-[#2B2B2B] focus:outline-none resize-none transition-colors text-[#2B2B2B]"
                      rows={6}
                    />
                    <span className="text-xs text-[#919191] mt-2 block">
                      {replyText.length} characters
                    </span>
                  </label>

                  {replyText && (
                    <div className="bg-[#F1F1F1] rounded-xl p-4 border border-[#D4D4D4]">
                      <p className="text-xs text-[#919191] font-semibold mb-2">
                        Preview reply:
                      </p>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-sm text-[#2B2B2B] whitespace-pre-wrap">
                          {replyText}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Example */}
                <div className="bg-gradient-to-r from-[#F1F1F1] to-[#D4D4D4] rounded-2xl p-5">
                  <p className="text-sm font-bold text-[#2B2B2B] mb-3">
                    Example Workflow:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">👤</span>
                      <div className="flex-1">
                        <p className="text-xs text-[#919191] mb-1">
                          Customer sends:
                        </p>
                        <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                          <p className="text-sm text-[#2B2B2B]">
                            "Hey! What's the price?"
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <svg
                        className="w-5 h-5 text-[#919191]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-lg">🤖</span>
                      <div className="flex-1">
                        <p className="text-xs text-[#919191] mb-1">
                          Auto-reply sent:
                        </p>
                        <div className="bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white rounded-lg px-3 py-2 shadow-sm">
                          <p className="text-sm">
                            "Thanks for asking! Our prices start at ₹5000. Visit
                            our website for details!"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

              <button
                onClick={handleSubmitAutomation}
                disabled={
                  creatingAutomation || !triggerText.trim() || !replyText.trim()
                }
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
                DM Automation Activated!
              </h2>
              <p className="text-lg text-[#919191] mb-6">
                Your DM automation is now active and will start replying to
                messages automatically
              </p>

              {/* Success Details */}
              <div className="bg-gradient-to-r from-[#F1F1F1] to-[#D4D4D4] rounded-2xl p-4 mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💬</span>
                  <p className="text-sm font-semibold text-[#2B2B2B]">
                    What happens next?
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-[#2B2B2B] ml-8">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>
                      The system will monitor incoming DMs for your trigger text
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Matching messages will receive instant replies</span>
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
      {showDeleteModal && automationToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-5xl">🗑️</span>
              </div>
              <h2 className="text-2xl font-bold text-[#2B2B2B] mb-3">
                Delete Automation?
              </h2>
              <p className="text-[#919191] mb-6">
                Are you sure you want to delete this automation? This action
                cannot be undone.
              </p>
              {/* Automation Preview */}
              <div className="bg-[#F1F1F1] rounded-2xl p-4 mb-6 text-left">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-[#919191] font-semibold mb-1">
                      Trigger:
                    </p>
                    <p className="text-sm text-[#2B2B2B] font-medium">
                      "{automationToDelete.triggerText}"
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#919191] font-semibold mb-1">
                      Reply:
                    </p>
                    <p className="text-sm text-[#2B2B2B] line-clamp-2">
                      {automationToDelete.replyText}
                    </p>
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={deletingId === automationToDelete.id}
                  className="flex-1 px-6 py-3 bg-white border-2 border-[#D4D4D4] text-[#2B2B2B] rounded-xl font-semibold hover:bg-[#F1F1F1] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAutomation}
                  disabled={deletingId === automationToDelete.id}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deletingId === automationToDelete.id ? (
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
                      Deleting...
                    </>
                  ) : (
                    <>
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DMAutomationPage;
