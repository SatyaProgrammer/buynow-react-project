# Buynow API: Login

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/auth/login` |
| Method | `POST` |
| Auth | `No` |

## Headers

| Key | Value |
| --- | --- |
| Content-Type | `application/json` |

## Request

```ts
{
    "email": string,
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
    "error": string,
}
```

## Note

The response token is a JWT token. You need to add this token to the `Authorization` header of all requests that require authentication.

The token is valid for 1 hour.
