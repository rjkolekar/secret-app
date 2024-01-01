import React, { useEffect, useState } from 'react';

const Component = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [pagePosts, setPagePosts] = useState([]);

  const handleFacebookLogin = () => {
    window.FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        const accessToken = response.authResponse.accessToken;

        window.FB.api('/me', { fields: 'id,name,email' }, function(user) {
          // Include access token in user data
          user.accessToken = accessToken;
          user.user_id = user.id; // Assuming user.id holds the required ID
          console.log('User data sent to the backend:', user);
          // Send user data including access token to your backend
          fetch('http://localhost:8000/api/v1/facebook-users/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
          })
            .then(response => {
              if (response.ok) {
                return response.json();
              }
              throw new Error('Network response was not ok.');
            })
            .then(data => {
              console.log('User registered successfully:', data);
              setUserData(user);
              setLoggedIn(true);
              alert('Logged in successfully!');
            })
            .catch(error => {
              console.error('Error registering user:', error);
              // Handle error
            });
        });
      } else {
        window.FB.login(function(response) {
          // Handle login response
        }, { scope: 'id' });
      }
    });
  };

  const handleGetPagePosts = (pageAccessToken) => {
    fetch(`https://graph.facebook.com/v13.0/POST_ID/published_posts?access_token=${pageAccessToken}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        if (data && data.data) {
          console.log('Page Posts:', data.data);
          setPagePosts(data.data);
        } else {
          throw new Error('No posts found for the page.');
        }
      })
      .catch(error => {
        console.error('Error fetching page posts:', error);
        // Handle error
      });
  };

  const handleGetPageAccessToken = () => {
    window.FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        const userAccessToken = response.authResponse.accessToken;
        fetch(`https://graph.facebook.com/v13.0/me/accounts?access_token=${userAccessToken}`)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .then(data => {
            if (data && data.data.length > 0) {
              // Replace 'PAGE_NAME_OR_ID' with the name or ID of your Facebook Page
              const page = data.data.find(page => page.id === 'PAGE_ID');
              if (page) {
                const pageAccessToken = page.access_token;
                handleGetPagePosts(pageAccessToken);
              } else {
                throw new Error('Page not found among managed pages.');
              }
            } else {
              throw new Error('No managed pages found.');
            }
          })
          .catch(error => {
            console.error('Error fetching managed pages:', error);
            // Handle error
          });
      }
    });
  };

  const updateAccessToken = (userData) => {
    fetch('http://localhost:8000/api/v1/facebook-users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userData.userID,
        accessToken: userData.accessToken,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        console.log('Access token update response:', data); // Log the response data
        // Handle access token update
      })
      .catch((error) => {
        console.error('Access token update error:', error);
        // Handle access token update error
      });
  };
  
  const registerUser = (userData) => {
    // Make a request to register the new user in your backend
    fetch('http://localhost:8000/api/v1/facebook-users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userData.userID,
        name: userData.name,
        email: userData.email, // Include the email field for registering a new user
        accessToken: userData.accessToken,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('User registered successfully:', data);
        // Handle successful user registration
      })
      .catch((error) => {
        console.error('User registration error:', error);
        // Handle user registration error
      });
  };
  

  const responseFacebook = (response) => {
    if (response.accessToken) {
      const handleUserRegistration = (userData) => {
        // Check if the user exists before making a POST request
        fetch(`http://localhost:8000/api/v1/active-users/?user_id=${userData.userID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.length > 0) {
              // User exists, update the access token including email
              updateAccessToken(userData);
            } else {
              // User doesn't exist, register a new user including email
              registerUser(userData);
            }
          })
          .catch((error) => {
            console.error('API call error:', error);
            // Handle API call error
          });
      };
  
      // Make sure the response includes the email field
      if (!response.email) {
        // Fetch the user's email if it's not present in the initial response
        window.FB.api('/me', { fields: 'id,name,email' }, function(user) {
          response.email = user.email;
          setUserData(response);
          setLoggedIn(true);
          handleUserRegistration(response);
        });
      } else {
        setUserData(response);
        setLoggedIn(true);
        handleUserRegistration(response);
      }
    } else {
      // Handle login failure or cancellation
      console.log('Login failed');
    }
  };
  

  const handleGetPosts = () => {
    const accessToken = window.FB.getAuthResponse().accessToken;
    fetch(`https://graph.facebook.com/v13.0/122109438710118707_122109576986118707/published_posts?access_token=${accessToken}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        if (data && data.data) {
          console.log('Posts fetched successfully:', data.data);
          setPagePosts(data.data);
        } else {
          throw new Error('Unexpected null response from API');
        }
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        // Handle error
      });
  };
