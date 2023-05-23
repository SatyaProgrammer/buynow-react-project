# BuyNow API: My Products

| Key | Value |
| --- | --- |
| Endpoint | `api.localhost/products/me` |
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
    products: {
        pid: string,
        name: string,
        images: {
            images: string[]
        },
        category: string,
        owner: string,
        price: number,
        customization: {
            [string]: string[]
        },
        rating: string,
        description: string,
    }[]
}
```
