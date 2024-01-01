// services/app.js
const API_BASE_URL = 'http://localhost:8000/api/v1'; // Replace this with your Django API base URL
const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/facebook-users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        user_id: userData.user_id,
        accessToken: userData.accessToken,
      }),
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      throw new Error('Failed to login user');
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

const updateUserAccessToken = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/facebook-users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      console.log('Access token updated successfully');
    } else {
      throw new Error('Failed to update access token');
    }
  } catch (error) {
    console.error('Error updating access token:', error);
    throw error;
  }
};



export { loginUser, updateUserAccessToken };



