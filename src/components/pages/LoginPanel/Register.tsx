import { useState, useEffect, useRef } from "react";
import { useAppSelector } from "../../../redux/hooks";

import { auth, db } from "../../../configs/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";

import { z } from "zod";

import Container from "../../UI/Container";
import Headers from "../../UI/ChooseHeader";
import Form, { FormHandle } from "../../UI/Form";
import Input from "../../UI/Input";
import Button from "../../UI/Button";
import styled from "styled-components";

const registerSchema = z
  .object({
    email: z
      .string()
      .nonempty({ message: "To pole nie może pozostać puste" })
      .email({ message: "Nieprawidłowy adres email" }),
    nickname: z
      .string()
      .nonempty({ message: "To pole nie może pozostać puste" })
      .min(3, { message: "Nazwa konta musi mieć co najmniej 3 znaki" })
      .regex(/^[a-zA-Z0-9]+$/, "Nazwa konta nie może zawierać spacji ani znaków specjalnych")
      .refine((val) => val.toLowerCase() !== "admin", {
        message: `Nazwą konta nie może być "admin"`,
      }),
    password: z
      .string()
      .nonempty({ message: "To pole nie może pozostać puste" })
      .min(10, { message: "Hasło musi mieć co najmniej 10 znaków" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Hasło musi zawierać co najmniej jeden znak specjalny")
      .regex(/\d/, "Hasło musi zawierać co najmniej jedną cyfrę"),
    "password-repeat": z
      .string()
      .nonempty({ message: "To pole nie może pozostać puste" })
      .min(10, { message: "Hasło musi mieć co najmniej 10 znaków" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data["password-repeat"]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hasła muszą być takie same",
        path: ["password-repeat"],
      });
    }
  });

const Register = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zodErrors, setZodErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<boolean>(false);
  const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn);
  const registerFormRef = useRef<FormHandle>(null);

  async function handleRegisterAccount(data: unknown) {
    const {
      email,
      nickname,
      password,
      "password-repeat": passwordRepeat,
    } = data as {
      email: string;
      nickname: string;
      password: string;
      "password-repeat": string;
    };

    const validationResult = registerSchema.safeParse(data);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setZodErrors(newErrors);
      return;
    }
    setZodErrors({});

    if (password !== passwordRepeat) {
      setError("Hasła się nie zgadzają");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      registerFormRef.current?.clear();
      const docRef = doc(collection(db, "users"), email);
      await setDoc(docRef, {
        nickname: String(nickname),
        status: "user",
      }),
        setSuccess(true);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("Podany e-mail jest już zajęty");
      } else {
        setError("Wystąpił błąd podczas rejestracji");
      }
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 700);

    if (success) {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, [success]);

  return (
    <RegisterContainer>
      <Header as={Headers} level={2}>
        {isLoading ? "Loading..." : "Rejestracja"}
      </Header>

      {!isLoading && !isLoggedIn ? (
        <>
          <FormContainer onSave={handleRegisterAccount} ref={registerFormRef}>
            {success && <SuccessMessage>Konto zostało uwtworzone! Czekaj...</SuccessMessage>}
            <Input label="E-mail" type="email" name="email" id="email" />
            {zodErrors.email && <Error>{zodErrors.email}</Error>}
            <Input label="Nazwa konta" type="text" name="nickname" id="nickname" />
            {zodErrors.nickname && <Error>{zodErrors.nickname}</Error>}
            <Input label="Hasło" type="password" name="password" id="password" />
            {zodErrors.password && <Error>{zodErrors.password}</Error>}
            <Input label="Powtórz hasło" type="password" name="password-repeat" id="password-repeat" />
            {zodErrors["password-repeat"] && <Error>{zodErrors["password-repeat"]}</Error>}
            <Button type="submit">Zarejestruj</Button>
            {error && <FinalError>{error}</FinalError>}
          </FormContainer>
          <UniquePrevButton link="/login">Powrót do logowania</UniquePrevButton>
        </>
      ) : isLoading ? null : (
        <p>Jesteś już zarejestrowany</p>
      )}
    </RegisterContainer>
  );
};

//  --- Styling ---
const RegisterContainer = styled.section``;

const Header = styled(Container)``;

const UniquePrevButton = styled(Button)`
  flex-basis: 100%;
  display: block;
  margin: 30px auto;
`;

const FormContainer = styled(Form)`
  max-width: 400px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background-color: white;
  padding: 30px 0;
  border: 1.5px solid black;

  > * {
    flex-basis: 100%;
  }

  > button {
    flex-basis: 30%;
    margin-top: 20px;
  }

  > label {
    margin: 10px 0;
  }

  > input {
    flex-basis: 70%;
    margin: 0 50px;
  }
`;

const SuccessMessage = styled.span`
  background-color: black;
  color: white;
  padding: 10px 0;
`;

const Error = styled.span`
  flex-basis: 70%;
  font-size: 15px;
  color: rgb(150, 0, 0);
  margin: 5px 0;
`;

const FinalError = styled(Error)`
  margin-top: 20px;
`;

export default Register;
