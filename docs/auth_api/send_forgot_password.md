# BuyNow API: Send Forgot Password Email

| Key      | Value                            |
| -------- | -------------------------------- |
| Endpoint | `api.localhost/auth/send_forgot` |
| Method   | `POST`                           |
| Auth     | `No`                             |

## Headers

| Key          | Value              |
| ------------ | ------------------ |
| Content-Type | `application/json` |

## Request

```ts
{
    email: string
}
```

## Response

200:

```ts
{
    message: string
}
```

4xx/5xx:

```ts
{   
    "error_code": string, // "BXxxxx"
    "error": string,
}
```
