import React, { useState, useEffect } from 'react';
import FacebookLogin from 'react-facebook-login';

const Login = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // Initialize Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '888977032574831', // Replace with your Facebook App ID
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v18.0' // Specify the correct version here
      });
    };

    // Load the SDK asynchronously
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  const responseFacebook = (response) => {
    if (response.accessToken) {
      setUserData(response);
      setLoggedIn(true);

      // Check if the user exists before making a POST request
      fetch(`http://localhost:8000/api/v1/active-users/?user_id=${response.userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            // User exists, update the access token
            updateAccessToken(response);
          } else {
            // User doesn't exist, register a new user
            registerUser(response);
          }
        })
        .catch((error) => {
          console.error('API call error:', error);
          // Handle API call error
        });
    } else {
      // Handle login failure or cancellation
      console.log('Login failed');
    }
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
        email: userData.email,
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

  const handleLogout = () => {
    setLoggedIn(false);
    setUserData({});
    // Perform any additional logout tasks if needed
  };

  return (
    <div>
      {loggedIn ? (
        <div>
          <h2>Welcome, {userData.name}!</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <FacebookLogin
          appId="888977032574831"
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
          onFailure={(error) => console.log(error)}
          version="v18.0" // Specify the correct version here
        />
      )}
    </div>
  );
};

export default Login;
