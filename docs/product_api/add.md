# BuyNow API: Add Product

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/products/add` |
| Method | `POST` |
| Auth | `Yes` |

## Headers

| Key | Value |
| --- | --- |
| Content-Type | `application/json` |

## Request

```ts
{
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

## Response

200:

```ts
{
    "pid": string,
}
```

4xx/5xx:

```ts
{   
    "error_code": string, // "BXxxxx"
    "error": string,
}
```
