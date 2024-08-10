import { useEffect, useState } from "react";
import { db } from "../../../../configs/firebase-config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

import Container from "../../../UI/Container";
import Headers from "../../../UI/ChooseHeader";
import Button from "../../../UI/Button";
import styled from "styled-components";

type UserProps = {
  id: string;
  nickname: string;
  status: string;
  banned: boolean;
};

const UsersList = () => {
  const [users, setUsers] = useState<UserProps[]>([]);

  const handleBanUser = async (userId: string, currentStatus: boolean) => {
    try {
      const userDoc = doc(db, "users", userId);
      await updateDoc(userDoc, { banned: !currentStatus });
      setUsers(users.map((user) => (user.id === userId ? { ...user, banned: !currentStatus } : user)));
    } catch (error: any) {
      alert("Błąd podczas zmiany statusu użytkownika: " + error.message);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          nickname: doc.data().nickname || "",
          status: doc.data().status || "",
          banned: doc.data().banned,
        }));
        setUsers(usersList);
      } catch (error: any) {
        console.error("Błąd podczas pobierania użytkowników:", error.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <Header as={Headers} level={3}>
        Lista użytkowników
      </Header>
      <List>
        {users.map((user) => (
          <>
            {user.status === "admin" ? null : (
              <>
                <li key={user.id}>
                  <div>
                    <span>{user.id}</span>
                    <span>{user.nickname}</span>
                    <span>
                      Status: <b>{user.banned === true ? "zbanowany" : "normalny"}</b>
                    </span>
                    <UserButton onClick={() => handleBanUser(user.id, user.banned)}>
                      {user.banned ? "Odbanuj" : "Zbanuj"}
                    </UserButton>
                  </div>
                </li>
                <hr />
              </>
            )}
          </>
        ))}
      </List>
    </>
  );
};

//  --- Styling ---
const Header = styled(Container)``;

const List = styled.ol`
  margin-top: 30px;

  > li {
    text-align: left;
    padding: 5px 10px;
    padding: 15px;

    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;

      > span {
        flex-basis: 25%;
        text-align: center;
        border-left: 1px solid black;

        &:first-child {
          text-align: left;
          border: 0;
        }
      }
    }
  }
`;

const UserButton = styled(Button)`
  width: 100px;
  height: 30px;
  padding: 0;

  &:hover {
    box-shadow: none;
  }
`;

export default UsersList;
