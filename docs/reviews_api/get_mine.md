# BuyNow API: Get My Review

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/reviews/<pid>/me` |
| Method | `GET` |
| Auth | `Yes` |

## Headers

| Key | Value |
| --- | --- |
| Content-Type | `application/json` |

## Response

200:

```ts
{
    id: number,
    rating: number,
    comment: string,
}
```

4xx/5xx:

```ts
{   
    "error_code": string, // "BXxxxx"
    "error": string,
}
```
