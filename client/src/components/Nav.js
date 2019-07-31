import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Query, ApolloConsumer } from "react-apollo";
import Queries from "../graphql/queries";
const { GET_USER_ID } = Queries;


class Nav extends Component {

  render() {
    return (
      <ApolloConsumer>
        {client => (
          <Query query={GET_USER_ID}>
            {({ data }) => {
              if (data._id) {
                return (
                  <div>
                    <i className="fas fa-dog"></i>
                    <button
                      onClick={e => {
                        e.preventDefault();
                        localStorage.removeItem("auth-token");
                        client.writeData({ data: { _id: "" } });
                        this.props.history.push("/");
                      }}
                    >
                      Logout
                    </button>
                  </div>
                );
              } else {
                return (
                  <div>
                    <i className="fas fa-dog"></i>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>

                  </div>
                );
              }
            }}
          </Query>
        )}
      </ApolloConsumer>
    );
  }
};

export default withRouter(Nav);