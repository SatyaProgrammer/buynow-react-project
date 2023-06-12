# BuyNow API: Update Profile Customization

| Key      | Value                         |
| -------- | ----------------------------- |
| Endpoint | `api.localhost/customization` |
| Method   | `PUT`                         |
| Auth     | `Yes`                         |

## Headers

| Key           | Value              |
| ------------- | ------------------ |
| Content-Type  | `application/json` |
| Authorization | `Basic <token>`    |

## Request

```ts
{
    theme: string,
    image: string | null,
    phone: string | null,
    contact_info: string | null
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
    error_code: string,
    error: string
}
```
