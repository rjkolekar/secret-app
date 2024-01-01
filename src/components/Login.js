import React, { useEffect } from 'react';
import FacebookLogin from 'react-facebook-login';
import { loginUser } from '../services/app'; // Adjust the path as per your file structure

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
          appId: '1360178111551860',
          cookie: true,
          xfbml: true,
          version: 'v18.0',
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
      console.log('Access Token:', response.accessToken);
      const userData = {
        user_id: response.id,
        name: response.name,
        email: response.email,
        accessToken: response.accessToken,
        isAdmin: false, // Assuming regular users by default
      };

      try {
        const loginResponse = await loginUser(userData);
        if (loginResponse.message === 'Access token updated') {
          console.log('Access token updated');
        } else {
          console.log('User logged in');
        }
        // Store user data in localStorage
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
        appId="1360178111551860"
        autoLoad={false}
        fields="name,email"
        callback={responseFacebook}
      />
    </div>
  );
};

export default Login;
