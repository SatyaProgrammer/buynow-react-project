# BuyNow API: Categories

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/categories` |
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
    "categories": {
        id: string,
        name: string,
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
