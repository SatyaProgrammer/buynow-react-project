# BuyNow API: Delete Review

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/reviews/<pid>` |
| Method | `DELETE` |
| Auth | `Yes` |

## Headers

| Key | Value |
| --- | --- |
| Content-Type | `application/json` |

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
