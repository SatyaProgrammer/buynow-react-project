# BuyNow API: Forgot Password

| Key      | Value                       |
| -------- | --------------------------- |
| Endpoint | `api.localhost/auth/forgot` |
| Method   | `POST`                      |
| Auth     | `No`                        |

## Headers

| Key          | Value              |
| ------------ | ------------------ |
| Content-Type | `application/json` |

## Request

```ts
{
    password: string,
    token: string
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
