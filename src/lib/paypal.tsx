"use client";
import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

export default function App() {
  const initialOptions: ReactPayPalScriptOptions = {
    currency: "USD",
    clientId: "AQlXKqqXXN1TAWPDd8t2IrQycN-1DSSwPcea4dX7CsD5tt12YCEHXZqK9zJAZInNhk4LPbD3FtTvw1gh",
  };

  const router = useRouter();

  const createOrder: PayPalButtonsComponentProps["createOrder"] = async () => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart: [
          {
            sku: "dazd15c",
            quantity: "1",
          },
        ],
      }),
    });

    const data = await response.json();

    return data.id;
  };

  const onApprove: PayPalButtonsComponentProps["onApprove"] = async (data) => {
    // Capture the funds from the transaction.
    const response = await fetch("/api/orders/capture", {
      method: "POST",
      body: JSON.stringify({
        orderID: data.orderID,
      }),
    });

    const details = await response.json();
    console.log(details);
    // Show success message to buyer
    // alert(`Transaction completed by ${details.payer.name.given_name}`);
    if (details.status === "COMPLETED") {
      router.push("/success");
    } else {
      router.push("/failure");
    }
  };

  return (
    <div className="App">
      <PayPalScriptProvider
        options={initialOptions}>
        <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
      </PayPalScriptProvider>
    </div>
  );
}
