import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { setRedirectAfterLogin } from "../../../redux/loginSlice";
import { addOrRemoveFromCart } from "../../../redux/cartSlice";
import { ProductProps } from "../../pages/ShopList/Product";

import Container from "../../UI/Container";
import Headers from "../../UI/ChooseHeader";
import Button from "../../UI/Button";
import styled from "styled-components";

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn);
  const cart = useAppSelector((state) => state.cart);

  function handleRemoveFromCart(item: ProductProps) {
    dispatch(
      addOrRemoveFromCart({
        product: { image: item.image, name: item.name, price: item.price },
        isAdding: false,
      })
    );
  }

  function handleAddToCart(item: ProductProps) {
    dispatch(
      addOrRemoveFromCart({
        product: { image: item.image, name: item.name, price: item.price },
        isAdding: true,
      })
    );
  }

  function handleCheckoutClick() {
    if (!isLoggedIn) {
      dispatch(setRedirectAfterLogin("/checkout"));
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  }

  return (
    <>
      <Header as={Headers} level={2}>
        Koszyk
      </Header>
      <Sum>
        Kwota: <strong>{cart.sum.toFixed(2)}</strong> PLN
      </Sum>
      {cart.items.map((item) => (
        <Item key={item.name}>
          <div>
            <ImageContainer src={item.image.src} alt={item.image.alt} />
          </div>
          <div>
            <Header as={Headers} level={3}>
              {item.name}
            </Header>
          </div>
          <div>
            <strong>{item.price.toFixed(2)} PLN</strong>
            <span>
              Ilość: <strong>{item.quantity}</strong>
            </span>
            <section>
              <Button onClick={handleRemoveFromCart.bind(this, item)}>-</Button>
              <Button onClick={handleAddToCart.bind(this, item)}>+</Button>
            </section>
          </div>
        </Item>
      ))}
      <NavigationButtons>
        <Button link="/">Powrót do sklepu</Button>
        {cart.items.length > 0 && <Button onClick={handleCheckoutClick}>Przejdź do płatności</Button>}
      </NavigationButtons>
    </>
  );
};

//  --- Styling ---
const Header = styled(Container)``;

const Sum = styled.span`
  width: 100%;
  margin-bottom: 20px;
  font-size: 17px;
  letter-spacing: 1.5px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border: 1.5px solid black;
  padding: 30px;
  margin-bottom: 40px;
  width: 100%;
  max-width: 1080px;

  @media (max-width: 800px) {
    flex-direction: column;
  }

  > * {
    flex-basis: 33%;
  }

  > div > h3 {
    width: 100%;
    white-space: pre-wrap;

    @media (max-width: 800px) {
      margin-top: 20px;
    }
  }

  > div:last-child {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: center;

    * {
      margin: 5px 0;
    }

    > section > button {
      margin: 5px 10px;
      padding: 3px 20px;
      font-size: 22px;
    }
  }
`;

const ImageContainer = styled.img`
  vertical-align: middle;
  height: clamp(130px, 10vw, 150px);
`;

const NavigationButtons = styled.section`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 450px;

  > * > button,
  > button {
    margin: 5px 10px;
  }
`;

export default Cart;
