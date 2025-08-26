import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createPost, fetchPosts, likePost } from '../../features/posts/postsSlice';
import { toast } from 'react-toastify';
import Comments from './Comments';

const Main: React.FC = () => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { posts, isLoading } = useAppSelector((state) => state.posts);

  // Fetch posts on component mount
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview('');
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && !selectedImage) {
      toast.error('Post must have content or an image');
      return;
    }

    try {
      setUploading(true);
      let mediaUrl = '';

      // Upload image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);

        const uploadResponse = await fetch('http://localhost:5265/api/v1/FileUpload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        mediaUrl = uploadData.url;
      }

      // Create post with or without image
      await dispatch(createPost({
        content: postContent,
        mediaUrl: mediaUrl || undefined,
        mediaType: selectedImage ? 'image' : undefined
      })).unwrap();

      toast.success('Post created successfully!');
      setPostContent('');
      setSelectedImage(null);
      setImagePreview('');
      setShowPostModal(false);
    } catch (err: any) {
      const errorMessage = err?.message || err || 'Failed to create post';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await dispatch(likePost(postId)).unwrap();
    } catch (err: any) {
      toast.error('Failed to like post');
    }
  };

  return (
    <Container>
      <ShareBox>
        <div>
          <img src={user?.profilePicture || '/images/user.svg'} alt="User" />
          <button type="button" onClick={() => setShowPostModal(!showPostModal)}>
            Start a post
          </button>
        </div>
        {showPostModal && (
          <PostModal>
            <textarea
              placeholder="What do you want to talk about?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            {imagePreview && (
              <ImagePreviewContainer>
                <img src={imagePreview} alt="Preview" />
                <RemoveImageButton type="button" onClick={handleRemoveImage}>
                  ✕
                </RemoveImageButton>
              </ImagePreviewContainer>
            )}
            <PostActions>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <img src="/images/photo-icon.svg" alt="Add photo" style={{ width: '20px' }} />
                <span style={{ fontSize: '14px', color: '#70b5f9' }}>Add photo</span>
              </label>
              <button onClick={handleCreatePost} disabled={isLoading || uploading}>
                {uploading ? 'Uploading...' : isLoading ? 'Posting...' : 'Post'}
              </button>
            </PostActions>
          </PostModal>
        )}
        <div>
          <button type="button" onClick={() => {
            setShowPostModal(true);
            setTimeout(() => document.getElementById('image-upload')?.click(), 100);
          }}>
            <img src="/images/photo-icon.svg" alt="Photo" />
            <span>Photo</span>
          </button>
          <button type="button">
            <img src="/images/video-icon.svg" alt="Video" />
            <span>Video</span>
          </button>
          <button type="button">
            <img src="/images/event-icon.svg" alt="Event" />
            <span>Event</span>
          </button>
          <button type="button">
            <img src="/images/article-icon.svg" alt="Article" />
            <span>Article</span>
          </button>
        </div>
      </ShareBox>
      <div>
        {isLoading && posts.length === 0 && (
          <LoadingMessage>Loading posts...</LoadingMessage>
        )}
        {!isLoading && posts.length === 0 && (
          <EmptyMessage>
            <p>No posts yet. Be the first to share something!</p>
          </EmptyMessage>
        )}
        {posts.map((post) => (
          <Article key={post.id}>
            <SharedActor>
              <div>
                <img
                  src={post.author.profilePicture || '/images/user.svg'}
                  alt="User"
                />
                <div className="infor">
                  <span>
                    {post.author.firstName} {post.author.lastName}
                  </span>
                  <span>{post.author.headline || 'Professional'}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </SharedActor>
            <Description>
              <p>{post.content}</p>
              {post.mediaUrl && (
                <ShareImg>
                  <span>
                    <img src={post.mediaUrl} alt="Post media" />
                  </span>
                </ShareImg>
              )}
              <SocialCount>
                <li>
                  <button>
                    <span className="count">{post.likesCount}</span>
                  </button>
                  <div>
                    <span>{post.commentsCount} comments - </span>
                    <span>{post.sharesCount} shares</span>
                  </div>
                </li>
              </SocialCount>
              <CommentSection>
                <button type="button" onClick={() => handleLikePost(post.id)}>
                  <img src="/images/like-icon.svg" alt="Like" />
                  <span>Like</span>
                </button>
                <button type="button">
                  <img src="/images/comment-icon.svg" alt="Comment" />
                  <span>Comment</span>
                </button>
                <button type="button">
                  <img src="/images/share-icon.svg" alt="Share" />
                  <span>Share</span>
                </button>
                <button type="button">
                  <img src="/images/send-icon.svg" alt="Send" />
                  <span>Send</span>
                </button>
              </CommentSection>
            </Description>
            <Comments postId={post.id} />
          </Article>
        ))}
      </div>
    </Container>
  );
};

