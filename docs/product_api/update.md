# BuyNow API: Update Product

| Key      | Value                           |
| -------- | ------------------------------- |
| Endpoint | `api.localhost/products/update` |
| Method   | `POST`                          |
| Auth     | `Yes`                           |

## Headers

| Key           | Value              |
| ------------- | ------------------ |
| Content-Type  | `application/json` |
| Authorization | `Basic <token>`    |

## Request

```ts
{
    "pid": string,
    "name": string,
    "images": {
        "images": string[]
    },
    "category": string,
    "price": number,
    "customization": {
        [string]: string[]
    },
    "description": string,
    "availability": number,
    "deliveryOption": string,
}
```
