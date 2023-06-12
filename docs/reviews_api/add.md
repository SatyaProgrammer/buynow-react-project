# BuyNow API: Add Reviews

| Key      | Value                         |
| -------- | ----------------------------- |
| Endpoint | `api.localhost/reviews/<pid>` |
| Method   | `POST`                        |
| Auth     | `Yes`                         |

## Headers

| Key          | Value              |
| ------------ | ------------------ |
| Content-Type | `application/json` |

## Request

```ts
{
    rating: number,
    comment: string
}
```

## Response

201:

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

## Note

`rating` $\in [1, 5]$ (between 1 and 5, inclusive).
