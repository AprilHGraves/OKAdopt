import gql from "graphql-tag";

export default {
  FETCH_CONVERSATIONS: gql`
    query fetchConversations($userId: ID!) {
      conversationsByUser(userId: $userId) {
        conversations
      }
    }
  `,
  LIKED_DOGS: gql`
    query LikedDogs($userId: ID!) {
      likedDogs(userId: $userId) {
        dogIds
      }
    }
  `,
  IS_LOGGED_IN: gql`
    query IsLoggedIn {
      isLoggedIn @client
    }
  `,
  GET_USER_ID: gql`
    query GetUserId($token: String!) {
      userByToken(token: $token) {
        _id
      }
    }
  `,
  GET_USER_PREFS: gql`
    query getUser ($id: ID!){
      user(_id: $id) {
        _id
        zipcode
        willTravel
        hasChildren
        hasDogs
        hasCats
        likedSizes
        likedGenders
        likedAges
      }
    }
  `,
  FETCH_SHIBAS: gql`
    query FetchDogs {
      dogs {
        id,
        age,
        gender,
        size,
        name,
        description,
        photoUrl,
        contact {
          address {
            city
          }
        }
        environment {
          children,
          dogs,
          cats
        },
      }
    }
  `,
  FETCH_ONE_DOG: gql`
  query FetchDog($dogId: ID!) {
    dog(dogId: $dogId) {
      id,
      age,
      gender,
      size,
      url,
      name,
      description,
      coat,
      photoUrl,
      breeds {
        primary
      }
      contact {
        email
        phone
        address {
          address1
          address2
          city
          state
          postcode
          country
        }
      },
      environment {
        children,
        dogs,
        cats
      },
      breedInfo {
        bred_for
        temperament
        life_span
      }
    }
  }
  `
}