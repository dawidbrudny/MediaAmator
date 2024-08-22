import { useRef, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";

import { db } from "../../../configs/firebase-config";
import { collection, getDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";

import { z } from "zod";

import Form, { FormHandle } from "../../UI/Form";
import Button from "../../UI/Button";
import styled from "styled-components";

const addCommentSchema = z.object({
  comment: z
    .string()
    .nonempty("Komentarz nie może być pusty")
    .min(5, "Komentarz musi zawierać co najmniej 5 znaków")
    .max(250, "Komentarz nie może przekraczać 250 znaków"),
});

const AddComment = ({ productName }: { productName: string }) => {
  const nickname = useAppSelector((state) => state.login.userData?.nickname);
  const formRef = useRef<FormHandle>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(data: any) {
    const { comment } = data as { comment: string };

    const result = addCommentSchema.safeParse({ comment });
    if (!result.success) {
      setErrors(result.error.errors.reduce((acc, error) => ({ ...acc, [error.path[0]]: error.message }), {}));
      return;
    }

    try {
      const productDocRef = doc(db, "products", productName);
      const productDoc = await getDoc(productDocRef);
      if (productDoc.exists()) {
        await addDoc(collection(productDocRef, "commentaries"), {
          author: nickname,
          text: comment,
          timestamp: serverTimestamp(),
        });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error(error);
    }

    formRef.current?.clear();
    window.location.reload();
  }

  return (
    <Container onSave={handleSubmit} ref={formRef}>
      <label>Napisz komentarz</label>
      <textarea name="comment"></textarea>
      {errors.comment && <Error>{errors.comment}</Error>}
      <Button>Dodaj komentarz</Button>
    </Container>
  );
};

//  --- Styling ---
const Container = styled(Form)`
  width: 100%;
  margin: 20px;

  > * {
    display: block;
    margin: 10px auto;
  }

  > textarea {
    width: 70%;
    min-width: 280px;
    height: 150px;
    margin: 10px auto 20px auto;
    padding: 10px;
    border: 1.5px solid black;
    resize: none;

    &:focus {
      outline: none;
    }
  }
`;

const Error = styled.span`
  color: rgb(150, 0, 0);
  font-size: 14px;
`;

export default AddComment;
