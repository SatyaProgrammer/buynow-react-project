# BuyNow API: Get Trackings

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/trackings` |
| Method | `GET` |
| Auth | `Yes` |

## Headers

| Key | Value |
| --- | --- |
| Content-Type | `application/json` |
| Authorization | `Basic <token>` |

## Response

200:

```ts
{
    trackings: {
        id: number,
        status: string,
        userId: number,
    }[]
}
{
    "tracking": {
        "id": string,
        "status": string,
        "userId": number
    }
}
```

4xx/5xx:

```ts
{   
    "error_code": string, // "BXxxxx"
    "error": string,
}
```
