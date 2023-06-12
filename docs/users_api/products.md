# BuyNow API: Get User Products

| Key      | Value                                |
| -------- | ------------------------------------ |
| Endpoint | `api.localhost/users/<uid>/products` |
| Auth     | `No`                                 |

## Headers

| Key          | Value              |
| ------------ | ------------------ |
| Content-Type | `application/json` |

## Response

200:

```ts
{
    products: {
        id: number,
        pid: string,
        name: string,
        images: {
            images: string[]
        },
        customization: {
            [string]: string[]
        },
        catName: string,
        ownerName: string,
        price: number,
        rating: number,
        description: string,
        availability: number,
        deliveryOption: string,
    }
}
```

4xx/5xx:

```ts
{
    error_code: string,
    error: string
}
```
