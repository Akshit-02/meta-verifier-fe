import axios from "axios";

export const getAllIgMedia = async (accessToken) => {
  const allMedia = [];
  let nextPageUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,comments_count,like_count,shortcode&access_token=${accessToken}`;

  while (nextPageUrl) {
    const response = await axios.get(nextPageUrl);
    const media = response?.data?.data || [];
    const paging = response?.data?.paging;

    allMedia.push(...media);

    nextPageUrl = paging?.next || null;
  }

  return allMedia;
};

export const getIgMediaComments = async (mediaId, accessToken) => {
  const allComments = [];
  let nextPageUrl = `https://graph.instagram.com/${mediaId}/comments?fields=id,from,parent_id,text,timestamp,username,like_count&access_token=${accessToken}`;

  while (nextPageUrl) {
    const response = await axios.get(nextPageUrl);
    const comments = response?.data?.data || [];
    const paging = response?.data?.paging;

    allComments.push(...comments);

    nextPageUrl = paging?.next || null;
  }

  return allComments;
};

export const getIgAccountInfo = async (accessToken) => {
  const response = await axios.get(
    `https://graph.instagram.com/v22.0/me?fields=id,user_id,username,name,account_type,profile_picture_url,followers_count,follows_count,media_count&access_token=${accessToken}`
  );

  return response.data;
};

export const getIgMediaInsights = async (mediaId, accessToken) => {
  const response = await axios.get(
    `https://graph.instagram.com/${mediaId}/insights`,
    {
      params: {
        metric: "comments,likes,reach,saved,shares,views",
        period: "lifetime",
        access_token: accessToken,
      },
    }
  );

  return response.data.data;
};

export const getIgAccountMetricData = async (igUserId, accessToken) => {
  const response = await axios.get(
    `https://graph.instagram.com/${igUserId}/insights?metric=accounts_engaged,likes,comments,reach,saves,shares,replies,total_interactions,views&metric_type=total_value&period=day&access_token=${accessToken}`
  );

  const data = {
    accounts_engaged: String(response.data.data[0].total_value.value) || 0,
    likes: String(response.data.data[1].total_value.value) || 0,
    comments: String(response.data.data[2].total_value.value) || 0,
    reach: String(response.data.data[3].total_value.value) || 0,
    saves: String(response.data.data[4].total_value.value) || 0,
    shares: String(response.data.data[5].total_value.value) || 0,
    replies: String(response.data.data[6].total_value.value) || 0,
    total_interactions: String(response.data.data[7].total_value.value) || 0,
    views: String(response.data.data[8].total_value.value) || 0,
  };

  return data;
};
