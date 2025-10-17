import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllPosts, togglePostLike } from '../../services/postService';

const AppPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { user } = useAuth();
  const postsPerPage = 10; // Number of posts to load at once
  const [expandedPosts, setExpandedPosts] = useState({});
  const POST_PREVIEW_CHAR_LIMIT = 200;

  const fetchPosts = useCallback(async (append = false) => {
    try {
      setError(null);
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      // Added a small delay to show loading state (can be removed in production)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Calculate skip based on current posts length
      const skip = append ? posts.length : 0;
      const data = await getAllPosts(skip, postsPerPage);
      console.log('data', data);
      if (append) {
        setPosts(prev => [...prev, ...(data.posts || [])]);
      } else {
        setPosts(data.posts || []);
      }
      
      // Use the hasMore value from the backend response
      setHasMore(!!data.hasMore);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error.message || 'Failed to load posts. Please try again later.');
      if (!append) setPosts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [posts.length, postsPerPage]);

  useEffect(() => {
    fetchPosts(false);
  }, [fetchPosts]);

  const loadMorePosts = () => {
    if (loadingMore || !hasMore) return;
    fetchPosts(true);
  };

  // Add scroll event listener for infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled to bottom of the page
      if (
        window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 200 &&
        !loadingMore && 
        hasMore
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, loadMorePosts]);

  const handleLike = async (postId) => {
    if (!user) {
      setError('Please log in to like posts');
      return;
    }
    
    // Optimistic UI update
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === postId
          ? { ...post, likes: [...(post.likes || []), user?._id], likeInProgress: true }
          : post
      )
    );
    
    try {
      const data = await togglePostLike(postId);
      
      // Update with server data
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? { ...post, likes: data.post.likes, likeInProgress: false }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert on error
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? { 
                ...post, 
                likes: (post.likes || []).filter(id => id !== user?._id),
                likeInProgress: false 
              }
            : post
        )
      );
      setError(`Failed to like post: ${error.message}`);
    }
  };

  const handleUnlike = async (postId) => {
    if (!user) {
      setError('Please log in to unlike posts');
      return;
    }
    
    // Optimistic UI update: remove like
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === postId
          ? { 
              ...post, 
              likes: (post.likes || []).filter(like => !(like === user?._id || (like._id && like._id === user?._id) || (like.toString && like.toString() === user?._id))),
              likeInProgress: true 
            }
          : post
      )
    );
    
    try {
      // Using the same endpoint as like since the backend toggles the like status
      const data = await togglePostLike(postId);
      
      // Update with server data
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? { ...post, likes: data.post.likes, likeInProgress: false }
            : post
        )
      );
    } catch (error) {
      console.error('Error unliking post:', error);
      // Revert on error
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? { 
                ...post, 
                likes: [...(post.likes || []), user?._id],
                likeInProgress: false 
              }
            : post
        )
      );
      setError(`Failed to unlike post: ${error.message}`);
    }
  };

  return (
    <section className="posts-section">
      <div className="posts-header mb-10 px-4 md:px-12">
        <h2 className="posts-title">Community Posts</h2>
        <div className="posts-title-underline posts-title-underline-animated"></div>
        <div className="posts-subheading">Discover thoughts, insights, and stories from our talented poets and performers</div>
      </div>
      <div className="events-tile-header-divider"></div>
      
      {error && (
        <div className="max-w-4xl mx-auto px-4 md:px-0 mb-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError(null)}
                    className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto px-4 md:px-0">
        {loading && posts.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : posts.length === 0 && !loading ? (
          <div className="text-center py-20">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No posts found</h3>
            <p className="mt-1 text-sm text-gray-500">Be the first to share your thoughts with the community.</p>
          </div>
        ) : (
          <div className="posts-grid space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="post-card group relative overflow-hidden p-0 border border-[#e0e7ff] rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300">
                <div className="post-accent-bar"></div>
                <div className="p-6 md:p-8">
                  <div className="post-header flex items-center gap-4 mb-4">
                    <img
                      src={post.author?.profilePhoto || 'https://randomuser.me/api/portraits/men/32.jpg'}
                      alt={post.author?.name || 'Unknown Author'}
                      className="post-author-photo w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                    />
                    <div className="flex-1">
                      <h3 className="post-author-name font-semibold text-indigo-800">{post.author?.name || 'Unknown Author'}</h3>
                      <p className="post-date text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  
                  <h4 className="post-title text-xl font-bold text-gray-800 mb-3">{post.heading}</h4>

                  <p className="post-content text-gray-600 leading-relaxed mb-2 whitespace-pre-wrap break-words">
                    {expandedPosts[post._id] ? (post.content || '') : (post.content || '').slice(0, POST_PREVIEW_CHAR_LIMIT)}
                    {((post.content || '').length > POST_PREVIEW_CHAR_LIMIT && !expandedPosts[post._id]) ? '…' : ''}
                  </p>
                  {((post.content || '').length > POST_PREVIEW_CHAR_LIMIT) && (
                    <div className="mb-4">
                      <button 
                        className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium rounded-full transition-colors text-sm"
                        onClick={() => setExpandedPosts(prev => ({...prev, [post._id]: !prev[post._id]}))}
                      >
                        {expandedPosts[post._id] ? 'Show less' : 'Read more'}
                      </button>
                    </div>
                  )}
                  
                  <div className="post-tags flex flex-wrap gap-2 mb-4">
                    {post.tags?.map((tag) => (
                      <span key={tag} className="post-tag bg-indigo-100 text-indigo-700 font-medium px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="post-actions flex items-center gap-6 text-sm text-gray-500">
                    <button 
                      className={`post-action flex items-center gap-2 ${post.likes?.some(like => like === user?._id || (like._id && like._id === user?._id) || (like.toString && like.toString() === user?._id)) ? 'text-indigo-600' : 'hover:text-indigo-600'} transition-colors ${post.likeInProgress ? 'opacity-50 cursor-wait' : ''}`}
                      onClick={() => post.likes?.some(like => like === user?._id || (like._id && like._id === user?._id) || (like.toString && like.toString() === user?._id)) ? handleUnlike(post._id) : handleLike(post._id)}
                      disabled={post.likeInProgress || !user}
                      title={!user ? "Please log in to like posts" : ""}
                    >
                      <svg className="w-4 h-4" fill={post.likes?.some(like => like === user?._id || (like._id && like._id === user?._id) || (like.toString && like.toString() === user?._id)) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {post.likes?.length || 0}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {loadingMore && (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            )}
            
            {hasMore && !loadingMore && (
              <div className="flex justify-center py-6">
                <button 
                  onClick={loadMorePosts}
                  className="px-6 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium rounded-full transition-colors"
                >
                  Load More Posts
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .posts-section {
          background: #f8fafc;
          padding-top: 4.5rem;
          padding-bottom: 4.5rem;
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }
        .posts-header {
          margin: 0 auto 2.5rem auto;
          text-align: left;
        }
        .posts-title {
          font-size: 2.3rem;
          font-weight: 800;
          color: #232046;
          letter-spacing: -0.01em;
        }
        .posts-title-underline {
          width: 120px;
          height: 4px;
          background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
          border-radius: 2px;
          margin-bottom: 1.2rem;
          margin-top: 0.1rem;
          box-shadow: 0 2px 12px #6366f144;
          border: 1.5px solid rgba(255,255,255,0.35);
        }
        .posts-title-underline-animated {
          transform: scaleX(0);
          transform-origin: left;
          animation: postsUnderlineGrow 1.1s cubic-bezier(0.4,0,0.2,1) 0.2s forwards;
        }
        @keyframes postsUnderlineGrow {
          0% {
            transform: scaleX(0);
            opacity: 0.2;
          }
          60% {
            opacity: 1;
          }
          100% {
            transform: scaleX(1);
            opacity: 1;
          }
        }
        .posts-subheading {
          color: #6366f1;
          font-size: 1.13rem;
          font-weight: 400;
          line-height: 1.7;
          margin-bottom: 1.2rem;
          max-width: 540px;
          letter-spacing: 0.01em;
        }
        .events-tile-header-divider {
          max-width: 1600px;
          margin: 0 auto 2.5rem auto;
          height: 1.5px;
          background: linear-gradient(90deg, #e0e7ff 0%, #6366f1 50%, #e0e7ff 100%);
          opacity: 0.18;
          border-radius: 1px;
        }
        .post-card {
          background: linear-gradient(120deg, #fff 80%, #f1f5ff 100%);
          border-radius: 1.5rem;
          box-shadow: 0 2px 12px #6366f111;
          transition: box-shadow 0.18s, transform 0.18s, border 0.18s;
          border: 1.5px solid #e0e7ff;
          position: relative;
        }
        .post-card:hover, .post-card:focus-within {
          box-shadow: 0 8px 32px #6366f144;
          border-color: #6366f1;
          // transform: translateY(-4px) scale(1.02);
        }
        .post-accent-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);
          z-index: 2;
        }
        .post-image-container {
          position: relative;
          overflow: hidden;
          border-radius: 0.5rem;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
          max-height: 300px;
        }
        .post-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .post-image-container:hover img {
          transform: scale(1.05);
        }
        .post-author-photo {
          width: 3rem;
          height: 3rem;
          object-fit: cover;
          border-radius: 50%;
          border: 2px solid #e0e7ff;
          box-shadow: 0 2px 8px #6366f122;
        }
        .post-author-name {
          color: #232046;
          font-size: 1.1rem;
          font-weight: 600;
        }
        .post-date {
          color: #6b7280;
          font-size: 0.9rem;
        }
        .post-title {
          color: #232046;
          font-size: 1.3rem;
          font-weight: 700;
        }
        .post-content {
          color: #6366f1;
          font-size: 1.01rem;
          font-weight: 400;
          line-height: 1.6;
        }
        .post-tag {
          background: #eef2ff;
          color: #6366f1;
          font-weight: 600;
          border-radius: 1rem;
          padding: 0.3rem 1.1rem;
          font-size: 0.93rem;
          letter-spacing: 0.01em;
          box-shadow: 0 1px 4px #6366f111;
        }
        .post-action {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #6b7280;
          transition: color 0.2s ease;
        }
        .post-action:hover:not(:disabled) {
          color: #6366f1;
        }
        .post-action:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default AppPosts;