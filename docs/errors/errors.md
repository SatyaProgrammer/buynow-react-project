# BuyNow API: Error codes

- [BuyNow API: Error codes](#buynow-api-error-codes)
  - [BX0xxx: Auth errors](#bx0xxx-auth-errors)
    - [BX00xx: General auth errors](#bx00xx-general-auth-errors)
    - [BX01xx: Login errors](#bx01xx-login-errors)
    - [BX02xx: Register errors](#bx02xx-register-errors)
    - [BX03xx: Verify errors](#bx03xx-verify-errors)
  - [BX1xxx: Product errors](#bx1xxx-product-errors)
    - [BX10xx: General product errors](#bx10xx-general-product-errors)
    - [BX11xx: Fetch product errors](#bx11xx-fetch-product-errors)
    - [BX12xx: General Product Manipulation errors](#bx12xx-general-product-manipulation-errors)
  - [BX99xx: Absurd errors](#bx99xx-absurd-errors)

## BX0xxx: Auth errors

### BX00xx: General auth errors

| Code | Message |
| --- | --- |
| BX0000 | Unknown error |
| BX0001 | Not authorized/Missing token |

### BX01xx: Login errors

| Code | Message |
| --- | --- |
| BX0101 | Invalid login username or password |

### BX02xx: Register errors

| Code | Message |
| --- | --- |
| BX0201 | Missing required fields |
| BX0202 | Invalid password |
| BX0203 | Invalid email |
| BX0204 | Username already exists |
| BX0205 | Email already exists |

### BX03xx: Verify errors

| Code | Message |
| --- | --- |
| BX0301 | Invalid token |

## BX1xxx: Product errors

### BX10xx: General product errors

| Code | Message |
| --- | --- |
| BX1000 | Unknown error |

### BX11xx: Fetch product errors

| Code | Message |
| --- | --- |
| BX1101 | Invalid product id |

### BX12xx: General Product Manipulation errors

| Code | Message |
| --- | --- |
| BX1201 | Not a vendor |
| BX1202 | Invalid category |
| BX1203 | Invalid JSON |
| BX1204 | Invalid price |
| BX1205 | Invalid product ID |
| BX1206 | Product does not exists |
| BX1207 | You don't own the product |
| BX1299 | Unknown upstream error |

## BX99xx: Absurd errors

| Code | Message |
| --- | --- |
| BX9901 | Not logged in |
