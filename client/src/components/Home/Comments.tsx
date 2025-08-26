import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { postsApi } from '../../services/api/postsApi';
import { toast } from 'react-toastify';
import type { Comment } from '../../../../shared/types/post.types';
import { useAppSelector } from '../../app/hooks';

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await postsApi.getComments(postId);
      setComments(data);
    } catch (err) {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const newComment = await postsApi.addComment(postId, commentText);
      setComments([newComment, ...comments]);
      setCommentText('');
      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  return (
    <Container>
      <ToggleButton type="button" onClick={() => setShowComments(!showComments)}>
        {showComments ? 'Hide comments' : `View comments (${comments.length})`}
      </ToggleButton>

      {showComments && (
        <>
          <CommentInput>
            <img src={user?.profilePicture || '/images/user.svg'} alt="You" />
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddComment();
                }
              }}
            />
            <button type="button" onClick={handleAddComment} disabled={!commentText.trim()}>
              Post
            </button>
          </CommentInput>

          {loading && <LoadingText>Loading comments...</LoadingText>}

          <CommentsList>
            {comments.map((comment) => (
              <CommentItem key={comment.id}>
                <CommentAvatar>
                  <img src={comment.author.profilePicture || '/images/user.svg'} alt={comment.author.firstName} />
                </CommentAvatar>
                <CommentContent>
                  <CommentHeader>
                    <span className="author">{comment.author.firstName} {comment.author.lastName}</span>
                    {comment.author.headline && <span className="headline">{comment.author.headline}</span>}
                  </CommentHeader>
                  <CommentText>{comment.content}</CommentText>
                  <CommentFooter>
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </CommentFooter>
                </CommentContent>
              </CommentItem>
            ))}
          </CommentsList>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 12px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 0;
  &:hover {
    color: rgba(0, 0, 0, 0.9);
  }
`;

const CommentInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
  padding: 8px 0;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  input {
    flex: 1;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 14px;
    outline: none;

    &:focus {
      border-color: #0a66c2;
    }
  }

  button {
    background: #0a66c2;
    color: white;
    border: none;
    border-radius: 16px;
    padding: 6px 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background: #004182;
    }
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 16px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 8px;
`;

const CommentAvatar = styled.div`
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
`;

const CommentContent = styled.div`
  flex: 1;
  background: #f2f2f2;
  border-radius: 8px;
  padding: 8px 12px;
`;

const CommentHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 4px;

  .author {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
  }

  .headline {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
  }
`;

const CommentText = styled.p`
  margin: 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  line-height: 1.4;
`;

const CommentFooter = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
`;

export default Comments;