// ... (Rest of the code remains the same)


// ... (Rest of the code remains the same)

  // ... (Previous code remains the same)
  const handleLikePost = (postId, pageAccessToken) => {
    fetch(`https://graph.facebook.com/${postId}/likes?access_token=${pageAccessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          console.log('Post liked successfully');
          // Optionally update UI or perform other actions after liking the post
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .catch(error => {
        console.error('Error liking post:', error);
        // Handle error
      });
  };

  const handleLikePostWithPageToken = (postId) => {
    window.FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        const userAccessToken = response.authResponse.accessToken;
        fetch(`https://graph.facebook.com/v13.0/me/accounts?access_token=${userAccessToken}`)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .then(data => {
            if (data && data.data.length > 0) {
              const page = data.data.find(page => page.id === '122109438710118707'); // Replace with your page ID
              if (page) {
                const pageAccessToken = page.access_token;
                handleLikePost(postId, pageAccessToken);
              } else {
                throw new Error('Page not found among managed pages.');
              }
            } else {
              throw new Error('No managed pages found.');
            }
          })
          .catch(error => {
            console.error('Error fetching managed pages:', error);
            // Handle error
          });
      }
    });
  };

  const handleListUsers = () => {
    fetch('http://localhost:8000/api/v1/active-users/') // Replace with your Django API endpoint
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        console.log('Users fetched successfully:', data);
        setUsersList(data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        // Handle error
      });
  };

  const handleLogout = () => {
    window.FB.logout(function(response) {
      setLoggedIn(false);
      setUserData(null);
      alert('Logged out successfully!');
    });
  };

  useEffect(() => {
    document.cookie = 'fblo_1031165754841463=value; SameSite=None; Secure';
  }, []);
  useEffect(() => {
    
    const initializeFacebookSDK = () => {
      
      if (window.location.protocol !== 'https:') {
        console.error("Facebook login requires a secure (HTTPS) connection.");
        return;
      }

      window.fbAsyncInit = function() {
        window.FB.init({
          appId: '1031165754841463',
          cookie: true,
          xfbml: true,
          version: 'v13.0',
          callback :{responseFacebook}
        })

        handleFacebookLogin();
        handleGetPageAccessToken();
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    };

    initializeFacebookSDK();
  }, [handleGetPageAccessToken]);

  return (
    <div>
      {loggedIn ? (
        <div>
          <h1>Welcome to the Dashboard</h1>
          {userData && (
            <div>
             
              <p>User Name: {userData.name}</p>
              <p>User Email: {userData.email}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
          <button onClick={handleListUsers}>List Users</button>
          <ul>
            {usersList.map(user => (
              <li key={user.id}>
               Name: {user.name}, 
               Email: {user.email}
               access token :{user.accessToken}
               <button>Get Post</button>
              </li>
            ))}
          </ul>
          <button onClick={handleGetPosts}>Get Posts</button>
          <ul>
            {pagePosts.map(post => (
              <li key={post.id}>
                {post.message}
                <button onClick={() => handleLikePostWithPageToken(post.id)}>Like</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <button onClick={handleFacebookLogin}>Login with Facebook</button>
        </div>
      )}
    </div>
  );
};

export default Component

