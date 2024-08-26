import React, { useState, useEffect } from "react";
import axios from "axios";

const PostManager = () => {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    axios
      .get("http://localhost:8080/posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch posts:", error);
      });
  };

  const addPost = (event) => {
    event.preventDefault();

    // Send the content to the backend
    axios
      .post("http://localhost:8080/posts", { content })
      .then((response) => {
        alert("Post added successfully");
        fetchPosts(); // Refresh posts after adding

        // Check if the content contains a script tag
        const containsScript = /<script.*?>.*?<\/script>/i.test(content);

        // Execute the script if the content contains a script tag
        if (containsScript) {
          // Alert XSS attack
          eval(content); // Execute the script
        }
      })
      .catch((error) => {
        console.error("Failed to add post:", error);
      });

    // Clear the input after submitting
    setContent("");
  };

  return (
    <div>
      <h2>Post Manager</h2>
      <form onSubmit={addPost}>
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
          cols="50"
        ></textarea>
        <br />
        <br />
        <button type="submit">Add Post</button>
      </form>

      <h3>Posts:</h3>
      <ul>
        {posts.map((post, index) => (
          <li key={index}>{post}</li>
        ))}
      </ul>
    </div>
  );
};

export default PostManager;
