# BuyNow API: Delete Profile Customization

| Key      | Value                         |
| -------- | ----------------------------- |
| Endpoint | `api.localhost/customization` |
| Method   | `DELETE`                      |
| Auth     | `Yes`                         |

## Headers

| Key           | Value              |
| ------------- | ------------------ |
| Content-Type  | `application/json` |
| Authorization | `Basic <token>`    |

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
    error_code: string,
    error: string
}
```
