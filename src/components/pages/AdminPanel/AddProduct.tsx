import { useRef, useState } from "react";
import { z } from "zod";

//  Firebase
import { storage, db } from "../../../configs/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc } from "firebase/firestore";

import Form, { FormHandle } from "../../UI/Form";
import Input from "../../UI/Input";
import Button from "../../UI/Button";

const fileSchema = z.object({
  name: z.string().nonempty("Nazwa pliku jest wymagana"),
  size: z.number().max(2000000, "Plik nie może być większy niż 2MB"), // Przykładowe ograniczenie rozmiaru pliku
  type: z.string().regex(/image\/(jpeg|png|gif)/, "Dozwolone są tylko pliki graficzne (jpeg, png, gif)"),
});

const addProductSchema = z.object({
  name: z.string().nonempty({ message: "Nazwa produktu nie może być pusta" }),
  price: z
    .string()
    .nonempty({ message: "Cena nie może być pusta" })
    .refine((val) => /^[0-9.,\s]+$/.test(val), {
      message: "Cena może zawierać tylko cyfry, przecinek, kropkę i spacje",
    })
    .transform((val) => parseFloat(val.replace(",", ".")))
    .refine((val) => !isNaN(val) && val > 0, { message: "Cena musi być prawidłową liczbą dodatnią" }),
});

const AdminPanel = () => {
  const [imageSrc, setImageSrc] = useState<null | string>(null);
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const productForm = useRef<FormHandle>(null);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  const validateFile = (file: File) => {
    const result = fileSchema.safeParse({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!result.success) {
      setFileErrors(result.error.errors.map((error) => error.message));
      return false;
    } else {
      setFileErrors([]);
      return true;
    }
  };

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      const src = URL.createObjectURL(file);
      setImageSrc(src);
      setImage(file);
    }
  }

  async function handleSubmit(data: unknown) {
    if (!image) return;

    const { name, price } = data as { name: string; price: string };
    // return;
    const result = addProductSchema.safeParse({ name, price });
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    setErrors({});
    console.log(Object.keys(errors).length !== 0);
    if (Object.keys(errors).length !== 0) return;

    const docRef = doc(collection(db, "products"), name);
    const imageRef = ref(storage, `product-images/${name}`);
    const snapshot = await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(snapshot.ref);

    await setDoc(docRef, {
      name: String(name),
      price: Number(price.replace(",", ".").replace(/\s/g, "")),
      image: {
        src: String(imageUrl),
      },
    }),
      window.location.reload();
  }

  return (
    <div>
      <AddProductForm onSave={handleSubmit} ref={productForm}>
        {imageSrc ? <ImageContainer src={imageSrc} /> : <ImagePlaceholder />}
        <ImageInput type="file" ref={fileInputRef} name="image" id="image" onChange={handleFileChange} />
        {fileErrors.length > 0 && (
          <div>
            {fileErrors.map((error, index) => (
              <Error key={index}>{error}</Error>
            ))}
          </div>
        )}
        <Button type="button" onClick={handleUploadClick}>
          Prześlij zdjęcie
        </Button>

        <ProductInput type="text" name="name" id="name" label="Nazwa produktu" disabled={image ? false : true} />
        {errors.name && <Error>{errors.name}</Error>}
        <ProductInput type="text" name="price" id="price" label="Cena produktu" disabled={image ? false : true} />
        {errors.price && <Error>{errors.price}</Error>}
        {image && (
          <Button type="submit" disabled={image ? false : true}>
            Dodaj produkt
          </Button>
        )}
      </AddProductForm>
    </div>
  );
};

//  --- Styling ---
import styled from "styled-components";

const AddProductForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: left;

  * {
    margin: 5px 0;
    text-align: left;
  }

  > button {
    max-width: 170px;
    margin-top: 10px;

    &:hover {
      letter-spacing: 1px;
    }
  }
`;

const ProductInput = styled(Input)<{ disabled: boolean }>`
  width: 50%;
  border: ${(props) => (props.disabled ? "1px solid lightgray" : "1px solid black")};
`;

type ImageContainerProps = {
  src: string | null;
};
const ImageContainer = styled.img<ImageContainerProps>`
  display: block;
  max-width: 250px;
  min-height: 200px;
  border: ${(p) => (p.src ? "1.5px solid lightgray" : "1.5px solid black")};
  background-image: url("${(p) => p.src}");
  background-size: cover;
  background-position: center;
`;

const src = "../../../../../../assets/image-placeholder.jpg";
const ImagePlaceholder = styled.img`
  display: block;
  width: 250px;
  height: 200px;
  border: 1.5px solid black;
  background-image: url(${src});
  background-size: cover;
  background-position: center;
`;

const ImageInput = styled(Input)`
  display: none;
`;

const Error = styled.span`
  display: block;
  color: rgb(150, 0, 0);
  font-size: 14px;
  margin: 3px 0;
`;

export default AdminPanel;
