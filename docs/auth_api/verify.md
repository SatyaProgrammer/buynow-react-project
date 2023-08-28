# BuyNow API: Verify

| Key      | Value                       |
| -------- | --------------------------- |
| Endpoint | `api.localhost/auth/verify` |
| Method   | `POST`                      |
| Auth     | `No`                        |

## Headers

| Key          | Value              |
| ------------ | ------------------ |
| Content-Type | `application/json` |

## Request

```ts
{
    "token": string,
}
```

## Response

200:

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
