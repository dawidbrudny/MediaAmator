import { useRef, useState } from "react";

//  Firebase
import { storage, db } from "../../../configs/firebase-config";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc } from 'firebase/firestore';

import Form, { FormHandle } from "../../UI/Form";
import Input from "../../UI/Input";
import Button from "../../UI/Button";

const AdminPanel = () => {
    const [imageSrc, setImageSrc] = useState<null | string>(null);
    const [image, setImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const productForm = useRef<FormHandle>(null);

    function handleUploadClick() {
        fileInputRef.current?.click();
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const src = URL.createObjectURL(file);
            setImageSrc(src);
            setImage(file);
        }
    }

    async function handleSubmit(data: unknown) {
        if (!image) return;
        const { name, price } = data as { name: string, price: number };
        if (!name && !price) return;
        productForm.current?.clear();
        setImage(null);
        setImageSrc(null);

        const docRef = doc(collection(db, 'products'), name);
        const imageRef = ref(storage, `product-images/${name}`);
        const snapshot = await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(snapshot.ref);
        console.log(productForm.current);

        await setDoc(docRef, {
            name: String(name),
            price: Number(price),
            image: {
                src: String(imageUrl)
            }
        });
    }

    return (
        <div>
            <AddProductForm onSave={handleSubmit} ref={productForm}>
                {imageSrc ? <ImageContainer src={imageSrc} /> : <ImagePlaceholder />}
                <ImageInput type='file' ref={fileInputRef} name='image' id='image' onChange={handleFileChange} />
                <Button type='button' onClick={handleUploadClick}>Prześlij zdjęcie</Button>
                <Input type='text' name='name' id='name' label='Nazwa produktu' />
                <Input type='number' name='price' id='price' label='Cena produktu' />
                <Button type='submit'>Dodaj produkt</Button>
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
    }

    > :last-child {
        margin-top: 30px;
    }

    > label {
        text-align: left;
    }

    > input {
        width: 50%;
    }

    > button {
        max-width: 170px;

        &:hover {
            letter-spacing: 1px;
        }
    }
`;

type ImageContainerProps = {
    src: string | null;
}
const ImageContainer = styled.img<ImageContainerProps>`
    display: block;
    width: 300px;
    height: 200px;
    border: ${(p) => p.src ? '1.5px solid lightgray' : '1.5px solid black'};
    background-image: url('${(p) => p.src}');
    background-size: cover;
    background-position: center;
`;

const src = '../../../../../../assets/image-placeholder.jpg'
const ImagePlaceholder = styled.img`
    display: block;
    width: 300px;
    height: 200px;
    border: 1.5px solid black;
    background-image: url(${src});
    background-size: cover;
    background-position: center;
`;

const ImageInput = styled(Input)`
    display: none;
`;

export default AdminPanel;
