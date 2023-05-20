# BuyNow API: Delete Product

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/products/delete` |
| Method | `POST` |
| Auth | `Yes` |

## Headers

| Key | Value |
| --- | --- |
| Content-Type | `application/json` |
| Authorization | `Basic <token>` |

## Request

```ts
{
    "pid": string,
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
