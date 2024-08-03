import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements, PaymentRequestButtonElement } from "@stripe/react-stripe-js";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { useAppSelector } from "../../../redux/hooks";
import Container from "../../UI/Container";
import Headers from "../../UI/ChooseHeader";
import styled from "styled-components";

type LatLngLiteral = {
  lat: number;
  lng: number;
};

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [blikCode, setBlikCode] = useState<string>("");
  const [cityLatLng, setCityLatLng] = useState<LatLngLiteral | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    street: "",
    houseNumber: "",
    postalCode: "",
  });
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const login = useAppSelector((state) => state.login.isLoggedIn);
  const cart = useAppSelector((state) => state.cart.quantity);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectCity = async (address: string) => {
    try {
      const results = await geocodeByAddress(address);
      const addressComponents = results[0].address_components;
      const latLng = await getLatLng(results[0]);
      setCityLatLng(latLng);

      const city = addressComponents.find((component) => component.types.includes("locality"))?.long_name || "";

      setFormData((prevData) => ({
        ...prevData,
        city,
      }));
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  const handleSelectStreet = async (address: string) => {
    try {
      const results = await geocodeByAddress(address);
      const addressComponents = results[0].address_components;
      const street = addressComponents.find((component) => component.types.includes("route"))?.long_name || "";
      let postalCode = addressComponents.find((component) => component.types.includes("postal_code"))?.long_name || "";

      if (addressComponents.find((component) => component.types.includes("postal_code_prefix"))) {
        const postalCodePrefix =
          addressComponents.find((component) => component.types.includes("postal_code_prefix"))?.long_name || "";
        postalCode = postalCodePrefix;
      }

      setFormData((prevData) => ({
        ...prevData,
        street,
        postalCode,
      }));
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      city: "",
      street: "",
      houseNumber: "",
      postalCode: "",
    });
    setBlikCode("");
    setPaymentMethod("card");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (paymentMethod === "card") {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: {
            city: formData.city,
            line1: formData.street,
            postal_code: formData.postalCode,
          },
        },
      });

      if (error) {
        setError(error.message || "Błąd płatności");
        setSuccess(false);
      } else {
        setError(null);
        setSuccess(true);
        console.log("PaymentMethod ID:", paymentMethod.id);
        resetForm();
      }
    } else if (paymentMethod === "blik") {
      if (!blikCode) {
        setError("Kod BLIK jest wymagany");
        return;
      }
      console.log("BLIK Code:", blikCode);
      setError(null);
      setSuccess(true);
      resetForm();
    }
  };

  const cardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
        backgroundColor: "#f8f8f8",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "4px",
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  useEffect(() => {
    if (formData.city) {
      geocodeByAddress(formData.city)
        .then((results) => getLatLng(results[0]))
        .then((latLng) => setCityLatLng(latLng))
        .catch((error) => console.error("Error fetching city coordinates:", error));
    }

    setTimeout(() => {
      setLoading(false);
    }, 700);
  }, [formData.city]);

  return (
    <>
      <Header as={Headers} level={2}>
        {loading ? "Loading..." : login ? (cart ? "Płatność" : "Koszyk jest pusty") : "Zaloguj się"}
      </Header>
      {login && cart && !loading ? (
        <FormContainer onSubmit={handleSubmit}>
          <Input
            type="text"
            name="firstName"
            placeholder="Imię"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="lastName"
            placeholder="Nazwisko"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <PlacesAutocomplete
            value={formData.city}
            onChange={(city) => setFormData((prevData) => ({ ...prevData, city }))}
            onSelect={handleSelectCity}
            searchOptions={{
              componentRestrictions: { country: "pl" },
              types: ["(cities)"],
            }}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div>
                <Input
                  {...getInputProps({
                    placeholder: "Miasto",
                    className: "location-search-input",
                    autoComplete: "new-password",
                  })}
                />
                <SuggestionsContainer>
                  {loading && <div>Ładowanie...</div>}
                  {suggestions
                    .filter((suggestion) => suggestion.types.includes("locality"))
                    .map((suggestion) => {
                      const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
                      const style = suggestion.active
                        ? { backgroundColor: "#fafafa", cursor: "pointer" }
                        : { backgroundColor: "#ffffff", cursor: "pointer" };
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style,
                          })}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                </SuggestionsContainer>
              </div>
            )}
          </PlacesAutocomplete>
          <PlacesAutocomplete
            value={formData.street}
            onChange={(street) => setFormData((prevData) => ({ ...prevData, street }))}
            onSelect={handleSelectStreet}
            searchOptions={{
              componentRestrictions: { country: "pl" },
              types: ["address"],
              locationRestriction: cityLatLng
                ? {
                    north: cityLatLng.lat + 0.1,
                    south: cityLatLng.lat - 0.1,
                    east: cityLatLng.lng + 0.1,
                    west: cityLatLng.lng - 0.1,
                  }
                : undefined,
            }}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div>
                <Input
                  {...getInputProps({
                    placeholder: "Ulica",
                    className: "location-search-input",
                    autoComplete: "new-password",
                    disabled: !formData.city,
                  })}
                />
                <SuggestionsContainer>
                  {loading && <div>Ładowanie...</div>}
                  {suggestions.map((suggestion) => {
                    const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
                    const style = suggestion.active
                      ? { backgroundColor: "#fafafa", cursor: "pointer" }
                      : { backgroundColor: "#ffffff", cursor: "pointer" };
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style,
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </SuggestionsContainer>
              </div>
            )}
          </PlacesAutocomplete>
          <Input
            type="text"
            name="houseNumber"
            placeholder="Numer domu"
            value={formData.houseNumber}
            onChange={handleChange}
            disabled={!formData.street}
            required
          />
          <Input type="text" name="postalCode" placeholder="Kod pocztowy" value={formData.postalCode} readOnly />
          <PaymentMethodSelector>
            <label>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Karta
            </label>
            <label>
              <input
                type="radio"
                value="blik"
                checked={paymentMethod === "blik"}
                onChange={() => setPaymentMethod("blik")}
              />
              BLIK
            </label>
          </PaymentMethodSelector>
          {paymentMethod === "card" && (
            <CardElementContainer>
              <CardElement options={cardElementOptions} />
            </CardElementContainer>
          )}
          {paymentMethod === "blik" && (
            <BlikCodeInput
              type="text"
              placeholder="Wprowadź kod BLIK"
              value={blikCode}
              onChange={(e) => setBlikCode(e.target.value)}
            />
          )}
          {paymentRequest && (
            <PaymentRequestButtonContainer>
              <PaymentRequestButtonElement options={{ paymentRequest }} />
            </PaymentRequestButtonContainer>
          )}
          <SubmitButton type="submit" disabled={!stripe}>
            Dokonaj płatności
          </SubmitButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>Płatność zakończona sukcesem!</SuccessMessage>}
        </FormContainer>
      ) : null}
    </>
  );
};

