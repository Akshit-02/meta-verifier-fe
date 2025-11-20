import { getCurrentUser, signOut } from "aws-amplify/auth";
import { uploadData } from "aws-amplify/storage";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  manageUserApi,
  publishInstagramContentApi,
} from "../../services/handleApi";
import { getMediaUrl } from "../../utils/helper";
import {
  CommentIcon,
  ContentIcon,
  DashboardIcon,
  PostsIcon,
} from "../../assets/icons";

const ContentPostingPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("content-posting");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Publishing states
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [mediaType, setMediaType] = useState("IMAGE");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [currentPreview, setCurrentPreview] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoThumbnails, setVideoThumbnails] = useState({});
  const [postNow, setPostNow] = useState(true);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishedData, setPublishedData] = useState(null);

  const fileInputRef = useRef(null);
  const videoRefs = useRef({});

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
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoading(false);
    }
  };

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const generateVideoThumbnail = useCallback((videoFile, fileId) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.crossOrigin = "anonymous";
      video.muted = true;

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = Math.min(1, video.duration / 4);
      };

      video.onseeked = () => {
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8);
          setVideoThumbnails((prev) => ({
            ...prev,
            [fileId]: thumbnailUrl,
          }));
          resolve(thumbnailUrl);
        } catch (error) {
          console.error("Error generating thumbnail:", error);
          resolve(null);
        } finally {
          URL.revokeObjectURL(video.src);
        }
      };

      video.onerror = () => {
        console.error("Error loading video for thumbnail generation");
        resolve(null);
      };

      video.src = URL.createObjectURL(videoFile);
    });
  }, []);

  const handleFileSelect = useCallback(
    (selectedFiles) => {
      const fileArray = Array.from(selectedFiles);
      const processedFiles = fileArray.map((file, index) => ({
        id: Date.now() + index,
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
      }));

      setFiles(processedFiles);

      processedFiles.forEach((fileObj) => {
        if (fileObj.type === "VIDEO") {
          generateVideoThumbnail(fileObj.file, fileObj.id);
        }
      });

      if (processedFiles.length > 1) {
        setMediaType("CAROUSEL");
      } else {
        setMediaType(processedFiles[0].type);
      }

      if (processedFiles.length > 0) {
        setStep(2);
      }
    },
    [generateVideoThumbnail]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const droppedFiles = e.dataTransfer.files;
      handleFileSelect(droppedFiles);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const removeFile = (id) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      if (updated.length === 0) {
        setStep(1);
        setMediaType("IMAGE");
      } else if (updated.length === 1) {
        setMediaType(updated[0].type);
      }
      return updated;
    });

    setVideoThumbnails((prev) => {
      const newThumbnails = { ...prev };
      delete newThumbnails[id];
      return newThumbnails;
    });
  };

  const handleCustomThumbnail = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedThumbnail(file);
        setThumbnailPreview(URL.createObjectURL(file));
      }
    };
    input.click();
  };

  const uploadToS3 = async (file, fileType, progressCallback) => {
    const result = await uploadData({
      path: `ig-content-publish/${Date.now()}::${file.name}::${fileType}`,
      data: file,
      options: {
        contentType: file.type,
        onProgress: progressCallback,
      },
    }).result;
    return result;
  };

  const handlePublish = async () => {
    if (!caption.trim()) {
      alert("Please enter a caption");
      return;
    }

    if (!postNow && (!scheduledDate || !scheduledTime)) {
      alert("Please select a date and time for scheduling");
      return;
    }

    setPublishing(true);
    setUploadProgress(0);

    try {
      const uploadResults = [];
      let completedUploads = 0;
      const totalUploads = files.length + (selectedThumbnail ? 1 : 0);

      // Upload main media files
      for (const fileObj of files) {
        const progressCallback = ({ transferredBytes, totalBytes }) => {
          if (totalBytes) {
            const fileProgress = (transferredBytes / totalBytes) * 100;
            const overallProgress =
              ((completedUploads + fileProgress / 100) / totalUploads) * 100;
            setUploadProgress(Math.min(overallProgress, 100));
          }
        };

        const result = await uploadToS3(
          fileObj.file,
          fileObj.type,
          progressCallback
        );
        uploadResults.push({
          fileId: fileObj.id,
          type: fileObj.type,
          s3Key: result.path,
        });
        completedUploads++;
        setUploadProgress((completedUploads / totalUploads) * 100);
      }

      // Upload thumbnail
      let thumbnailResult = null;
      if (selectedThumbnail) {
        const progressCallback = ({ transferredBytes, totalBytes }) => {
          if (totalBytes) {
            const fileProgress = (transferredBytes / totalBytes) * 100;
            const overallProgress =
              ((completedUploads + fileProgress / 100) / totalUploads) * 100;
            setUploadProgress(Math.min(overallProgress, 100));
          }
        };

        thumbnailResult = await uploadToS3(
          selectedThumbnail,
          "thumbnail",
          progressCallback
        );
        completedUploads++;
      } else {
        const firstVideo = files.find((f) => f.type === "VIDEO");
        if (firstVideo && videoThumbnails[firstVideo.id]) {
          const thumbnailFile = dataURLtoFile(
            videoThumbnails[firstVideo.id],
            `${firstVideo.id}-auto.jpg`
          );
          thumbnailResult = await uploadToS3(
            thumbnailFile,
            "thumbnail",
            () => {}
          );
        }
      }

      setUploadProgress(100);

      // Prepare payload
      const payload = {
        caption,
        mediaType,
        mediaUrl:
          mediaType !== "CAROUSEL" ? getMediaUrl(uploadResults[0].s3Key) : null,
        thumbnailUrl: thumbnailResult?.path
          ? getMediaUrl(thumbnailResult.path)
          : null,
        children:
          mediaType === "CAROUSEL"
            ? uploadResults.map((result) => ({
                mediaType: result.type,
                mediaUrl: getMediaUrl(result.s3Key),
              }))
            : [],
      };

      if (location) {
        payload.locationId = location;
      }

      console.log("Publishing payload:", payload);

      if (postNow) {
        const response = await publishInstagramContentApi(user?.id, payload);

        if (response.success) {
          setPublishedData({
            mediaId: response.mediaId,
            permalink: response.permalink,
            message: response.message,
          });
          setPublishSuccess(true);
        } else {
          alert("❌ " + response.message);
        }
      } else {
        // Handle scheduling (implement your scheduling API)
        alert("Scheduling feature coming soon!");
      }
    } catch (error) {
      console.error("Publish failed:", error);
      alert(`❌ Publish failed: ${error.message}`);
    } finally {
      setPublishing(false);
    }
  };

  const resetForm = () => {
    setFiles([]);
    setStep(1);
    setCaption("");
    setLocation("");
    setSelectedThumbnail(null);
    setThumbnailPreview(null);
    setMediaType("IMAGE");
    setUploadProgress(0);
    setVideoThumbnails({});
    setPostNow(true);
    setScheduledDate("");
    setScheduledTime("");
    setCurrentPreview(0);
    setPublishSuccess(false);
    setPublishedData(null);
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

  const INSTAGRAM_AUTH_URL =
    "https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=1505725710571824&redirect_uri=https://social.briggo.in/dashboard&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights";

  const MediaPreview = ({ fileObj, index, showControls = true }) => (
    <div className="relative h-[400px] w-[225px]">
      {fileObj.type === "VIDEO" ? (
        <video
          ref={(el) => (videoRefs.current[fileObj.id] = el)}
          src={fileObj.preview}
          className="object-contain w-full h-full rounded-lg"
          muted
          loop
          autoPlay
          controls
        />
      ) : (
        <img
          src={fileObj.preview}
          alt={`Preview ${index + 1}`}
          className="object-contain w-full h-full rounded-lg"
        />
      )}
      {showControls && (
        <button
          onClick={() => removeFile(fileObj.id)}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );

  const StepIndicator = () => (
    <div className="flex justify-center items-center mb-8">
      {[1, 2, 3].map((stepNum, idx) => (
        <div key={stepNum} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
              step >= stepNum
                ? "bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white shadow-lg"
                : "bg-[#D4D4D4] text-[#919191]"
            }`}
          >
            {step > stepNum ? "✓" : stepNum}
          </div>
          {idx < 2 && (
            <div
              className={`w-16 h-1 mx-2 transition-all duration-300 ${
                step > stepNum
                  ? "bg-gradient-to-r from-[#2B2B2B] to-[#919191]"
                  : "bg-[#D4D4D4]"
              }`}
            />
          )}
        </div>
      ))}
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
              {item.icon}
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
        <header className="bg-white border-b border-[#D4D4D4] px-8 py-7">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2B2B2B]">
                Content Posting
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-[#2B2B2B] text-white hover:bg-[#919191] transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#D4D4D4] border-t-[#2B2B2B] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#919191]">Loading...</p>
              </div>
            </div>
          ) : !user?.instagramDetails?.instagramRefreshToken ? (
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="bg-white rounded-3xl shadow-2xl border border-[#D4D4D4] p-12 max-w-2xl w-full text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#2B2B2B] to-[#919191] rounded-full flex items-center justify-center">
                  <span className="text-6xl">📸</span>
                </div>
                <h2 className="text-4xl font-bold text-[#2B2B2B] mb-4">
                  Connect Your Instagram
                </h2>
                <p className="text-xl text-[#919191] mb-8">
                  Link your Instagram account to publish content
                </p>
                <a
                  href={INSTAGRAM_AUTH_URL}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#2B2B2B] to-[#919191] text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <span className="text-2xl">📸</span>
                  Connect Instagram Account
                </a>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <StepIndicator />

              {/* Step 1: Upload */}
              {step === 1 && (
                <div className="bg-white rounded-3xl shadow-lg border border-[#D4D4D4] p-8">
                  <h2 className="text-2xl font-bold text-[#2B2B2B] mb-6">
                    Upload Media
                  </h2>
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#D4D4D4] rounded-2xl p-12 text-center cursor-pointer hover:border-[#2B2B2B] transition-all"
                  >
                    <span className="text-6xl mb-4 block">📁</span>
                    <h3 className="text-xl font-semibold text-[#2B2B2B] mb-2">
                      Upload your media
                    </h3>
                    <p className="text-[#919191] mb-4">
                      Drag and drop or click to select files
                    </p>
                    <p className="text-sm text-[#919191]">
                      Support images, videos, and multiple files for carousel
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      className="hidden"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-6 mt-8">
                    <div className="text-center p-4 bg-[#2B2B2B] rounded-xl">
                      <span className="text-4xl mb-2 block">📸</span>
                      <span className="font-semibold text-[#fff]">Image</span>
                    </div>
                    <div className="text-center p-4 bg-[#2B2B2B] rounded-xl">
                      <span className="text-4xl mb-2 block">🎥</span>
                      <span className="font-semibold text-[#fff]">Video</span>
                    </div>
                    <div className="text-center p-4 bg-[#2B2B2B] rounded-xl">
                      <span className="text-4xl mb-2 block">📷</span>
                      <span className="font-semibold text-[#fff]">
                        Carousel
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Preview & Thumbnail */}
              {step === 2 && files.length > 0 && (
                <div className="bg-white rounded-3xl shadow-lg border border-[#D4D4D4] p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#2B2B2B]">
                      Preview & Thumbnail
                    </h2>
                    <span className="px-4 py-2 bg-[#2B2B2B] text-[#fff] rounded-full text-sm font-semibold">
                      {mediaType}
                    </span>
                  </div>

                  {/* Main Preview */}
                  <div className="relative rounded-2xl mb-6 overflow-hidden">
                    <MediaPreview
                      fileObj={files[currentPreview]}
                      index={currentPreview}
                    />

                    {files.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setCurrentPreview((prev) =>
                              prev > 0 ? prev - 1 : files.length - 1
                            )
                          }
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                        >
                          ‹
                        </button>
                        <button
                          onClick={() =>
                            setCurrentPreview((prev) =>
                              prev < files.length - 1 ? prev + 1 : 0
                            )
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                        >
                          ›
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {files.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentPreview
                                  ? "bg-white w-6"
                                  : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Grid */}
                  {files.length > 1 && (
                    <div className="grid grid-cols-5 gap-3 mb-6">
                      {files.map((fileObj, index) => (
                        <button
                          key={fileObj.id}
                          onClick={() => setCurrentPreview(index)}
                          className={`aspect-square rounded-lg overflow-hidden transition-all ${
                            currentPreview === index
                              ? "ring-4 ring-purple-500"
                              : "hover:ring-2 hover:ring-[#D4D4D4]"
                          }`}
                        >
                          {fileObj.type === "VIDEO" &&
                          videoThumbnails[fileObj.id] ? (
                            <img
                              src={videoThumbnails[fileObj.id]}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={fileObj.preview}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Video Thumbnail Options */}
                  {(mediaType === "VIDEO" ||
                    (mediaType === "CAROUSEL" &&
                      files.some((f) => f.type === "VIDEO"))) && (
                    <div className="mb-6 p-4 bg-[#F1F1F1] rounded-xl">
                      <label className="block text-sm font-semibold text-[#2B2B2B] mb-3">
                        Video Thumbnail
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setSelectedThumbnail(null);
                            setThumbnailPreview(null);
                          }}
                          className="px-4 py-2 bg-white rounded-lg border-2 border-[#D4D4D4] hover:border-[#2B2B2B] transition-colors font-medium text-sm"
                        >
                          Use Auto-generated
                        </button>
                        <button
                          onClick={handleCustomThumbnail}
                          className="px-4 py-2 bg-[#d4d4d4] text-[#2B2B2B] rounded-lg hover:bg-[#d4d4d4] transition-colors font-medium text-sm"
                        >
                          📷 Upload Custom
                        </button>
                      </div>
                      {thumbnailPreview && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-green-600 mb-2">
                            Custom thumbnail selected:
                          </p>
                          <img
                            src={thumbnailPreview}
                            alt="Custom thumbnail"
                            className="w-24 h-24 rounded-lg object-cover border-2 border-green-500"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 border-2 border-[#D4D4D4] rounded-xl font-semibold hover:bg-[#F1F1F1] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 py-3 bg-[#2b2b2b] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Details & Publish */}
              {step === 3 && (
                <div className="bg-white rounded-3xl shadow-lg border border-[#D4D4D4] p-8">
                  <h2 className="text-2xl font-bold text-[#2B2B2B] mb-6">
                    Add Details
                  </h2>

                  <div className="space-y-6">
                    {/* Media Type */}
                    <div>
                      <label className="block text-sm font-semibold text-[#2B2B2B] mb-2">
                        Media Type
                      </label>
                      <div className="flex items-center gap-3">
                        <span className="px-4 py-2 bg-[#2b2b2b] text-[#d4d4d4] rounded-lg font-semibold">
                          {mediaType}
                        </span>
                        <span className="text-[#919191]">
                          {files.length} file{files.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Caption */}
                    <div>
                      <label className="block text-sm font-semibold text-[#2B2B2B] mb-2">
                        Caption *
                      </label>
                      <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Write a caption..."
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-[#D4D4D4] rounded-xl focus:border-[#2b2b2b] focus:outline-none resize-none"
                        maxLength={2200}
                        disabled={publishing}
                      />
                      <div className="text-right text-sm text-[#919191] mt-1">
                        {caption.length}/2,200 characters
                      </div>
                    </div>

                    {/* Location */}
                    {/* <div>
                      <label className="block text-sm font-semibold text-[#2B2B2B] mb-2">
                        Location (Optional)
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Add location ID"
                        className="w-full px-4 py-3 border-2 border-[#D4D4D4] rounded-xl focus:border-purple-500 focus:outline-none"
                        disabled={publishing}
                      />
                    </div> */}

                    {/* Post Now / Schedule Toggle */}
                    <div className="border-2 border-[#D4D4D4] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-semibold text-[#2B2B2B]">
                          Publishing Schedule
                        </label>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${
                              postNow ? "text-[#2b2b2b]" : "text-[#919191]"
                            }`}
                          >
                            Post Now
                          </span>
                          <button
                            onClick={() => setPostNow(!postNow)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              postNow ? "bg-[#2b2b2b]" : "bg-[#D4D4D4]"
                            }`}
                            disabled={publishing}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                postNow ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {!postNow && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-[#919191] mb-1">
                                Date *
                              </label>
                              <input
                                type="date"
                                value={scheduledDate}
                                onChange={(e) =>
                                  setScheduledDate(e.target.value)
                                }
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full px-3 py-2 border-2 border-[#D4D4D4] rounded-lg focus:border-[#2b2b2b] focus:outline-none text-sm"
                                disabled={publishing}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#919191] mb-1">
                                Time *
                              </label>
                              <input
                                type="time"
                                value={scheduledTime}
                                onChange={(e) =>
                                  setScheduledTime(e.target.value)
                                }
                                className="w-full px-3 py-2 border-2 border-[#D4D4D4] rounded-lg focus:border-[#2b2b2b] focus:outline-none text-sm"
                                disabled={publishing}
                              />
                            </div>
                          </div>

                          {scheduledDate && scheduledTime && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-xs font-semibold text-blue-800 mb-1">
                                📅 Scheduled for:
                              </p>
                              <p className="text-sm text-blue-700">
                                {new Date(
                                  `${scheduledDate}T${scheduledTime}`
                                ).toLocaleString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          )}

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-xs text-yellow-800">
                              ⏰ <strong>Note:</strong> Your post will be
                              automatically published at the scheduled time.
                            </p>
                          </div>
                        </div>
                      )}

                      {postNow && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-xs text-green-800">
                            ⚡ <strong>Instant Publishing:</strong> Your post
                            will be published immediately to Instagram.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Upload Progress */}
                    {publishing && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-[#2B2B2B]">
                            {postNow ? "Publishing..." : "Scheduling..."}
                          </span>
                          <span className="text-sm text-[#919191]">
                            {Math.round(uploadProgress)}%
                          </span>
                        </div>
                        <div className="w-full h-3 bg-[#F1F1F1] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#2b2b2b] to-[#d4d4d4] transition-all duration-300 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setStep(2)}
                      disabled={publishing}
                      className="flex-1 py-3 border-2 border-[#D4D4D4] rounded-xl font-semibold hover:bg-[#F1F1F1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePublish}
                      disabled={
                        publishing ||
                        !caption.trim() ||
                        (!postNow && (!scheduledDate || !scheduledTime))
                      }
                      className="flex-1 py-3 bg-[#2b2b2b] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {publishing ? (
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
                          {postNow ? "Publishing..." : "Scheduling..."}
                        </>
                      ) : (
                        <>
                          <span className="text-xl">
                            {postNow ? "🚀" : "📅"}
                          </span>
                          {postNow ? "Publish to Instagram" : "Schedule Post"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Success Modal */}
      {publishSuccess && publishedData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
            <div className="p-12 text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-4xl">🎉</span>
              </div>

              {/* Success Message */}
              <h2 className="text-xl font-bold text-[#2B2B2B] mb-4">
                Published Successfully!
              </h2>
              <p className="text-lg text-[#919191] mb-6">
                {publishedData.message ||
                  "Your content has been published to Instagram"}
              </p>

              {/* Post Details */}
              <div className="bg-gradient-to-r from-[#2b2b2b] to-[#d4d4d4] rounded-2xl p-6 border border-[#2b2b2b] mb-8">
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">📸</span>
                    <p className="text-sm font-semibold text-[#fff]">
                      Your post is now live on Instagram!
                    </p>
                  </div>

                  {publishedData.mediaId && (
                    <div className="text-sm text-[#fff]">
                      <span className="font-medium">Media ID:</span>{" "}
                      {publishedData.mediaId}
                    </div>
                  )}

                  {/* Preview Thumbnail */}
                  {files.length > 0 && (
                    <div className="mt-4">
                      <div className="w-32 h-32 mx-auto rounded-xl overflow-hidden border-2 border-[#2b2b2b] shadow-lg">
                        {files[0].type === "VIDEO" &&
                        videoThumbnails[files[0].id] ? (
                          <img
                            src={videoThumbnails[files[0].id]}
                            alt="Published content"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={files[0].preview}
                            alt="Published content"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {publishedData.permalink && (
                  <a
                    href={publishedData.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-[#2b2b2b] text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <span className="text-xl">🔗</span>
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
                )}

                <button
                  onClick={resetForm}
                  className="px-8 py-3 bg-white border-2 border-[#D4D4D4] text-[#2B2B2B] rounded-xl font-semibold hover:bg-[#F1F1F1] transition-all duration-300"
                >
                  Create Another Post
                </button>
              </div>

              <p className="text-sm text-[#919191] mt-6">
                It may take a few moments for your post to appear on Instagram
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPostingPage;
