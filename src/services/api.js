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
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      nextPageToken
      __typename
    }
  }
`;
