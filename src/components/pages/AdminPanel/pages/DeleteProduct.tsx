import { useRef, useState } from "react";
import { z } from "zod";

import { db } from "../../../../configs/firebase-config";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

import { useAppSelector } from "../../../../redux/hooks";
import Form, { type FormHandle } from "../../../UI/Form";
import Button from "../../../UI/Button";
import Input from "../../../UI/Input";

const deleteProductSchema = z.object({
  selectedOption: z.string().nonempty("Musisz wybrać produkt do usunięcia"),
});

const DeleteProduct = () => {
  const products = useAppSelector((state) => state.products.products);
  const productsName = products.map((product) => product.name);
  const deleteProductForm = useRef<FormHandle>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = productsName.filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()));

  async function handleSubmit() {
    const validationResult = deleteProductSchema.safeParse({ selectedOption });

    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    const productsRef = collection(db, "products");
    const q = query(productsRef, where("name", "==", selectedOption));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, "products", document.id));

      const storage = getStorage();
      const imageRef = ref(storage, `product-images/${selectedOption}`);
      await deleteObject(imageRef);
      window.location.reload();
    });
  }

  return (
    <>
      <DeleteProductForm onSave={handleSubmit} ref={deleteProductForm}>
        <CustomSelectContainer>
          <CustomSelectValue
            onClick={() => {
              setSelectedOption("");
              setSearchTerm("");
            }}
          >
            <Input
              id="search-product"
              type="text"
              value={selectedOption ? selectedOption : searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 200)}
              autoComplete="off"
              placeholder="Wyszukaj produkt..."
            />
          </CustomSelectValue>
          {isOpen && (
            <CustomOptions>
              {filteredOptions.slice(0, 8).map((option) => (
                <CustomOption
                  key={option}
                  onClick={() => {
                    setSelectedOption(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </CustomOption>
              ))}
            </CustomOptions>
          )}
        </CustomSelectContainer>
        <Button type="submit">Usuń</Button>
        {errors.selectedOption && <Error>{errors.selectedOption}</Error>}
      </DeleteProductForm>
    </>
  );
};

//  --- Styling ---
import styled from "styled-components";

const DeleteProductForm = styled(Form)`
  > * {
    display: block;
    margin: 20px 0;
    text-align: left;
  }

  > :first-child {
    margin-top: 0;
  }
`;

const CustomSelectContainer = styled.div`
  position: relative;
  user-select: none;
`;

const CustomSelectValue = styled.div`
  color: black;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;

  > input {
    width: 100%;
    padding: 10px 15px;
  }
`;

const CustomOptions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid lightgray;
  background-color: white;
  color: #6f6f6f;
  z-index: 1;
`;

const CustomOption = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: rgb(255, 243, 215);
  }
`;

const Error = styled.span`
  color: rgb(150, 0, 0);
  font-size: 14px;
`;

export default DeleteProduct;
