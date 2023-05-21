# BuyNow API: Get Customers Count

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/dashboard/customers_count` |
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
    total_customers: number,
    unique_customers: number,
}
```

4xx/5xx:

```ts
{   
    "error_code": string, // "BXxxxx"
    "error": string,
}
```
