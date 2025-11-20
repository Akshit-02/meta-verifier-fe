import { getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState, useRef } from "react";
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
  const [loadingMessages, setLoadingMessages] = useState(false);
  const pollingIntervalRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      // startPolling();
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [selectedConversation]);

  useEffect(() => {
    // scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startPolling = () => {
    stopPolling();
    pollingIntervalRef.current = setInterval(() => {
      if (selectedConversation) {
        fetchMessages(selectedConversation.id, true);
      }
    }, 5000);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      const userRes = await manageUserApi("GET", {
        id: `${currentUser.username}::${currentUser.username}`,
      });
      if (userRes.success) {
        setUser(userRes.items?.[0]);
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

      const transformedConversations = (data.data || []).map((conv) => {
        const participant = conv.participants?.data?.[1];
        return {
          id: conv.id,
          userId: participant?.id || "",
          username: participant?.username || "Unknown User",
          lastMessage: "",
          timestamp: new Date().toISOString(),
          unread: false,
        };
      });
      setConversations(transformedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId, silent = false) => {
    if (!user?.instagramDetails?.instagramRefreshToken) {
      console.error("No Instagram access token found");
      return;
    }

    if (!silent) {
      setLoadingMessages(true);
    }

    try {
      const accessToken = user.instagramDetails.instagramRefreshToken;
      const url = `https://graph.instagram.com/v20.0/${conversationId}/messages?fields=id,from,to,message,created_time&limit=25&access_token=${accessToken}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.error("Error fetching messages:", data.error);
        return;
      }

      console.log("Messages data:", data);

      const transformedMessages = (data.data || [])
        .map((msg) => ({
          id: msg.id,
          text: msg.message || "",
          senderId: msg.from?.id || "",
          timestamp: msg.created_time || new Date().toISOString(),
        }))
        .reverse();

      setMessages(transformedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      if (!silent) {
        setLoadingMessages(false);
      }
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages([]);
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

  const generateAvatar = (username) => {
    const colors = [
      "bg-gradient-to-br from-purple-400 to-pink-500",
      "bg-gradient-to-br from-blue-400 to-cyan-500",
      "bg-gradient-to-br from-green-400 to-emerald-500",
      "bg-gradient-to-br from-orange-400 to-red-500",
      "bg-gradient-to-br from-indigo-400 to-purple-500",
      "bg-gradient-to-br from-yellow-400 to-orange-500",
    ];
    const initial = username?.charAt(0).toUpperCase() || "?";
    const colorIndex =
      username?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        colors.length || 0;

    return (
      <div
        className={`w-full h-full ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-xl`}
      >
        {initial}
      </div>
    );
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
              <button
                onClick={fetchConversations}
                disabled={loadingConversations}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F1F1F1] transition-colors disabled:opacity-50"
              >
                <svg
                  className={`w-5 h-5 text-[#2B2B2B] ${
                    loadingConversations ? "animate-spin" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
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
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {loading || loadingConversations ? (
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
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <div>
                  <p className="text-[#919191] text-sm mb-4">
                    {conversations.length === 0
                      ? "No conversations yet"
                      : "No conversations found"}
                  </p>
                  {conversations.length === 0 && (
                    <button
                      onClick={fetchConversations}
                      className="px-4 py-2 bg-[#2B2B2B] text-white rounded-lg text-sm hover:bg-[#919191] transition-colors"
                    >
                      Refresh Conversations
                    </button>
                  )}
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
                    <div className="w-14 h-14 rounded-full overflow-hidden">
                      {generateAvatar(conversation.username)}
                    </div>
                    {conversation.unread && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                    )}
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
                      {conversation.timestamp && (
                        <span className="text-xs text-[#919191] ml-2 flex-shrink-0">
                          {formatTime(conversation.timestamp)}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <p
                        className={`text-sm ${
                          conversation.unread
                            ? "font-semibold text-[#2B2B2B]"
                            : "text-[#919191]"
                        } truncate`}
                      >
                        {conversation.lastMessage}
                      </p>
                    )}
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
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    {generateAvatar(selectedConversation.username)}
                  </div>
                  <div>
                    <p className="font-bold text-[#2B2B2B]">
                      {selectedConversation.username}
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-xs text-[#919191]">Active now</p>
                    </div>
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
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[calc(100vh-150px)] overflow-y-auto">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B2B2B]"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-[#919191]">No messages yet</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === user?.instagramDetails?.userId
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            message.senderId === user?.instagramDetails?.userId
                              ? "bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white"
                              : "bg-[#F1F1F1] text-[#2B2B2B]"
                          } rounded-2xl px-4 py-2`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderId ===
                              user?.instagramDetails?.userId
                                ? "text-white/70"
                                : "text-[#919191]"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="px-6 py-4 border-t border-[#D4D4D4]">
                <div className="flex items-end gap-3">
                  {/* <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F1F1F1] transition-colors flex-shrink-0">
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
                  {/* <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F1F1F1] transition-colors flex-shrink-0">
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
                  </button> */}
                  <div className="flex-1 bg-[#F1F1F1] rounded-3xl px-4 py-2 flex items-center">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Message..."
                      className="flex-1 bg-transparent focus:outline-none text-sm text-[#2B2B2B] placeholder-[#919191]"
                    />
                    {/* <button className="ml-2 text-[#919191] hover:text-[#2B2B2B]">
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
                    </button> */}
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
