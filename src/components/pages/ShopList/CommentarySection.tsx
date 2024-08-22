import { useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { db } from "../../../configs/firebase-config";
import { doc, deleteDoc } from "firebase/firestore";

import Button from "../../UI/Button";
import styled from "styled-components";

export type Commentary = {
  timestamp: string;
  id: string;
  author: string;
  text: string;
};

type CommentarySectionProps = {
  commentaries: Commentary[];
  productName: string | undefined;
};

const CommentarySection = ({ commentaries, productName }: CommentarySectionProps) => {
  const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn);
  const status = useAppSelector((state) => state.login.userData?.status);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("oldest");

  async function handleDeleteComment(commentId: string, productName: string) {
    try {
      await deleteDoc(doc(db, "products", productName, "commentaries", commentId));
      window.location.reload();
    } catch (error) {
      console.error("Błąd podczas usuwania komentarza: ", error);
    }
  }

  function handleReportComment() {
    alert("Trwają prace nad funkcjonalnością zgłaszania komentarzy");
  }

  const sortedCommentaries = [...commentaries].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
  });

  return (
    <>
      {commentaries.length > 0 ? (
        <Comments>
          <ButtonsSection>
            <Button onClick={() => setSortOrder("oldest")}>Od najstarszych</Button>
            <Button onClick={() => setSortOrder("newest")}>Od najnowszych</Button>
          </ButtonsSection>

          {sortedCommentaries.map((commentary: Commentary) => {
            const { id, author, text, timestamp } = commentary;
            const date = new Date(timestamp).toLocaleString();
            return (
              <Comment key={id}>
                <h3>{author}</h3>

                {isLoggedIn ? (
                  status === "admin" ? (
                    <Button onClick={() => productName && handleDeleteComment(id, productName)}>Usuń</Button>
                  ) : (
                    <Button onClick={handleReportComment}>Zgłoś</Button>
                  )
                ) : null}
                <span>{date}</span>
                <p>{text}</p>
                <hr />
              </Comment>
            );
          })}
        </Comments>
      ) : (
        <span>Brak komentarzy</span>
      )}
    </>
  );
};

//  --- Styling ---
const ButtonsSection = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  > button {
    margin: 10px;
  }
`;

const Comments = styled.ul`
  width: 70%;
  min-width: 280px;
  list-style: none;
`;

const Comment = styled.li`
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0;
  width: 100%;

  * {
    /* margin: 2px 0; */
  }

  > h3 {
    flex-basis: 90%;
    text-align: left;
  }

  > span {
    flex-basis: 100%;
    text-align: left;
  }

  > button {
    flex-basis: 10%;
    float: right;
    padding: 5px 10px;
  }

  > p {
    flex-basis: 100%;
    text-align: left;
    white-space: pre-wrap;
    margin-top: 20px;
  }

  > hr {
    width: 100%;
    border: 0.5px solid gray;
    margin: 10px 0;
  }
`;

export default CommentarySection;
