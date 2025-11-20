import { getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { manageUserApi } from "../../services/handleApi";
import {
  CommentIcon,
  ContentIcon,
  DashboardIcon,
  PostsIcon,
} from "../../assets/icons";

const InstagramMessagesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("messages");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(false);

  const mockMessages = {
    conv_1: [
      {
        id: "msg_1",
        text: "Hi! I'm interested in your product",
        senderId: "user_1",
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      },
      {
        id: "msg_2",
        text: "Hello! Thanks for reaching out. Which product are you interested in?",
        senderId: "me",
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      },
      {
        id: "msg_3",
        text: "The blue one from your latest post",
        senderId: "user_1",
        timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
      },
      {
        id: "msg_4",
        text: "Great choice! That one is $50 and available for immediate shipping.",
        senderId: "me",
        timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
      },
      {
        id: "msg_5",
        text: "Thanks for the quick response!",
        senderId: "user_1",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
    ],
    conv_2: [
      {
        id: "msg_6",
        text: "What are your prices?",
        senderId: "user_2",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
    ],
    conv_3: [
      {
        id: "msg_7",
        text: "Do you have this in stock?",
        senderId: "user_3",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      },
      {
        id: "msg_8",
        text: "Yes! We have 5 units available right now.",
        senderId: "me",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(),
      },
      {
        id: "msg_9",
        text: "Perfect! I'll take it",
        senderId: "user_3",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
    ],
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      const userRes = await manageUserApi("GET", {
        id: `${currentUser.username}::${currentUser.username}`,
      });
      if (userRes.success) {
        setUser(userRes.items?.[0]);
        // Load conversations
        // setConversations(mockConversations);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    if (!user?.instagramDetails?.instagramRefreshToken) {
      console.error("No Instagram access token found");
      return;
    }
    setLoadingConversations(true);
    try {
      const accessToken = user.instagramDetails.instagramRefreshToken;
      const url = `https://graph.instagram.com/me/conversations?fields=id,participants&access_token=${accessToken}`;

      const response = await fetch(url);
      const data = await response.json();
      if (data.error) {
        console.error("Error fetching conversations:", data.error);
        return;
      }
      console.log("Conversations data:", data);
      // Transform API data to match our UI structure
      const transformedConversations = (data.data || []).map((conv) => {
        const participant = conv.participants?.data?.[1];
        return {
          id: conv.id,
          userId: participant?.id || "",
          username: participant?.username || "Unknown User",
          //   profilePic:
          //     participant?.profile_pic || "https://i.pravatar.cc/150?img=1",
          //   lastMessage: "No messages yet",
          //   timestamp: new Date().toISOString(),
          //   unread: false,
        };
      });
      setConversations(transformedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages[conversation.id] || []);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      text: messageText.trim(),
      senderId: "me",
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else if (diffInHours < 168) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menuItems = [
    { id: "dashboard", icon: <DashboardIcon />, label: "Dashboard" },
    { id: "posts", icon: <PostsIcon />, label: "Posts" },
    { id: "content-posting", icon: <ContentIcon />, label: "Content Posting" },
    {
      id: "comment-automation",
      icon: <CommentIcon />,
      label: "Comment Automation",
    },
    {
      id: "inbox",
      icon: <CommentIcon />,
      label: "Inbox",
    },
  ];

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

      {/* Main Content - Instagram Messages Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-96 bg-white border-r border-[#D4D4D4] flex flex-col">
          {/* Header */}
          <div className="px-6 py-6 border-b border-[#D4D4D4]">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-[#2B2B2B]">
                {user?.instagramDetails?.instagramUsername || "Messages"}
              </h1>
              {/* <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F1F1F1] transition-colors">
                <svg
                  className="w-6 h-6 text-[#2B2B2B]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button> */}
            </div>

            {/* Search */}
            {/* <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages"
                className="w-full pl-10 pr-4 py-2 bg-[#F1F1F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B2B2B] text-sm"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-[#919191]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div> */}
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 animate-pulse"
                  >
                    <div className="w-14 h-14 bg-[#D4D4D4] rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-[#D4D4D4] rounded w-3/4"></div>
                      <div className="h-3 bg-[#D4D4D4] rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex items-center justify-center h-full px-6 text-center">
                <div>
                  <p className="text-[#919191] text-sm">
                    No conversations found
                  </p>
                </div>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-[#F1F1F1] transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? "bg-[#F1F1F1]"
                      : ""
                  }`}
                >
                  <div className="relative">
                    <img
                      src="https://i.pravatar.cc/150?img=1"
                      alt={conversation.username}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    {/* {conversation.unread && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                    )} */}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p
                        className={`text-sm ${
                          conversation.unread ? "font-bold" : "font-medium"
                        } text-[#2B2B2B] truncate`}
                      >
                        {conversation.username}
                      </p>
                      {/* <span className="text-xs text-[#919191] ml-2 flex-shrink-0">
                        {formatTime(conversation.timestamp)}
                      </span> */}
                    </div>
                    <p
                      className={`text-sm ${
                        conversation.unread
                          ? "font-semibold text-[#2B2B2B]"
                          : "text-[#919191]"
                      } truncate`}
                    >
                      {conversation.lastMessage}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 flex flex-col bg-white">
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#F1F1F1] to-[#D4D4D4] rounded-full flex items-center justify-center">
                  <span className="text-6xl">💬</span>
                </div>
                <h2 className="text-2xl font-bold text-[#2B2B2B] mb-2">
                  Your Messages
                </h2>
                <p className="text-[#919191]">
                  Select a conversation to start messaging
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-[#D4D4D4] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedConversation.profilePic}
                    alt={selectedConversation.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-[#2B2B2B]">
                      {selectedConversation.username}
                    </p>
                    <p className="text-xs text-[#919191]">Active now</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F1F1F1] transition-colors">
                    <svg
                      className="w-6 h-6 text-[#2B2B2B]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F1F1F1] transition-colors">
                    <svg
                      className="w-6 h-6 text-[#2B2B2B]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F1F1F1] transition-colors">
                    <svg
                      className="w-6 h-6 text-[#2B2B2B]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === "me"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        message.senderId === "me"
                          ? "bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white"
                          : "bg-[#F1F1F1] text-[#2B2B2B]"
                      } rounded-2xl px-4 py-2`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === "me"
                            ? "text-white/70"
                            : "text-[#919191]"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="px-6 py-4 border-t border-[#D4D4D4]">
                <div className="flex items-end gap-3">
                  <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F1F1F1] transition-colors flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-[#2B2B2B]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F1F1F1] transition-colors flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-[#2B2B2B]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <div className="flex-1 bg-[#F1F1F1] rounded-3xl px-4 py-2 flex items-center">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Message..."
                      className="flex-1 bg-transparent focus:outline-none text-sm text-[#2B2B2B] placeholder-[#919191]"
                    />
                    <button className="ml-2 text-[#919191] hover:text-[#2B2B2B]">
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
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2B2B2B] text-white hover:bg-[#919191] transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default InstagramMessagesPage;
