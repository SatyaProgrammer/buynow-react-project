# BuyNow API: Get Reviews

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/reviews/<pid>` |
| Method | `GET` |
| Auth | `No` |

## Headers

| Key | Value |
| --- | --- |
| Content-Type | `application/json` |

## Response

200:

```ts
{
    reviews: {
        id: number,
        username: string,
        rating: number,
        review: string,
    }[]
}
```
