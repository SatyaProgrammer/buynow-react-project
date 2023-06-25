# BuyNow API: Change Password

| Key      | Value                                |
| -------- | ------------------------------------ |
| Endpoint | `api.localhost/auth/change_password` |
| Method   | `POST`                               |
| Auth     | `Yes`                                |

## Headers

| Key           | Value              |
| ------------- | ------------------ |
| Content-Type  | `application/json` |
| Authorization | `Basic <token>`    |

## Request

```ts
{
    old_password: string,
    new_password: string
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
