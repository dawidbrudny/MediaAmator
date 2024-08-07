//React
import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
//  Zod
import { z } from "zod";
//  Redux
import { handleLoginProcess, getLoginStatus } from "./utils/authenticationFunctions";
import { useAppDispatch } from "../../../redux/hooks";
import { setLoginState } from "../../../redux/loginSlice";
//  Components
import Form, { FormHandle } from "../../UI/Form";
import Button from "../../UI/Button";
import Input from "../../UI/Input";
import styled from "styled-components";

const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "To pole nie może pozostać puste" })
    .email({ message: "Nieprawidłowy adres email" }),
  password: z
    .string()
    .nonempty({ message: "To pole nie może pozostać puste" })
    .min(6, { message: "Hasło musi mieć co najmniej 6 znaków" }),
});

const LoginForm = () => {
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useAppDispatch();
  const loginForm = useRef<FormHandle>(null);

  const getLoginResponse = useCallback(async () => {
    getLoginStatus().then((response) => {
      dispatch(setLoginState(response));
    });
  }, [dispatch]);

  async function handleSubmit(data: unknown) {
    const { email, password } = data as { email: string; password: string };
    setIsValid(false);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    setErrors({});

    await handleLoginProcess(email, password).then((response) => {
      if (response === "auth/invalid-credential") {
        setIsValid(true);
      }

      getLoginResponse();
      loginForm.current?.clear();
    });
  }

  useEffect(() => {
    getLoginResponse();
  }, [getLoginResponse]);

  return (
    <LoginContainer>
      <LoginFormContainer onSave={handleSubmit} ref={loginForm}>
        {isValid && <SignInError>Błędne dane logowania</SignInError>}
        <Input type="email" name="email" id="email" label="Email" required />
        {errors.email && <Error>{errors.email}</Error>}
        <Input type="password" name="password" id="password" label="Hasło" required />
        {errors.password && <Error>{errors.password}</Error>}
        <RegisterLink to="/register">Zarejestruj się</RegisterLink>
        <Button type="submit">Zaloguj</Button>
      </LoginFormContainer>
      <UniquePrevButton link="/">Powrót do zakupów</UniquePrevButton>
    </LoginContainer>
  );
};

//  --- Styling ---
const LoginContainer = styled.section``;

const UniquePrevButton = styled(Button)`
  flex-basis: 100%;
  display: block;
  margin: 30px auto;
`;

const LoginFormContainer = styled(Form)`
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
  }

  > label {
    margin: 10px 0;
  }

  > input {
    flex-basis: 70%;
    margin: 0 50px;
  }
`;

const RegisterLink = styled(Link)`
  margin: 15px;
  transition: 0.3s ease-in-out;

  &:hover {
    color: rgb(150, 0, 0);
    letter-spacing: 0.3px;
  }
`;

const Error = styled.span`
  color: rgb(150, 0, 0);
  font-size: 14px;
  margin: 5px 0;
`;

const SignInError = styled(Error)`
  background-color: black;
  color: white;
  padding: 10px 0;
`;

export default LoginForm;
