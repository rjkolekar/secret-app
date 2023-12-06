import React from 'react';

const YourComponent = () => {
  // Function to initialize Facebook SDK
  const initializeFacebookSDK = () => {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: 888977032574831,
        cookie: true,
        xfbml: true,
        version: 'v13.0' // Use the version you need
      });
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  };

  // Function to handle Facebook login
  const handleFacebookLogin = () => {
    window.FB.login(function(response) {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        console.log('Access token:', accessToken);
        
        // Use the access token to make further API calls or fetch user data
        window.FB.api('/me', { fields: 'id,name,email' }, function(user) {
          console.log('User data:', user);
          // Handle the user data as needed (e.g., signup or authentication)
        });
      } else {
        console.log('User cancelled login or did not authorize.');
      }
    }, { scope: 'email' }); // Specify required permissions
  };

  // Initialize the Facebook SDK when the component mounts
  React.useEffect(() => {
    initializeFacebookSDK();
  }, []);

  return (
    <div>
      <button onClick={handleFacebookLogin}>Login with Facebook</button>
    </div>
  );
};

export default YourComponent;
