# BuyNow API: Get User Info

| Key      | Value                       |
| -------- | --------------------------- |
| Endpoint | `api.localhost/users/<uid>` |
| Auth     | `No`                        |

## Headers

| Key          | Value              |
| ------------ | ------------------ |
| Content-Type | `application/json` |

## Response

200:

```ts
{
    uid: number,
    username: string,
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
