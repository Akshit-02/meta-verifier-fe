export const manageUser = /* GraphQL */ `
  mutation ManageUser($action: API_ACTIONS!, $input: UserInput!) {
    manageUser(action: $action, input: $input) {
      success
      message
      items {
        id
        name
        phoneNo
        email
        instagramDetails {
          id
          userId
          profilePictureUrl
          username
          name
          accountType
          followersCount
          followsCount
          mediaCount
          isInstagramSubscribed
          instagramRefreshToken
          instagramRefreshTokenUpdatedAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const linkInstagramAccount = /* GraphQL */ `
  mutation LinkInstagramAccount($input: LinkInstagramAccountInput!) {
    linkInstagramAccount(input: $input) {
      success
      message
    }
  }
`;

export const postCommentOnInstagramAccount = /* GraphQL */ `
  mutation PostCommentOnInstagramAccount(
    $userId: String!
    $mediaId: String!
    $comment: String!
  ) {
    postCommentOnInstagramAccount(
      userId: $userId
      mediaId: $mediaId
      comment: $comment
    ) {
      success
      message
    }
  }
`;

export const getMediaCommentsFromInstagramAccount = /* GraphQL */ `
  query GetMediaCommentsFromInstagramAccount(
    $userId: String!
    $mediaId: String!
    $nextPageToken: String
  ) {
    getMediaCommentsFromInstagramAccount(
      userId: $userId
      mediaId: $mediaId
      nextPageToken: $nextPageToken
    ) {
      success
      message
      items {
        id
        text
        senderId
        senderUsername
        isHidden
        timestamp
        likeCount
        replies {
          id
          text
          senderId
          senderUsername
          isHidden
          timestamp
          likeCount
          replies {
            id
            text
            senderId
            senderUsername
            isHidden
            timestamp
            likeCount
            replies {
              id
              text
              senderId
              senderUsername
              isHidden
              timestamp
              likeCount
            }
          }
        }
      }
      nextPageToken
    }
  }
`;

export const sendWhatsappMessage = /* GraphQL */ `
  mutation SendWhatsappMessage($userId: String!) {
    sendWhatsappMessage(userId: $userId) {
      success
      message
    }
  }
`;

export const publishInstagramContent = /* GraphQL */ `
  mutation PublishInstagramContent(
    $userId: String!
    $media: PublishInstagramContentInput!
  ) {
    publishInstagramContent(userId: $userId, media: $media) {
      success
      message
      mediaId
      permalink
    }
  }
`;

export const manageIgMediaAutomation = /* GraphQL */ `
  mutation ManageIgMediaAutomation(
    $action: API_ACTIONS!
    $input: IgMediaAutomationInput!
  ) {
    manageIgMediaAutomation(action: $action, input: $input) {
      success
      message
      items {
        id
        userId
        mediaType
        mediaUrl
        postedAt
        isActive
        automationType
        automationTrigger
        keywords
        replyCommentText
        replyDMType
        replyDMText
        replyDMMediaUrl
        replyDMCards {
          mediaUrl
          title
          buttons {
            title
            link
          }
        }
        mediaDetails {
          id
          caption
          mediaType
          mediaProductType
          mediaUrl
          thumbnailUrl
          permalink
          timestamp
          commentsCount
          likeCount
          shortcode
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const manageIgDMAutomation = /* GraphQL */ `
  mutation ManageIgDMAutomation(
    $action: API_ACTIONS!
    $input: IgDMAutomationInput!
  ) {
    manageIgDMAutomation(action: $action, input: $input) {
      success
      message
      items {
        id
        userId
        igAccountId
        triggerText
        replyText
        createdAt
        updatedAt
      }
    }
  }
`;

export const manageIgPostSchedule = /* GraphQL */ `
  mutation ManageIgPostSchedule(
    $action: API_ACTIONS!
    $input: IgPostScheduleInput!
  ) {
    manageIgPostSchedule(action: $action, input: $input) {
      success
      message
      items {
        id
        userId
        igAccountId
        scheduledAt
        type
        imageUrl
        videoUrl
        thumbnailUrl
        caption
        createdAt
        updatedAt
      }
    }
  }
`;
