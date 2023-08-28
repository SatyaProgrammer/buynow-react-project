# Buynow API: Login

| Key      | Value                      |
| -------- | -------------------------- |
| Endpoint | `api.localhost/auth/login` |
| Method   | `POST`                     |
| Auth     | `No`                       |

## Headers

| Key          | Value              |
| ------------ | ------------------ |
| Content-Type | `application/json` |

## Request

```ts
{
    "username": string,
    "password": string,
}
```

## Response

200:

```ts
{
    "token": string,
}
```

4xx/5xx:

```ts
{   
    "error_code": string, // "BXxxxx"
    "error": string,
}
```

## Note

The response token is a JWT token. You need to add this token to the `Authorization` header of all requests that require authentication.

Example token: `eyJh.SknO.1Q`.

Add it to the `Authorization` header as `Basic eyJh.SknO.1Q`.

The token is valid for 1 hour.
