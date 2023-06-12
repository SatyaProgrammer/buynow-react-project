# BuyNow API: Get Profile Customization

| Key      | Value                         |
| -------- | ----------------------------- |
| Endpoint | `api.localhost/customization` |
| Method   | `GET`                         |
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
    id: number,
    username: string, 
    theme: string,
    image: string | null,
    phone: string | null,
    contact_info: string | null
}
```

4xx/5xx:

```ts
{
    error_code: string,
    error: string
}
```
