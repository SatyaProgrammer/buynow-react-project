# BuyNow API: Get Orders Count

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/dashboard/orders_count` |
| Method | `GET` |
| Auth | `Yes` |

## Headers

| Key | Value |
| --- | --- |
| Content-Type | `application/json` |
| Authorization | `Basic <token>` |

## Response

200:

```ts
{
    count: number
}
```

4xx/5xx:

```ts
{   
    "error_code": string, // "BXxxxx"
    "error": string,
}
```
