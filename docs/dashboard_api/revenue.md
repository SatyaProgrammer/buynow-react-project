# BuyNow API: Revenue

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/dashboard/revenue` |
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
    revenue: number
}
```

4xx/5xx:

```ts
{   
    "error_code": string, // "BXxxxx"
    "error": string,
}
```
