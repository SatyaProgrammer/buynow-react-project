# BuyNow API: Getting orders associated with a tracking number

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/trackings/<tracking_number>` |
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
    "orders": {
        "trackingNumber": string,
        "pid": string,
        "name": string,
        "images": {
            "images": string[]
        },
        "customization": {
            [string]: string[]
        },
        "quantity": number,
        "cost": number,
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
