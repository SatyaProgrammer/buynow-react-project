# BuyNow: Product Fetch API

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/products/<product_id>` |
| Method | `GET` |
| Auth | `No` |

## Headers

| Key | Value |
| --- | --- |
| Content-Type | `application/json` |

## Response

200:

```ts
{
    "pid": string,
    "name": string,
    "images": {
        "images": string[]
    },
    "category": string,
    "owner": string,
    "price": number,
    "customization": {
        [string]: string[]
    },
    "rating": string,
    "description": string,
    "availability": number,
    "deliveryOption": string,
}
```

4xx/5xx:

```ts
{   
    "error_code": string, // "BXxxxx"
    "error": string,
}
```

## Note

The `customization` field is a map of customization options. The key is the name of the customization option, and the value is an array of possible values for that option.
