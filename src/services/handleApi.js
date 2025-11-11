import { generateClient } from "aws-amplify/api";
import {
  getMediaCommentsFromInstagramAccount,
  linkInstagramAccount,
  manageUser,
  postCommentOnInstagramAccount,
  sendWhatsappMessage,
} from "./api";

const client = generateClient();

export const manageUserApi = async (action, data) => {
  try {
    const response = await client.graphql({
      query: manageUser,
      variables: {
        action: action,
        input: data,
      },
      authMode: "userPool",
    });
    return response?.data?.manageUser;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const linkInstagramAccountApi = async (data) => {
  try {
    const response = await client.graphql({
      query: linkInstagramAccount,
      variables: {
        input: data,
      },
      authMode: "userPool",
    });
    return response?.data?.linkInstagramAccount;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const postCommentOnInstagramAccountApi = async (data) => {
  try {
    const response = await client.graphql({
      query: postCommentOnInstagramAccount,
      variables: {
        userId: data.userId,
        mediaId: data.mediaId,
        comment: data.comment,
      },
      authMode: "userPool",
    });
    return response?.data?.postCommentOnInstagramAccount;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getMediaCommentsFromInstagramAccountApi = async (data) => {
  try {
    const response = await client.graphql({
      query: getMediaCommentsFromInstagramAccount,
      variables: {
        userId: data.userId,
        mediaId: data.mediaId,
        nextPageToken: data.nextPageToken || null,
      },
      authMode: "userPool",
    });
    return response?.data?.getMediaCommentsFromInstagramAccount;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const sendWhatsappMessageApi = async (data) => {
  try {
    const response = await client.graphql({
      query: sendWhatsappMessage,
      variables: {
        userId: data.userId,
      },
      authMode: "userPool",
    });
    return response?.data?.sendWhatsappMessage;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