// --- Styled Components ---
const Header = styled(Container)``;

const FormContainer = styled.form`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 40px 40px 20px 40px;
  border: 1.5px solid black;
  background-color: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;

  &:focus {
    outline: none;
    border: 1.5px solid black;
  }
`;

const PaymentMethodSelector = styled.div`
  margin-bottom: 20px;
  label {
    margin-right: 10px;
  }
`;

const CardElementContainer = styled.div`
  margin-bottom: 20px;
`;

const BlikCodeInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const PaymentRequestButtonContainer = styled.div`
  margin-bottom: 20px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: rgba(150, 0, 0, 0.7);
  color: white;
  border: none;
  font-size: 16px;
  transition: ease-in 0.2s;
  cursor: pointer;

  &:disabled {
    background-color: #bbb;
    cursor: not-allowed;
  }

  &:hover {
    background-color: rgb(150, 0, 0);
    letter-spacing: 0.2px;
  }
`;

const ErrorMessage = styled.div`
  color: rgb(150, 0, 0);
  margin-top: 15px;
  font-size: 12px;
`;

const SuccessMessage = styled.div`
  color: #bca600;
  margin-top: 10px;
`;

const SuggestionsContainer = styled.div`
  * {
    letter-spacing: 0.5px;
  }

  > :last-child {
    margin-bottom: 20px;
  }
`;

export default PaymentForm;
