import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = ({ user, onLogout }) => {
  const [adminPagePosts, setAdminPagePosts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [likedUsers, setLikedUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // State to control the popup display
  const API_BASE_URL = "http://localhost:8000/api/v1";
  const PAGE_ID = "112883111853596";

  const fetchPagePosts = async () => {
    try {
      const PAGE_ACCESS_TOKEN = "EAAEi71wYRRsBO2kWiQ1AZCxaO4DgVDwGTzHZAqhK2fuyc5bjISLGLhhxnl4TQv6HthBuZCtL4496hBcGcGDVndGz6QLZCqZB5gNYaSMgNQ5JFyJYXEfDwCv5I5ss7szKxko9jqkUMBlpv8buNTlEeUTlZCe3e9azpW65eoEmmEZCm64C8uBfHNZCBOeRe1CvzZA5mmJYvKHkKZA13JvU1Poq41b4pkgznMzLEZAa0ln5CsZD";

      const response = await axios.get(
        `https://graph.facebook.com/v18.0/${PAGE_ID}/posts`,
        {
          params: {
            access_token: PAGE_ACCESS_TOKEN,
            fields: "id,message,created_time",
          },
        }
      );

      setUserPosts(response.data.data);
    } catch (error) {
      console.error("Error fetching page posts:", error);
    }
  };

  const fetchUsersList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/active-users/`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        const usersWithAccessToken = response.data.filter(
          (userItem) => userItem.accessToken
        );
        setUsersList(usersWithAccessToken);
      } else {
        console.error("Invalid user data structure received:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchUsersWhoLikedPost = async (postId) => {
    try {
      const PAGE_ACCESS_TOKEN = "EAAEi71wYRRsBO2kWiQ1AZCxaO4DgVDwGTzHZAqhK2fuyc5bjISLGLhhxnl4TQv6HthBuZCtL4496hBcGcGDVndGz6QLZCqZB5gNYaSMgNQ5JFyJYXEfDwCv5I5ss7szKxko9jqkUMBlpv8buNTlEeUTlZCe3e9azpW65eoEmmEZCm64C8uBfHNZCBOeRe1CvzZA5mmJYvKHkKZA13JvU1Poq41b4pkgznMzLEZAa0ln5CsZD";

      const response = await axios.get(
        `https://graph.facebook.com/v18.0/${postId}/likes`,
        {
          params: {
            access_token: PAGE_ACCESS_TOKEN,
          },
        }
      );

      setLikedUsers(response.data.data);
      setShowPopup(true); // Show the popup
    } catch (error) {
      console.error("Error fetching users who liked the post:", error);
    }
  };

  useEffect(() => {
    fetchPagePosts();
    fetchUsersList();
  }, []);

  return (
    <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>

    <h2 className="text-2xl font-semibold mb-2">Admin Page Posts:</h2>
    {userPosts.map((post) => (
      <div key={post.id} className="mb-4">
        <p className="mb-1">{post.message}</p>
        <p className="text-gray-500">{post.created_time}</p>

        <button
          className="bg-blue-600 text-white px-2 py-1 mt-2 rounded"
          onClick={() => fetchUsersWhoLikedPost(post.id)}
        >
          Users who liked this post
        </button>
      </div>
    ))}

    {showPopup && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg w-80">
          <div className="flex justify-end">
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={() => setShowPopup(false)}
            >
              &#10005;
            </button>
          </div>
          <h2 className="text-xl font-semibold mb-4">
            Users who liked this post:
          </h2>
          <ul>
            {likedUsers.map((likedUser) => (
              <li key={likedUser.id}>{likedUser.name}</li>
            ))}
          </ul>
        </div>
      </div>
    )}

    <button
      className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-lg"
      onClick={onLogout}
    >
      Logout
    </button>
  </div>
  );
};

export default Dashboard;
