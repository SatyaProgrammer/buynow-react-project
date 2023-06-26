# BuyNow API: List Users

| Key      | Value                      |
| -------- | -------------------------- |
| Endpoint | `api.localhost/users/list` |
| Method   | `GET`                      |
| Auth     | `Yes`                      |

## Headers

| Key           | Value              |
| ------------- | ------------------ |
| Content-Type  | `application/json` |
| Authorization | `Basic <token>`    |

## Response

200:

```ts
{
    users: {
        id: number,
        username: string,
        email: string,
        verified: boolean,
        is_admin: boolean
    }[]
}
```

4xx/5xx:

```ts
{   
    "error_code": string, // "BXxxxx"
    "error": string,
}
```
