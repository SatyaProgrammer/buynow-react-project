# BuyNow API: Get My Orders

| Key      | Value                        |
| -------- | ---------------------------- |
| Endpoint | `api.localhost/trackings/me` |
| Method   | `GET`                        |
| Auth     | `Yes`                        |

## Headers

| Key          | Value              |
| ------------ | ------------------ |
| Content-Type | `application/json` |

## Response

200:

```ts
{
    orders: {
        trackingNumber: number,
        pid: string,
        name: string,
        images: string[],
        customization: {
            [string]: string[]
        },
        quantity: number,
        cost: number
    }[]
}
```

4xx/5xx:

```ts
{   
    "error_code": string, // "BXxxxx"
    "error": string,
}
```
