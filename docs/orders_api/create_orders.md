# BuyNow API: Create Orders

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/trackings` |
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
    orders: {
        pid: string,
        quantity: number,
    }[]
}
```

## Response

201:

```ts
{
    "message": string,
}
```

4xx/5xx:

```ts
{   
    "error_code": string, // "BXxxxx"
    "error": string,
}
```
