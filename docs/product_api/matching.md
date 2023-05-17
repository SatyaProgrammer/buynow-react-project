# BuyNow API: Fetch Matching

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/products/matching?[k=v]` |
| Method | `GET` |
| Auth | `No` |

## Headers

| Key | Value |
| --- | --- |
| Content-Type | `application/json` |

## Query Parameters

Any of the following query parameters can be used to filter the results.

```ts
{
    "pid": string,
    "name": string,
    "price": number,
    "rating": number,
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

Search by `category` or `owner` is not supported by this endpoint. Use the dedicated `/products/category?cat=<category>` and `/products/owner?owner=<owner>` endpoints instead.

Search by `customization` is not supported either.
