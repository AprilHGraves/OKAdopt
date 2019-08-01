import React from 'react'
import MatchPercent from '../match/match'
import { Query, Mutation } from 'react-apollo';
import Queries from '../../graphql/queries';
import Mutations from '../../graphql/mutations';
const { GET_USER_ID, LIKED_DOGS } = Queries;
const { LIKE_DOG, UNLIKE_DOG } = Mutations;

class DogShowHeader extends React.Component {

  render(){
    let dog = this.props.dog;
    return (
      <div className="dog-show-info-inner">
        <div className="dog-show-info-inner-content">
          <div className="profile-thumb">
            <img src={dog.photoUrl} alt="profile"></img>
          </div>
          <div className="profile-basics">
            <h1>{dog.name}</h1>
            <div className="profile-basics-asl">
              <span className="profile-basics-asl-age">{dog.age}</span>
              <span className="profile-basics-asl-spacer">•</span>
              <span className="profile-basics-asl-location">{dog.contact.address.city}, {dog.contact.address.state}</span>
              <span className="profile-basics-asl-spacer">•</span>
              <span className="profile-basics-asl-match">
              </span>
              <MatchPercent dog={dog} userPrefs={this.props.userPrefs}/><span> Match</span>
              <Query query={GET_USER_ID} variables={{ token: localStorage.getItem("auth-token")}}>
                {({loading, error, data }) => {
                  if (loading) return "Loading..."
                  if (error) return `Error! ${error.message}`
                  // debugger;
                  const userId = data.userByToken._id;
                  // if (!userId) { return <div></div>}
                  return (
                    <Query query={LIKED_DOGS} variables={{ userId: userId }}>
                      {({ data }) => {
                        if (data && data.likedDogs && data.likedDogs.dogIds.includes(dog.id)) {
                          return (
                            <Mutation
                              mutation={UNLIKE_DOG}
                              onError={() => alert("stop spamming the button. thanks.")}
                              update={(cache, { data: { unlikeDog } }) => {
                                const res = cache.readQuery({
                                  query: LIKED_DOGS,
                                  variables: { userId: userId }
                                });
                                const dogs = res.likedDogs.dogIds.slice(0);

                                const removeId = dogs.indexOf(dog.id);
                                dogs.splice(removeId, 1);
                                cache.writeQuery({
                                  query: LIKED_DOGS,
                                  variables: { userId: userId },
                                  data: { likedDogs: {dogIds: dogs, __typename: "LikeType" } },
                                });
                              }}
                            >
                              {unlikeDog => (
                                <button
                                  className="like-pooch"
                                  onClick={e => {
                                    e.preventDefault();
                                    unlikeDog({
                                      variables: {
                                        userId: userId,
                                        dogId: dog.id
                                      },
                                      optimisticResponse: {
                                        __typename: "Mutation",
                                        unlikeDog: {
                                          _id: "a",
                                          __typename: "LikeType"
                                        }
                                      }
                                    })
                                  }}
                                >
                                  <i className="fas fa-star" />&nbsp;
                                  UNLIKE
                                </button>
                              )}
                            </Mutation>
                          )
                        } else {
                          return (
                            <Mutation
                              mutation={LIKE_DOG}
                              update={(cache, { data: { likeDog } }) => {
                                const res = cache.readQuery({
                                  query: LIKED_DOGS,
                                  variables: { userId: userId }
                                });
                                const dogs = res.likedDogs.dogIds.slice(0);

                                dogs.push(dog.id);

                                cache.writeQuery({
                                  query: LIKED_DOGS,
                                  variables: { userId: userId },
                                  data: { likedDogs: { dogIds: dogs, __typename: "LikeType" } },
                                });
                              }}
                            >
                              {likeDog => (
                                <button
                                  className="like-pooch"
                                  onClick={e => {
                                    e.preventDefault();
                                    likeDog({
                                      variables: {
                                        userId: userId,
                                        dogId: dog.id
                                      },
                                      optimisticResponse: {
                                        __typename: "Mutation",
                                        likeDog: {
                                          _id: "a",
                                          __typename: "LikeType"
                                        }
                                      }
                                    })
                                  }}
                                >
                                  <i className="fas fa-star" />&nbsp;
                                  LIKE
                                </button>
                              )}
                            </Mutation>
                          )
                        }
                      }}

                    </Query>
                  )
                }}
              </Query>
            </div>
            
          </div>
        </div>
      </div>
    )
  }
}

export default DogShowHeader;