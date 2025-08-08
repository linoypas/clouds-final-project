import React, { useState } from 'react';
import styles from '../../styles/AiPosts.module.css';

const AiPosts = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`https://localhost:443/posts/getAi?prompt=${encodeURIComponent(query)}`);
      const data = await response.json();
      console.log("Fetched images:", data.urls);
      if (!response.ok || !data.urls || !Array.isArray(data.urls) || data.urls.length === 0) {
        throw new Error('Failed to fetch posts or no images returned');
      }
      setResults(data.urls);
    } catch (err) {
      console.error('Error searching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>AI Posts</h2>
        <form onSubmit={handleSearchSubmit} className={styles.form}>
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="What's on your mind?"
            className={styles.input}
          />
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Loading...' : 'Post'}
          </button>
        </form>

        <div className={styles.imageContainer}>
          {results.length > 0 ? (
            results.map((result, index) => (
              <div key={index} className={styles.imageWrapper}>
                <img src={result} alt={`Post ${index}`} className={styles.image} />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No posts yet. Start by searching!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiPosts;
