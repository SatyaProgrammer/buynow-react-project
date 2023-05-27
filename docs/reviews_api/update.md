# BuyNow API: Update Review

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/reviews/<pid>` |
| Method | `PATCH` |
| Auth | `Yes` |

## Headers

| Key | Value |
| --- | --- |
| Content-Type | `application/json` |

## Request

```ts
{
    rating: number,
    comment: string
}
```

## Response

200:

```ts
{
    "message": string,
}
```
