import { useState, useEffect, useRef } from "react";
import { auth, db } from "../../../../configs/firebase-config";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  verifyBeforeUpdateEmail,
  updatePassword,
  signOut,
} from "firebase/auth";
import { getDoc, deleteDoc, doc } from "firebase/firestore";

import Container from "../../../UI/Container";
import Headers from "../../../UI/ChooseHeader";
import Form, { FormHandle } from "../../../UI/Form";
import Input from "../../../UI/Input";
import Button from "../../../UI/Button";
import styled from "styled-components";

const Settings = () => {
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const [isValidInCurrent, setIsValidInCurrent] = useState(false);
  const [isValidInChangeEmail, setIsValidInChangeEmail] = useState(false);
  const [isValidInChangePass, setIsValidInChangePass] = useState(false);
  const [isValidInDelete, setIsValidInDelete] = useState(false);

  const changeEmailRef = useRef<FormHandle>(null);
  const changePasswordRef = useRef<FormHandle>(null);
  const deleteAccountRef = useRef<FormHandle>(null);

  const user = auth.currentUser;

  async function handleChangeEmail(data: unknown) {
    const { changedEmail, currentPasswordForEmail } = data as { changedEmail: string; currentPasswordForEmail: string };
    const credential = EmailAuthProvider.credential(user!.email!, currentPasswordForEmail);
    if (user) {
      try {
        setIsValidInChangeEmail(false);

        await reauthenticateWithCredential(user, credential).then(() => {
          verifyBeforeUpdateEmail(user, changedEmail);
          signOut(auth);
          setIsChanged(true);
        });
        setIsLinkSent(true);
      } catch (error: any) {
        console.error("Błąd podczas zmiany e-maila:", error);
        if (error.code === "auth/invalid-email") {
          setIsValidInChangeEmail(true);
        } else if (error.code === "auth/wrong-password") {
          setIsValidInCurrent(true);
        }
      }
      changeEmailRef.current?.clear();
    }
  }

  async function handleChangePassword(data: unknown) {
    const { currentPassword, changedPassword } = data as { currentPassword: string; changedPassword: string };

    if (user) {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      try {
        setIsValidInCurrent(false);
        setIsValidInChangePass(false);

        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, changedPassword);
        setIsChanged(true);
      } catch (error: any) {
        console.error("Błąd podczas zmiany hasła:", error);
        if (error.code === "auth/invalid-credential") {
          setIsValidInCurrent(true);
        } else if (error.code === "auth/weak-password") {
          setIsValidInChangePass(true);
        }
      }
    } else {
      console.log("Brak zalogowanego użytkownika.");
    }
    changePasswordRef.current?.clear();
  }

  async function handleDeleteUserAccount(data: unknown) {
    const { passwordToDelete } = data as { passwordToDelete: string };

    if (user) {
      try {
        if (passwordToDelete !== null && passwordToDelete !== "") {
          setIsValidInDelete(false);

          const credential = EmailAuthProvider.credential(user.email!, passwordToDelete);
          await reauthenticateWithCredential(user, credential);

          await user.delete();

          const userDocRef = doc(db, "users", user.email!);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            await deleteDoc(userDocRef);
          }

          setIsDeleted(true);
        } else {
          console.log("Brak zalogowanego użytkownika.");
        }
      } catch (error: any) {
        console.log("Błąd podczas usuwania konta: ", error);
        if (error.code === "auth/invalid-credential") {
          console.log("Błędne hasło");
          setIsValidInDelete(true);
        }
      }

      deleteAccountRef.current?.clear();
    }
  }

  useEffect(() => {
    if (isDeleted || isChanged) {
      if (isChanged) {
        auth.signOut();
      }
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [isDeleted, isChanged]);

  return (
    <>
      <Header as={Headers} level={3}>
        Ustawienia
      </Header>

      <FormConatiner onSave={handleChangeEmail} ref={changeEmailRef}>
        <strong>Zmiana e-maila</strong>
        <Input
          type="password"
          label="Podaj aktualne hasło"
          name="currentPasswordForEmail"
          id="current-password-email"
          required
        />
        {isValidInCurrent && <Error>Hasło jest nieprawidłowe</Error>}

        <Input type="email" label="Podaj nowy e-mail" name="changedEmail" id="changed-email" required />
        {isValidInChangeEmail && <Error>Podany e-mail jest nieprawidłowy</Error>}
        <Button type="submit">Zmień e-mail</Button>
        {isLinkSent && (
          <span>
            E-mail weryfikacyjny został wysłany. <br />
            Proszę zweryfikować nowy adres e-mail. <br />
            Czekaj...
          </span>
        )}
      </FormConatiner>

      <hr />

      <FormConatiner onSave={handleChangePassword} ref={changePasswordRef}>
        <strong>Zmiana hasła</strong>
        <Input
          type="password"
          label="Podaj aktualne hasło"
          name="currentPasswordForPassChange"
          id="current-password-pass"
          required
        />
        {isValidInCurrent && <Error>Hasło jest nieprawidłowe</Error>}
        <Input type="password" label="Podaj nowe hasło" name="changedPassword" id="changed-password" required />
        {isValidInChangePass && <Error>Hasło jest zbyt słabe (conajmniej 6 znaków)</Error>}
        {isChanged && <span>Hasło zostało zmienione, czekaj...</span>}
        <Button type="submit">Zmień hasło</Button>
      </FormConatiner>

      <hr />

      <FormConatiner onSave={handleDeleteUserAccount} ref={deleteAccountRef}>
        <strong>Usuwanie konta</strong>
        <Input type="password" label="Podaj hasło" name="passwordToDelete" id="password-to-delete" required />
        {isValidInDelete && <Error>Hasło jest nieprawidłowe</Error>}
        {isDeleted && <span>Konto usunięte pomyślnie, czekaj...</span>}
        <Button type="submit">Usuń konto</Button>
      </FormConatiner>
    </>
  );
};

//  --- Styling ---
const Header = styled(Container)``;

const FormConatiner = styled(Form)`
  &:first-of-type {
    margin-top: 50px;
  }

  > * {
    display: block;
    margin: 5px 0;
    text-align: left;
  }

  > strong {
    margin: 10px 0;
  }

  > button {
    margin: 20px 0;
  }
`;

const Error = styled.span`
  color: rgb(150, 0, 0);
`;

export default Settings;
