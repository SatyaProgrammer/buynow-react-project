# BuyNow API: Is Admin?

| Key      | Value                          |
| -------- | ------------------------------ |
| Endpoint | `api.localhost/users/is_admin` |
| Method   | `GET`                          |
| Auth     | `Yes`                          |

## Headers

| Key           | Value              |
| ------------- | ------------------ |
| Content-Type  | `application/json` |
| Authorization | `Basic <token>`    |

## Response

200:

```ts
{
    "is_admin": boolean
}
```

4xx/5xx:

```ts
{   
    "error_code": string, // "BXxxxx"
    "error": string,
}
```
