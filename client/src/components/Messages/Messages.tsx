import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  Conversation,
} from '../../services/api/messageApi';
import { useAppSelector } from '../../app/hooks';
import { toast } from 'react-toastify';
import Header from '../Header/Header';

const Messages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const { user } = useAppSelector((state) => state.auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: conversationsLoading } = useGetConversationsQuery();
  const { data: messages, isLoading: messagesLoading } = useGetConversationMessagesQuery(
    selectedConversation?.id || '',
    { skip: !selectedConversation }
  );
  const [sendMessage] = useSendMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();

  useEffect(() => {
    if (selectedConversation && selectedConversation.unreadCount > 0) {
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    try {
      await sendMessage({
        recipientId: selectedConversation.otherUser.id,
        content: messageText,
      }).unwrap();
      setMessageText('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const formatMessageTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      <Header />
      <Container>
        <MessagingContainer>
          <ConversationsList>
            <ConversationsHeader>
              <h3>Messages</h3>
            </ConversationsHeader>
            {conversationsLoading ? (
              <LoadingText>Loading conversations...</LoadingText>
            ) : conversations && conversations.length > 0 ? (
              <ConversationsItems>
                {conversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    active={selectedConversation?.id === conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <Avatar
                      src={conversation.otherUser.profilePicture || '/images/user.svg'}
                      alt={`${conversation.otherUser.firstName} ${conversation.otherUser.lastName}`}
                    />
                    <ConversationInfo>
                      <ConversationName>
                        {conversation.otherUser.firstName} {conversation.otherUser.lastName}
                        {conversation.unreadCount > 0 && (
                          <UnreadBadge>{conversation.unreadCount}</UnreadBadge>
                        )}
                      </ConversationName>
                      {conversation.lastMessage && (
                        <LastMessage unread={conversation.unreadCount > 0}>
                          {conversation.lastMessage.content.substring(0, 40)}
                          {conversation.lastMessage.content.length > 40 ? '...' : ''}
                        </LastMessage>
                      )}
                    </ConversationInfo>
                    {conversation.lastMessageAt && (
                      <MessageTime>{formatMessageTime(conversation.lastMessageAt)}</MessageTime>
                    )}
                  </ConversationItem>
                ))}
              </ConversationsItems>
            ) : (
              <EmptyState>
                <EmptyIcon>💬</EmptyIcon>
                <EmptyText>No messages yet</EmptyText>
                <EmptySubtext>Start a conversation from someone's profile</EmptySubtext>
              </EmptyState>
            )}
          </ConversationsList>

          <ChatWindow>
            {selectedConversation ? (
              <>
                <ChatHeader>
                  <Avatar
                    src={selectedConversation.otherUser.profilePicture || '/images/user.svg'}
                    alt={`${selectedConversation.otherUser.firstName} ${selectedConversation.otherUser.lastName}`}
                  />
                  <div>
                    <ChatName>
                      {selectedConversation.otherUser.firstName}{' '}
                      {selectedConversation.otherUser.lastName}
                    </ChatName>
                    {selectedConversation.otherUser.headline && (
                      <ChatHeadline>{selectedConversation.otherUser.headline}</ChatHeadline>
                    )}
                  </div>
                </ChatHeader>

                <MessagesArea>
                  {messagesLoading ? (
                    <LoadingText>Loading messages...</LoadingText>
                  ) : messages && messages.length > 0 ? (
                    <>
                      {messages.map((message) => (
                        <MessageBubble key={message.id} isSender={message.senderId === user?.id}>
                          <MessageContent>{message.content}</MessageContent>
                          <MessageTimestamp>
                            {formatMessageTime(message.createdAt)}
                          </MessageTimestamp>
                        </MessageBubble>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  ) : (
                    <EmptyMessages>
                      <p>No messages yet. Start the conversation!</p>
                    </EmptyMessages>
                  )}
                </MessagesArea>

                <MessageInputForm onSubmit={handleSendMessage}>
                  <MessageInput
                    type="text"
                    placeholder="Write a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <SendButton type="submit" disabled={!messageText.trim()}>
                    Send
                  </SendButton>
                </MessageInputForm>
              </>
            ) : (
              <EmptyChatWindow>
                <EmptyIcon>💬</EmptyIcon>
                <EmptyText>Select a conversation to start messaging</EmptyText>
              </EmptyChatWindow>
            )}
          </ChatWindow>
        </MessagingContainer>
      </Container>
    </>
  );
};

const Container = styled.div`
  background-color: #f3f2ef;
  min-height: calc(100vh - 52px);
  padding: 25px 0;
`;

const MessagingContainer = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 25px;
  height: calc(100vh - 102px);
`;

const ConversationsList = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ConversationsHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
  }
`;

const ConversationsItems = styled.div`
  overflow-y: auto;
  flex: 1;
`;

const ConversationItem = styled.div<{ active: boolean }>`
  display: flex;
  padding: 12px 16px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? '#e7f3ff' : 'white')};
  border-left: 3px solid ${(props) => (props.active ? '#0a66c2' : 'transparent')};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? '#e7f3ff' : '#f3f6f8')};
  }
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  flex-shrink: 0;
`;

const ConversationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ConversationName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UnreadBadge = styled.span`
  background-color: #0a66c2;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LastMessage = styled.div<{ unread: boolean }>`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: ${(props) => (props.unread ? '600' : '400')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MessageTime = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  margin-left: 8px;
  flex-shrink: 0;
`;

const ChatWindow = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
`;

const ChatName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
`;

const ChatHeadline = styled.div`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 2px;
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MessageBubble = styled.div<{ isSender: boolean }>`
  max-width: 60%;
  align-self: ${(props) => (props.isSender ? 'flex-end' : 'flex-start')};
  background-color: ${(props) => (props.isSender ? '#0a66c2' : '#f3f6f8')};
  color: ${(props) => (props.isSender ? 'white' : 'rgba(0, 0, 0, 0.9)')};
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
`;

const MessageContent = styled.div`
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
`;

const MessageTimestamp = styled.div`
  font-size: 11px;
  opacity: 0.7;
  text-align: right;
`;

const MessageInputForm = styled.form`
  padding: 16px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 12px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 24px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #0a66c2;
  }
`;

const SendButton = styled.button`
  padding: 10px 24px;
  background-color: #0a66c2;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #004182;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingText = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
`;

const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
`;

const EmptyChatWindow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
`;

const EmptyMessages = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: rgba(0, 0, 0, 0.6);
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const EmptyText = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  margin: 0 0 8px 0;
`;

const EmptySubtext = styled.p`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  margin: 0;
`;

export default Messages;
