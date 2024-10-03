import { type NextRequest , NextResponse } from "next/server";

const generateAccessToken = async () => {
    const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
        throw new Error("Missing PayPal credentials");
    }

    const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_SECRET).toString("base64");

    const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${auth}`
        },
        body: new URLSearchParams({
            grant_type: "client_credentials"
        })
    });

    const data = await response.json();
    return data.access_token;

}
const capturePayment = async (orderId: string) => {
    const accessToken = await generateAccessToken();

    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    });

    const data = await response.json();
    return data;
}

export async function POST(req: NextRequest) {
    try {
        const { orderID } = await req.json();
        const response = await capturePayment(orderID);
        console.log(response)
        // Return the response wrapped in a NextResponse object
        return NextResponse.json(response); // Sending back JSON response with a 200 status by default
    } catch (error) {
        console.error("Error in POST request:", error);
        // In case of error, return a 500 status with error message
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}