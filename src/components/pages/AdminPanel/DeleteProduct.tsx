import { useRef, useState } from "react";

import { db } from "../../../configs/firebase-config";
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    deleteDoc, 
    doc } 
from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";


import { useAppSelector } from "../../../redux/hooks";
import Form, { type FormHandle} from "../../UI/Form";
import Button from "../../UI/Button";

const DeleteProduct = () => {
    const products = useAppSelector(state => state.products.products);
    const productsName = products.map(product => product.name);
    const deleteProductForm = useRef<FormHandle>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Wybierz produkt');

    async function handleSubmit() {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("name", "==", selectedOption));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, "products", document.id));

        const storage = getStorage();
        const imageRef = ref(storage, `product-images/${selectedOption}`);
        await deleteObject(imageRef);
        setSelectedOption('Wybierz produkt');
  });
    }

    return (
        <>
            <DeleteProductForm onSave={handleSubmit} ref={deleteProductForm}>
                <CustomSelectContainer>
                    <CustomSelectValue onClick={() => setIsOpen(!isOpen)}>
                        {selectedOption}
                    </CustomSelectValue>
                    {isOpen && (
                        <CustomOptions>
                            {productsName.map(option => (
                                <CustomOption key={option} onClick={() => {
                                    setSelectedOption(option);
                                    setIsOpen(false);
                                }}>
                                    {option}
                                </CustomOption>
                            ))}
                        </CustomOptions>
                    )}
                </CustomSelectContainer>
                <Button type="submit">Usuń</Button>
            </DeleteProductForm>
        </>
    );
};

//  --- Styling ---
import styled from 'styled-components';

const DeleteProductForm = styled(Form)`
    > * {
        display: block;
        margin: 20px 0;
    }

    > :first-child {
        margin-top: 0;
    }

    > select {
        padding: 10px;
        border: 1.5px solid black;
        font-weight: bold;

        &:focus {
            outline: none;
            border: 2px solid rgb(150, 0, 0);
            background-color: rgb(255, 243, 215);
        }
    }
`;

const CustomSelectContainer = styled.div`
  position: relative;
  width: 500px;
`;

const CustomSelectValue = styled.div`
  padding: 10px;
  border: 1.5px solid black;
  font-weight: bold;
  cursor: pointer;
`;

const CustomOptions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid lightgray;
  background-color: white;
  z-index: 1;
`;

const CustomOption = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: rgb(255, 243, 215);
  }
`;

export default DeleteProduct;