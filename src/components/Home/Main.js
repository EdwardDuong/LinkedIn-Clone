import React from "react";
import styled from "styled-components";

const Main = (props) => {
  return (
    <Container>
      <ShareBox>
        <div>
          <img src="/images/user.svg" alt="" />
          <button>Start a post</button>
        </div>
        <div>
          <button>
            <img src="/images/photo-icon.svg" alt="" />
            <span>Photo</span>
          </button>
          <button>
            <img src="/images/video-icon.svg" alt="" />
            <span>Video</span>
          </button>
          <button>
            <img src="/images/event-icon.svg" alt="" />
            <span>Event</span>
          </button>
          <button>
            <img src="/images/article-icon.svg" alt="" />
            <span>Article</span>
          </button>
        </div>
      </ShareBox>
      <div>
        <Article>
          <SharedActor>
            <div>
              <img src="/images/user.svg" alt="" />
              <div className="infor">
                <span>title</span>
                <span>infor</span>
                <span>date</span>
              </div>
            </div>
            <div>
              <button>
                <img src="/images/plus-icon.svg" alt="" />
                <span>Follow</span>
              </button>
              <button>
                <img src="/images/ellipsis.svg" alt="" />
              </button>
            </div>
          </SharedActor>
          <Description>
            <ShareImg>
              <span>
                <img
                  src="https://static-exp1.licdn.com/scds/common/u/images/promo/ads/li_evergreen_jobs_ad_300x250_v1.jpg"
                  alt=""
                />
              </span>
            </ShareImg>
            <SocialCount>
              <li>
                <button>
                  <img
                    src="https://static-exp1.licdn.com/sc/h/8ekq8gho1ruaf8i7f86vd1ftt"
                    alt=""
                  />
                  <img
                    src="https://static-exp1.licdn.com/sc/h/b1dl5jk88euc7e9ri50xy5qo8"
                    alt=""
                  />
                  <img
                    src="https://static-exp1.licdn.com/sc/h/cpho5fghnpme8epox8rdcds22"
                    alt=""
                  />
                  <span className="count">100</span>
                </button>
                <div>
                  <span>100 comments - </span>
                  <span>100 shares</span>
                </div>
              </li>
            </SocialCount>
            <CommentSection>
              <button>
                <img src="/images/like-icon.svg" alt="" />
                <span>Like</span>
              </button>
              <button>
                <img src="/images/comment-icon.svg" alt="" />
                <span>Comment</span>
              </button>
              <button>
                <img src="/images/share-icon.svg" alt="" />
                <span>Share</span>
              </button>
              <button>
                <img src="/images/send-icon.svg" alt="" />
                <span>Send</span>
              </button>
            </CommentSection>
          </Description>
        </Article>
      </div>
    </Container>
  );
};

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
  box-shadow: 0 0 0 1px rgb (0 0 0 /15%), 0 0 0 rgb(0 0 0/20%);
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
    &:nth-child(2) {
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

const Article = styled(CommonCard)`
  padding: 0;
  margin: 0;
  overflow: visible;
`;
const SharedActor = styled.div`
  padding-right: 40px;
  flex-wrap: nowrap;
  padding: 12px 16px 0;
  margin-bottom: 8px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  div:not(.infor) {
    margin-right: 12px;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    text-decoration: none;
    img {
      width: 48px;
      height: 48px;
    }
    &:nth-child(2) {
      position: absolute;
      right: 0;
      display: flex;
      gap: 8px;
      top: 5px;
      button {
        border: none;
        background-color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        img {
          width: 30px;
          height: 30px;
        }
        &:nth-child(1):hover {
          background-color: lightblue;
        }
        &:nth-child(2):hover {
          background-color: lightgray;
          border-radius: 70%;
        }
      }
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
    img {
      &:nth-child(1) {
        position: absolute;
      }
      &:nth-child(2) {
        position: absolute;
        left: 15px;
        z-index: 1;
      }
      &:nth-child(3) {
        position: absolute;
        left: 25px;
        z-index: 2;
      }
    }
    .count {
      z-index: 3;
      position: absolute;
      left: 42px;
      color: rgba(0, 0, 0, 0.6);
      font-size: 12px;
    }
  }
  img {
    border: none;
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
    padding: 10px 10px 10px 10px;
    font-weight: 600;
    font-size: 14px;
    &:hover {
      background-color: lightgray;
      cursor: pointer;
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
export default Main;
