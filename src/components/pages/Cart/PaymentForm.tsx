import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { resetCart } from "../../../redux/cartSlice";
import { CardElement, useStripe, useElements, PaymentRequestButtonElement } from "@stripe/react-stripe-js";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

import { z } from "zod";

import Container from "../../UI/Container";
import Headers from "../../UI/ChooseHeader";
import styled from "styled-components";

type LatLngLiteral = {
  lat: number;
  lng: number;
};

const paymentSchema = z.object({
  firstName: z
    .string()
    .nonempty({ message: "Imię jest wymagane" })
    .min(3, { message: "Imię musi zawierać co najmniej 3 znaki" })
    .regex(/^[a-zA-Z]+$/, { message: "Imię może zawierać tylko litery" }),
  lastName: z
    .string()
    .nonempty({ message: "Nazwisko jest wymagane" })
    .min(3, { message: "Nazwisko musi zawierać co najmniej 3 znaki" })
    .regex(/^[a-zA-Z]+$/, { message: "Nazwisko może zawierać tylko litery" }),
  city: z.string().nonempty({ message: "Miasto jest wymagane" }),
  street: z.string().nonempty({ message: "Ulica jest wymagana" }),
  houseNumber: z
    .string()
    .nonempty({ message: "Numer domu jest wymagany" })
    .regex(/^[0-9]+[a-zA-Z]*$/, { message: "Nieprawidłowy numer domu" })
    .transform((val) => val.toUpperCase())
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val > 0, { message: "Numer domu musi być prawidłową liczbą dodatnią" }),
  postalCode: z
    .string()
    .nonempty({ message: "Kod pocztowy jest wymagany" })
    .regex(/^[0-9]{2}-[0-9]{3}$/, { message: "Kod pocztowy musi być w formacie XX-XXX" }),
  paymentMethod: z.enum(["card", "blik"], { message: "Wybierz metodę płatności" }),
});

const blikCodeSchema = z
  .string()
  .nonempty({ message: "Kod BLIK jest wymagany" })
  .regex(/^[0-9]{6}$/, { message: "Kod BLIK musi składać się z 6 cyfr" });

