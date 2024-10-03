import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { cart } = await req.json();
        const response = await createOrder(cart);

        // Return the response wrapped in a NextResponse object
        return NextResponse.json(response); // Sending back JSON response with a 200 status by default
    } catch (error) {
        console.error("Error in POST request:", error);
        // In case of error, return a 500 status with error message
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}

const generateAccessToken = async () => {
    const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;
    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
        throw new Error("Missing PayPal credentials");
    }

    // Proper Base64 encoding of client credentials
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');

    const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${auth}`, // Properly encoded auth string
        },
        body: "grant_type=client_credentials"
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Error fetching access token: ${error.error_description}`);
    }

    const data = await response.json();
    return data.access_token;
}

const createOrder = async () => {
    const accessToken = await generateAccessToken();
 
    const response = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        purchase_units: [
            {
                items: [
                    {
                        name: 'Node.js Complete Course',
                        description: 'Node.js Complete Course with Express and MongoDB',
                        quantity: 1,
                        unit_amount: {
                            currency_code: 'USD',
                            value: '100.00'
                        }
                    }
                ],

                amount: {
                    currency_code: 'USD',
                    value: '100.00',
                    breakdown: {
                        item_total: {
                            currency_code: 'USD',
                            value: '100.00'
                        }
                    }
                }
            }
        ],
        "intent": "CAPTURE",
        "application_context": {
          "return_url": "https://example.com/return",
          "cancel_url": "https://example.com/cancel",
          "shipping_preference": "NO_SHIPPING",
          "user_action": "PAY_NOW",
          "brand_name": "Example.com",
        }
      }),
    });
  
    const data = await response.json();    
    return data;
  };
  



