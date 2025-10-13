import React, { useState, useEffect, useCallback } from 'react';

// Sample stories data
const storiesData = [
  {
    id: 1,
    username: "travel_lover"
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c28c?w=150&h=150&fit=crop&crop=face",
    stories: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=600&fit=crop"
    ]
  },
  {
    id: 2,
    username: "food_enthusiast",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    stories: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=600&fit=crop"
    ]
  },
  {
    id: 3,
    username: "city_explorer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    stories: [
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop"
    ]
  },
  {
    id: 4,
    username: "nature_photographer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    stories: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop"
    ]
  },
  {
    id: 5,
    username: "fitness_guru",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    stories: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop"
    ]
  }
];

const InstagramStories = () => {
  // Main state
  const [currentUserIndex, setCurrentUserIndex] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = currentUserIndex !== null ? storiesData[currentUserIndex] : null;
  const totalStories = currentUser ? currentUser.stories.length : 0;

  // Auto-advance stories
  useEffect(() => {
    if (currentUser && !isPaused) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            // Move to next story
            if (currentStoryIndex < totalStories - 1) {
              setCurrentStoryIndex(prev => prev + 1);
              return 0;
            } else {
              // Move to next user or close
              if (currentUserIndex < storiesData.length - 1) {
                setCurrentUserIndex(prev => prev + 1);
                setCurrentStoryIndex(0);
                return 0;
              } else {
                // Close stories
                closeStories();
                return 0;
              }
            }
          }
          return prev + 2; // 100% / 50 intervals = 2% per 100ms = 5 seconds total
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentUser, currentStoryIndex, isPaused, currentUserIndex, totalStories]);

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
  }, [currentStoryIndex, currentUserIndex]);

  const openStory = useCallback((userIndex) => {
    setIsLoading(true);
    setCurrentUserIndex(userIndex);
    setCurrentStoryIndex(0);
    setProgress(0);
    setIsPaused(false);
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  const closeStories = useCallback(() => {
    setCurrentUserIndex(null);
    setCurrentStoryIndex(0);
    setProgress(0);
    setIsPaused(false);
  }, []);

  const goToPrevious = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(prev => prev - 1);
      setCurrentStoryIndex(storiesData[currentUserIndex - 1].stories.length - 1);
      setProgress(0);
    }
  }, [currentStoryIndex, currentUserIndex]);

  const goToNext = useCallback(() => {
    if (currentStoryIndex < totalStories - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else if (currentUserIndex < storiesData.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
    } else {
      closeStories();
    }
  }, [currentStoryIndex, totalStories, currentUserIndex]);

  const handleStoryClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    if (x < width / 2) {
      goToPrevious();
    } else {
      goToNext();
    }
  }, [goToPrevious, goToNext]);

  return (
    <div style={styles.app}>
      {/* Stories List */}
      {currentUserIndex === null && (
        <div style={styles.storiesList}>
          <h1 style={styles.title}>Stories</h1>
          <div style={styles.scrollContainer}>
            <div style={styles.avatarsContainer}>
              {storiesData.map((user, index) => (
                <div
                  key={user.id}
                  style={styles.avatarWrapper}
                  onClick={() => openStory(index)}
                >
                  <div style={styles.avatarRing}>
                    <img
                      src={user.avatar}
                      alt={user.username}
                      style={styles.avatarImage}
                    />
                  </div>
                  <p style={styles.username}>
                    {user.username}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer */}
      {currentUser && (
        <div style={styles.storyViewer}>
          {/* Loading State */}
          {isLoading && (
            <div style={styles.loadingOverlay}>
              <div style={styles.spinner}></div>
            </div>
          )}
          
          {/* Progress Bars */}
          <div style={styles.progressContainer}>
            {currentUser.stories.map((_, index) => (
              <div key={index} style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: index < currentStoryIndex ? '100%' : 
                           index === currentStoryIndex ? `${progress}%` : '0%'
                  }}
                ></div>
              </div>
            ))}
          </div>

          {/* Header */}
          <div style={styles.header}>
            <div style={styles.userInfo}>
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                style={styles.headerAvatar}
              />
              <span style={styles.headerUsername}>
                {currentUser.username}
              </span>
            </div>
            <button
              onClick={closeStories}
              style={styles.closeButton}
            >
              ×
            </button>
          </div>

          {/* Story Content */}
          <div style={styles.storyContent}>
            <div
              style={styles.storyImageContainer}
              onClick={handleStoryClick}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              <img
                src={currentUser.stories[currentStoryIndex]}
                alt="Story"
                style={styles.storyImage}
                draggable={false}
              />
            </div>

            {/* Navigation Areas */}
            <div style={styles.navigationAreas}>
              <div 
                style={styles.navLeft}
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
              ></div>
              <div 
                style={styles.navRight}
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// All styles in a single object
const styles = {
  app: {
    width: '100%',
    maxWidth: '428px',
    margin: '0 auto',
    backgroundColor: '#000',
    minHeight: '100vh',
    position: 'relative',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  storiesList: {
    padding: '1rem',
    color: 'white'
  },
  title: {
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    margin: '0 0 1rem 0'
  },
  scrollContainer: {
    overflowX: 'auto',
    paddingBottom: '1rem',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none'
  },
  avatarsContainer: {
    display: 'flex',
    gap: '0.75rem'
  },
  avatarWrapper: {
    flexShrink: 0,
    cursor: 'pointer',
    width: '64px'
  },
  avatarRing: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    padding: '2px',
    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #000'
  },
  username: {
    color: 'white',
    fontSize: '0.75rem',
    margin: '0.25rem 0 0 0',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '64px'
  },
  storyViewer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    zIndex: 10
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '2px solid white',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  progressContainer: {
    display: 'flex',
    gap: '0.25rem',
    padding: '0.75rem',
    paddingTop: '1.5rem'
  },
  progressBar: {
    flex: 1,
    height: '2px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '1px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    transition: 'width 0.1s linear'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem',
    paddingBottom: 0
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    flex: 1
  },
  headerAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  headerUsername: {
    color: 'white',
    marginLeft: '0.75rem',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  closeButton: {
    color: 'white',
    fontSize: '1.5rem',
    lineHeight: 1,
    padding: '0.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  storyContent: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden'
  },
  storyImageContainer: {
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    userSelect: 'none'
  },
  storyImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    pointerEvents: 'none'
  },
  navigationAreas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex'
  },
  navLeft: {
    width: '50%',
    height: '100%',
    cursor: 'pointer'
  },
  navRight: {
    width: '50%',
    height: '100%',
    cursor: 'pointer'
  }
};

// Add CSS animation keyframes
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .stories-scroll-container::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 480px) {
    .app {
      max-width: 100%;
    }
  }
`;
document.head.appendChild(styleSheet);

export default InstagramStories;
