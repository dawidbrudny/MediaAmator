import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import App from "./App.tsx";

const stripePromise = loadStripe(
  "pk_test_51PjAJJP6y9WsEDaQaTmIm4GKKfXVWZP3MYKPtnDK6yMqbpe8ST1S6glTGvBdJUUDiGhuOrmVRp7pkIQ4AzCjkcuA00KMd8VUQd"
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </Provider>
    </Router>
  </React.StrictMode>
);
