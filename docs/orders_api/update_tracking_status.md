# BuyNow API: Update Tracking Status

| Key      | Value                                       |
| -------- | ------------------------------------------- |
| Endpoint | `api.localhost/trackings/<tracking_number>` |
| Method   | `POST`                                      |
| Auth     | `Yes`                                       |

## Headers

| Key           | Value              |
| ------------- | ------------------ |
| Content-Type  | `application/json` |
| Authorization | `Basic <token>`    |

## Request

```ts
{
    status: string,
}
```

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

## Note

This endpoint can only be accessed by admins.
