import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";

import Container from "../../UI/Container";
import Headers from "../../UI/ChooseHeader";
import Button from "../../UI/Button";
import AddComment from "./AddComment";
import CommentarySection, { Commentary } from "./CommentarySection";
import styled from "styled-components";

const ProductDetails = () => {
  const [isLoading, setLoading] = useState(true);
  const location = useLocation();
  const { image, name, price } = location.state;

  const products = useAppSelector((state) => state.products.products);
  const product = products.find((product) => product.name === name);
  const comments = Array.isArray(product?.commentaries) ? (product?.commentaries as unknown as Commentary[]) : [];

  const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn);

  useEffect(() => {
    setTimeout(() => {
      if (comments) setLoading(false);
    }, 1000);
  }, [comments, status]);

  return (
    <>
      {isLoading ? (
        <Header as={Headers} level={2}>
          Loading...
        </Header>
      ) : (
        <ProductContainer>
          <Header as={Headers} level={2}>
            Szczegóły produktu
          </Header>
          <ProductName>{name}</ProductName>
          <ProductImage src={image.src} alt={image.alt} />
          <ProductPrice>
            Cena: <strong>{price.toFixed(2)}</strong> PLN
          </ProductPrice>

          {isLoggedIn && <AddComment productName={name} />}
          <CommentarySection commentaries={comments} productName={product?.name} />
          <Button link="/shoplist">Powrót</Button>
        </ProductContainer>
      )}
    </>
  );
};

//  --- Styling ---
const Header = styled(Container)``;

const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1024px;

  > a > button {
    margin-top: 30px;
  }
`;

const ProductName = styled.h3`
  margin-bottom: 20px;
  width: 70%;
`;

const ProductImage = styled.img`
  vertical-align: middle;
  width: clamp(280px, 30vw, 350px);
  border: 1.5px solid black;
  padding: 30px;
  background-color: white;
`;

const ProductPrice = styled.span`
  font-size: 18px;
  margin: 20px;
`;

export default ProductDetails;
