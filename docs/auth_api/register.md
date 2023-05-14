# BuyNow API: Register

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/auth/register` |
| Method | `POST` |
| Auth | `No` |

## Headers

| Key | Value |
| --- | --- |
| Content-Type | `application/json` |

## Request

```ts
{
    "username": string,
    "password": string,
    "email": string
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