const PaymentForm = () => {
  const dispatch = useAppDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState<string | null>(null);
  const [zodErrors, setZodErrors] = useState<Record<string, string>>({});
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
    paymentMethod: "card",
  });

  const paymentRequest = null;

  const login = useAppSelector((state) => state.login.isLoggedIn);
  const cart = useAppSelector((state) => state.cart.quantity);
  const banned = useAppSelector((state) => state.login.banned);

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
      let postalCode = addressComponents.find((component) => component.types.includes("postal_code"))?.short_name || "";

      if (addressComponents.find((component) => component.types.includes("postal_code_prefix"))) {
        const postalCodePrefix =
          addressComponents.find((component) => component.types.includes("postal_code_prefix"))?.long_name || "";
        postalCode = postalCodePrefix;
      }

      setFormData((prevData) => ({
        ...prevData,
        street: address, // Ustawienie pełnej nazwy ulicy
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
      paymentMethod: "card",
    });
    setBlikCode("");
    setPaymentMethod("card");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (formData.city) {
      geocodeByAddress(formData.city)
        .then((results) => getLatLng(results[0]))
        .then((latLng) => setCityLatLng(latLng))
        .catch((error) => {
          console.error("Error fetching city coordinates:", error);
          if (error === "ZERO_RESULTS") {
            setZodErrors((prevErrors) => ({
              ...prevErrors,
              city: "Nie znaleziono wyników dla podanego miasta. Sprawdź poprawność nazwy miasta.",
            }));
          } else {
            setZodErrors((prevErrors) => ({
              ...prevErrors,
              city: "Nieprawidłowe miasto. Dokonaj lepiej wyboru z pomocą podpowiedzi",
            }));
          }
        });
    }

    if (formData.street) {
      geocodeByAddress(formData.street).catch((error) => {
        console.error("Error fetching street coordinates:", error);
        if (error === "ZERO_RESULTS") {
          setZodErrors((prevErrors) => ({
            ...prevErrors,
            street: "Nie znaleziono wyników dla podanej nazwy ulicy. Sprawdź poprawność nazwy.",
          }));
        } else {
          console.log(error);
          setZodErrors((prevErrors) => ({
            ...prevErrors,
            street: "Nieprawidłowa nazwa ulicy. Dokonaj lepiej wyboru z pomocą podpowiedzi",
          }));
        }
      });
    }

    const formResult = paymentSchema.safeParse(formData);
    if (!formResult.success) {
      const newErrors: Record<string, string> = {};
      formResult.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setZodErrors(newErrors);
      return;
    }
    setZodErrors({});

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
      // if (!blikCode) {
      //   setError("Kod BLIK jest wymagany");
      //   return;
      // }
      const blikCodeValidation = blikCodeSchema.safeParse(blikCode);
      if (!blikCodeValidation.success) {
        setError(blikCodeValidation.error.issues[0].message);
        return;
      }
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
        backgroundColor: "#fff8db",
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

  function handleInfo() {
    if (loading) return "Loading...";
    if (banned) return "Brak dostępu";
    if (login) {
      if (cart) return "Płatność";
      else return "Koszyk jest pusty";
    } else return "Zaloguj się";
  }

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(resetCart());
        setSuccess(false);
      }, 3000);
    }

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [success, dispatch]);

  return (
    <>
      <Header as={Headers} level={2}>
        {handleInfo()}
      </Header>

      {login && cart && !loading && !banned ? (
        <FormContainer onSubmit={handleSubmit}>
          {zodErrors.firstName && <ZodErrorMessage>{zodErrors.firstName}</ZodErrorMessage>}
          <Input
            type="text"
            name="firstName"
            placeholder="Imię"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          {zodErrors.lastName && <ZodErrorMessage>{zodErrors.lastName}</ZodErrorMessage>}
          <Input
            type="text"
            name="lastName"
            placeholder="Nazwisko"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          {zodErrors.city && <ZodErrorMessage>{zodErrors.city}</ZodErrorMessage>}
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
                    .map((suggestion, index) => {
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
                          key={index}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                </SuggestionsContainer>
              </div>
            )}
          </PlacesAutocomplete>

          {zodErrors.street && <ZodErrorMessage>{zodErrors.street}</ZodErrorMessage>}
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
                  {suggestions.map((suggestion, index) => {
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
                        key={index}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </SuggestionsContainer>
              </div>
            )}
          </PlacesAutocomplete>

          {zodErrors.houseNumber && <ZodErrorMessage>{zodErrors.houseNumber}</ZodErrorMessage>}
          <Input
            type="number"
            name="houseNumber"
            placeholder="Numer domu"
            value={formData.houseNumber}
            onChange={handleChange}
            disabled={!formData.street}
            required
          />

          {zodErrors.postalCode && <ZodErrorMessage>{zodErrors.postalCode}</ZodErrorMessage>}
          <Input
            type="text"
            name="postalCode"
            placeholder="Kod pocztowy"
            value={formData.postalCode}
            onChange={handleChange}
          />

          {zodErrors.paymentMethod && <ZodErrorMessage>{zodErrors.paymentMethod}</ZodErrorMessage>}
          <PaymentMethodSelector>
            <label>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => {
                  setPaymentMethod("card");
                  setFormData((prevData) => ({ ...prevData, paymentMethod: "card" }));
                }}
              />
              Karta
            </label>

            <label>
              <input
                type="radio"
                value="blik"
                checked={paymentMethod === "blik"}
                onChange={() => {
                  setPaymentMethod("blik");
                  setFormData((prevData) => ({ ...prevData, paymentMethod: "card" }));
                }}
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
              type="number"
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
          {success && (
            <SuccessMessage>
              Płatność zakończona sukcesem! <br />
              Czekaj...
            </SuccessMessage>
          )}
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

  &:focus {
    outline: none;
    border: 1.5px solid black;
  }
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

const ZodErrorMessage = styled(ErrorMessage)`
  margin: 0;
`;

const SuccessMessage = styled.div`
  color: #7d5e00;
  font-weight: bold;
  margin: 20px 0;
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
