import { getCurrentUser, signOut } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  linkInstagramAccountApi,
  manageUserApi,
  sendWhatsappMessageApi,
} from "../../services/handleApi";
import { getMediaUrl } from "../../utils/helper";
import {
  getIgAccountInfo,
  getIgAccountMetricData,
} from "../../services/igApis";
import { ContentIcon, DashboardIcon, PostsIcon } from "../../assets/icons";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [igAccountInfo, setIgAccountInfo] = useState(null);
  const [igAccountMetricData, setIgAccountMetricData] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (code && user?.id) {
      connectIg();
    }
  }, [code, user]);

  const connectIg = async () => {
    if (!user?.id) {
      return;
    }
    setLoading(true);
    try {
      const linkRes = await linkInstagramAccountApi({
        userId: user?.id,
        authCode: code,
      });
      console.log("linkRes", linkRes);
      if (linkRes.success) {
        fetchUser();
      }
    } catch (error) {
      console.error("Error connecting Instagram:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      // await sendWhatsappMessageApi({ userId: user?.id });
      const currentUser = await getCurrentUser();
      console.log("currentUser", currentUser);
      const userRes = await manageUserApi("GET", {
        id: `${currentUser.username}::${currentUser.username}`,
      });
      if (userRes.success) {
        setUser(userRes.items?.[0]);

        if (userRes.items?.[0]?.instagramDetails?.instagramRefreshToken) {
          const igAccountInfo = await getIgAccountInfo(
            userRes.items?.[0]?.instagramDetails?.instagramRefreshToken
          );
          console.log("first", igAccountInfo);
          const igAccountMetricData = await getIgAccountMetricData(
            igAccountInfo.id,
            userRes.items?.[0]?.instagramDetails?.instagramRefreshToken
          );
          setIgAccountInfo(igAccountInfo);
          setIgAccountMetricData(igAccountMetricData);
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: "dashboard", icon: <DashboardIcon />, label: "Dashboard" },
    { id: "posts", icon: <PostsIcon />, label: "Posts" },
    { id: "content-posting", icon: <ContentIcon />, label: "Content Posting" },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const INSTAGRAM_AUTH_URL =
    "https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=1505725710571824&redirect_uri=https://social.briggo.in/dashboard&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights";

  console.log("igAccountInfo", igAccountInfo);
  console.log("igAccountMetricData", igAccountMetricData);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F1F1] to-[#D4D4D4] flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-[#D4D4D4] transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#D4D4D4]">
          <img src="/briggoLogo.svg" alt="" className="h-12 w-28" />
        </div>

        {/* Menu Items */}
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

        {/* Toggle Button */}
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
              <h1 className="text-3xl font-bold text-[#2B2B2B]">Dashboard</h1>
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

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {loading ? (
            // Skeleton Loader
            <>
              <div className="bg-white rounded-3xl shadow-lg border border-[#D4D4D4] p-8 animate-pulse">
                <div className="h-6 w-48 bg-[#D4D4D4] rounded mb-6"></div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="w-32 h-32 rounded-full bg-[#D4D4D4]"></div>
                  <div className="flex-1 space-y-4 w-full">
                    <div className="h-8 w-64 bg-[#D4D4D4] rounded"></div>
                    <div className="h-6 w-48 bg-[#D4D4D4] rounded"></div>
                    <div className="flex gap-4">
                      <div className="h-16 w-32 bg-[#D4D4D4] rounded-xl"></div>
                      <div className="h-16 w-32 bg-[#D4D4D4] rounded-xl"></div>
                      <div className="h-16 w-32 bg-[#D4D4D4] rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-lg border border-[#D4D4D4] p-8 animate-pulse">
                <div className="h-6 w-48 bg-[#D4D4D4] rounded mb-6"></div>
                <div className="h-64 bg-[#D4D4D4] rounded-2xl"></div>
              </div>
            </>
          ) : !user?.instagramDetails ? (
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
                    Link your Instagram account to start automating your growth
                    and managing your content
                  </p>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4 text-left p-4 bg-[#F1F1F1] rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#2B2B2B] to-[#919191] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">⚡</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2B2B2B] mb-1">
                        Automate Engagement
                      </h3>
                      <p className="text-sm text-[#919191]">
                        Auto-reply to comments, DMs, and stories
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 text-left p-4 bg-[#F1F1F1] rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#919191] to-[#D4D4D4] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">📊</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2B2B2B] mb-1">
                        Track Analytics
                      </h3>
                      <p className="text-sm text-[#919191]">
                        Monitor your growth and engagement metrics
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 text-left p-4 bg-[#F1F1F1] rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#2B2B2B] via-[#919191] to-[#2B2B2B] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🚀</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2B2B2B] mb-1">
                        Save Time
                      </h3>
                      <p className="text-sm text-[#919191]">
                        Focus on content while we handle automation
                      </p>
                    </div>
                  </div>
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

                <p className="text-sm text-[#919191] mt-6">
                  Safe & Secure • We'll never post without your permission
                </p>
              </div>
            </div>
          ) : (
            // Connected Instagram - Show Dashboard
            <>
              {/* Profile Overview Card */}
              <div className="bg-white rounded-3xl shadow-lg border border-[#D4D4D4] p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#2B2B2B]">
                    Instagram Profile
                  </h2>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-semibold">
                    <span>✓</span> Connected
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <img
                    src={
                      user?.instagramDetails?.profilePictureUrl
                        ? getMediaUrl(user?.instagramDetails?.profilePictureUrl)
                        : "https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                    }
                    alt={user?.instagramDetails?.name || "User"}
                    className="w-32 h-32 rounded-full border-4 border-[#D4D4D4] shadow-lg object-cover"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-[#2B2B2B]">
                      {user?.instagramDetails?.name || "Instagram User"}
                    </h3>
                    <p className="text-[#919191] text-lg mb-3">
                      @{user?.instagramDetails?.username}
                    </p>
                    {user?.instagramDetails?.biography && (
                      <p className="text-[#919191] mb-4">
                        {user?.instagramDetails?.biography}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <div className="px-4 py-2 bg-[#F1F1F1] rounded-xl">
                        <span className="text-[#2B2B2B] font-bold text-lg">
                          {(
                            igAccountInfo?.followers_count || 0
                          ).toLocaleString()}
                        </span>
                        <span className="text-[#919191] ml-2">Followers</span>
                      </div>
                      <div className="px-4 py-2 bg-[#F1F1F1] rounded-xl">
                        <span className="text-[#2B2B2B] font-bold text-lg">
                          {(igAccountInfo?.follows_count || 0).toLocaleString()}
                        </span>
                        <span className="text-[#919191] ml-2">Following</span>
                      </div>
                      <div className="px-4 py-2 bg-[#F1F1F1] rounded-xl">
                        <span className="text-[#2B2B2B] font-bold text-lg">
                          {igAccountInfo?.media_count || 0}
                        </span>
                        <span className="text-[#919191] ml-2">Posts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {igAccountMetricData && (
                <div className="bg-white rounded-3xl shadow-lg border border-[#D4D4D4] p-8">
                  <h2 className="text-2xl font-bold text-[#2B2B2B] mb-6">
                    Engagement Metrics
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                      {
                        label: "Views",
                        value: parseInt(
                          igAccountMetricData.views || 0
                        ).toLocaleString(),
                        icon: "👁️",
                        color: "from-blue-500 to-blue-600",
                      },
                      {
                        label: "Reach",
                        value: parseInt(
                          igAccountMetricData.reach || 0
                        ).toLocaleString(),
                        icon: "📡",
                        color: "from-purple-500 to-purple-600",
                      },
                      {
                        label: "Likes",
                        value: parseInt(
                          igAccountMetricData.likes || 0
                        ).toLocaleString(),
                        icon: "❤️",
                        color: "from-red-500 to-pink-500",
                      },
                      {
                        label: "Comments",
                        value: parseInt(
                          igAccountMetricData.comments || 0
                        ).toLocaleString(),
                        icon: "💬",
                        color: "from-green-500 to-green-600",
                      },
                      {
                        label: "Shares",
                        value: parseInt(
                          igAccountMetricData.shares || 0
                        ).toLocaleString(),
                        icon: "🔄",
                        color: "from-indigo-500 to-indigo-600",
                      },
                      {
                        label: "Saves",
                        value: parseInt(
                          igAccountMetricData.saves || 0
                        ).toLocaleString(),
                        icon: "🔖",
                        color: "from-yellow-500 to-orange-500",
                      },
                      {
                        label: "Accounts Engaged",
                        value: parseInt(
                          igAccountMetricData.accounts_engaged || 0
                        ).toLocaleString(),
                        icon: "👥",
                        color: "from-[#2B2B2B] to-[#919191]",
                      },
                      {
                        label: "Total Interactions",
                        value: parseInt(
                          igAccountMetricData.total_interactions || 0
                        ).toLocaleString(),
                        icon: "⚡",
                        color: "from-cyan-500 to-blue-500",
                      },
                      {
                        label: "Replies",
                        value: parseInt(
                          igAccountMetricData.replies || 0
                        ).toLocaleString(),
                        icon: "💭",
                        color: "from-teal-500 to-teal-600",
                      },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="bg-[#F1F1F1] rounded-2xl p-5 hover:shadow-lg transition-all duration-300 border border-[#D4D4D4]"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-xl shadow-md`}
                          >
                            {stat.icon}
                          </div>
                        </div>
                        <p className="text-[#919191] text-xs mb-1 font-medium">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-[#2B2B2B]">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    label: "Total Followers",
                    value: (
                      user?.instagramDetails?.followersCount || 0
                    ).toLocaleString(),
                    icon: "👥",
                    color: "from-[#2B2B2B] to-[#919191]",
                  },
                  {
                    label: "Total Posts",
                    value: user?.instagramDetails?.mediaCount || 0,
                    icon: "📸",
                    color: "from-[#919191] to-[#D4D4D4]",
                  },
                  {
                    label: "Following",
                    value: (
                      user?.instagramDetails?.followsCount || 0
                    ).toLocaleString(),
                    icon: "➕",
                    color: "from-[#2B2B2B] to-[#D4D4D4]",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg border border-[#D4D4D4] p-6 hover:scale-105 transition-transform duration-300"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg`}
                    >
                      {stat.icon}
                    </div>
                    <p className="text-[#919191] text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-[#2B2B2B]">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div> */}

              {/* Quick Actions */}
              {/* <div className="bg-white rounded-3xl shadow-lg border border-[#D4D4D4] p-8">
                <h2 className="text-2xl font-bold text-[#2B2B2B] mb-6">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      label: "View Posts",
                      icon: "📸",
                      action: () => (window.location.href = "/posts"),
                    },
                    {
                      label: "Manage Comments",
                      icon: "💬",
                      action: () => alert("Coming soon"),
                    },
                    {
                      label: "Send DMs",
                      icon: "📩",
                      action: () => alert("Coming soon"),
                    },
                    {
                      label: "View Analytics",
                      icon: "📊",
                      action: () => alert("Coming soon"),
                    },
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="w-full flex items-center justify-between p-4 bg-[#F1F1F1] hover:bg-gradient-to-r hover:from-[#2B2B2B] hover:to-[#919191] hover:text-white rounded-xl transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{action.icon}</span>
                        <span className="font-medium text-[#2B2B2B] group-hover:text-white">
                          {action.label}
                        </span>
                      </div>
                      <svg
                        className="w-5 h-5 text-[#919191] group-hover:text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Growth Chart Placeholder */}
              <div className="bg-white rounded-3xl shadow-lg border border-[#D4D4D4] p-8">
                <h2 className="text-2xl font-bold text-[#2B2B2B] mb-6">
                  Growth Overview
                </h2>
                <div className="h-64 flex items-center justify-center bg-[#F1F1F1] rounded-2xl">
                  <div className="text-center">
                    <span className="text-6xl mb-4 block">📊</span>
                    <p className="text-[#919191] text-lg">
                      Growth chart coming soon
                    </p>
                    <p className="text-[#919191] text-sm mt-2">
                      Track your follower growth over time
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
