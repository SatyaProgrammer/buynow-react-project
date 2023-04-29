# Buynow API: Login

| Key | Value | Description |
| --- | --- | --- |
| Endpoint | `api.localhost/auth/login` | |
| Method | `POST` | |
| Auth | `No` | |

## Headers

| Key | Value |
| --- | --- |
| Content-Type | `application/json` |
| Accept | `application/json` |

## Request

```ts
{
    "email": string,
    "password": string,
    "pub_key": string,
}
```

## Response

```ts
{
    "token": string,
}
```

## Note
