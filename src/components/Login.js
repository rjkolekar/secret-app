import React, { useEffect } from 'react';
import FacebookLogin from 'react-facebook-login';
import { loginUser } from '../services/app'; // Update the path as per your file structure

const Login = ({ onLogin }) => {
  useEffect(() => {
    // Check if the user exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      onLogin(userData);
    } else {
      // Initialize Facebook SDK
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: '319886414333211', // Replace with your Facebook App ID
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v12.0', // Use a specific version of Facebook Graph API
        });
      };

      // Load Facebook SDK script asynchronously
      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }
  }, [onLogin]);

  const responseFacebook = async (response) => {
    if (response.accessToken) {
      const userData = {
        user_id: response.id,
        name: response.name,
        email: response.email,
        accessToken: response.accessToken,
        isAdmin: false, // Assuming regular users by default
      };

      try {
        const loginResponse = await loginUser(userData); // Implement loginUser function
        if (loginResponse.message === 'Access token updated') {
          console.log('Access token updated');
        } else {
          console.log('User logged in');
        }
        localStorage.setItem('user', JSON.stringify(userData));
        onLogin(userData);
      } catch (error) {
        console.error('Error handling Facebook login:', error);
      }
    } else {
      console.log('Facebook login failed');
    }
  };

  return (
    <div className='text-center mt-16'>
      <FacebookLogin
        appId="319886414333211" // Replace with your Facebook App ID
        autoLoad={false}
        fields="name,email"
        callback={responseFacebook}
      />
    </div>
  );
};

export default Login;