// Styled components (keeping original styles)
const Container = styled.div`
  grid-area: main;
`;
const CommonCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
`;
const ShareBox = styled(CommonCard)`
  display: flex;
  flex-direction: column;
  color: #958b7b;
  margin: 0 0 8px;
  background: white;
  div {
    button {
      outline: none;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
      line-height: 1.5;
      min-height: 48px;
      background: transparent;
      display: flex;
      align-items: center;
      font-weight: 600;
      border: none;
      cursor: pointer;
    }
    &:first-child {
      display: flex;
      align-items: center;
      padding: 8px 16px 0px 16px;
      img {
        width: 48px;
        border-radius: 50%;
        margin-right: 8px;
      }
      button {
        margin: 4px 0;
        flex-grow: 1;
        border-radius: 35px;
        padding-left: 16px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        background-color: white;
        text-align: left;
      }
    }
    &:nth-child(3) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding-bottom: 4px;
      button {
        img {
          margin: 0 4px 0 -2px;
        }
        span {
          color: #70b5f9;
        }
      }
    }
  }
`;

const PostModal = styled.div`
  padding: 16px;
  textarea {
    width: 100%;
    min-height: 100px;
    padding: 8px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    font-family: inherit;
    font-size: 14px;
    resize: vertical;
    margin-bottom: 12px;
  }
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  margin-bottom: 12px;
  img {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const PostActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    padding: 8px 24px;
    background-color: #0a66c2;
    color: white;
    border: none;
    border-radius: 16px;
    font-weight: 600;
    cursor: pointer;
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

const Article = styled(CommonCard)`
  padding: 0;
  margin: 0 0 8px;
  overflow: visible;
`;
const SharedActor = styled.div`
  padding-right: 40px;
  flex-wrap: nowrap;
  padding: 12px 16px 0;
  margin-bottom: 8px;
  align-items: center;
  display: flex;
  div:not(.infor) {
    margin-right: 12px;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    text-decoration: none;
    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
    .infor {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-basis: 0;
      margin-left: 8px;
      overflow: hidden;
      span {
        text-align: left;
        &:first-child {
          font-size: 14px;
          font-weight: 700;
          color: rgba(0, 0, 0, 1);
        }
        &:nth-child(n + 1) {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }
  }
`;
const Description = styled.div`
  padding: 0 16px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  text-align: left;
`;
const ShareImg = styled.div`
  margin-top: 8px;
  width: 100%;
  display: block;
  position: relative;
  background-color: #f9fafb;
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`;
const SocialCount = styled.ul`
  list-style: none;
  line-height: 1.3;
  align-items: flex-start;
  overflow: auto;
  margin: 0 16px;
  padding: 8px 0;
  border-bottom: 1px solid #e9e5df;
  li {
    margin-right: 5px;
    font-size: 12px;
    position: relative;
    display: flex;
    justify-content: space-between;
    button {
      display: flex;
      border: none;
      background-color: transparent;
    }
    div {
      display: flex;
      align-items: flex-end;
      gap: 4px;
    }
    .count {
      color: rgba(0, 0, 0, 0.6);
      font-size: 12px;
    }
  }
`;
const CommentSection = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background: none;
    margin: 5px;
    padding: 10px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      background-color: lightgray;
      transition: 507ms;
      border-radius: 10px;
    }
  }
  @media (min-width: 768px) {
    span {
      margin-left: 8px;
    }
    button {
      display: flex;
      gap: 2px;
    }
  }
`;

const LoadingMessage = styled(CommonCard)`
  padding: 40px;
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
  font-size: 16px;
`;

const EmptyMessage = styled(CommonCard)`
  padding: 40px;
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
  p {
    font-size: 16px;
    margin: 0;
  }
`;

export default Main;
