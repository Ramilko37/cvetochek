# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>

## Robokassa Integration

Backend already contains API endpoints for Robokassa:

- `POST /api/payments/robokassa/init`
- `POST /api/payments/robokassa/result` (also `GET` for quick manual checks)
- `GET|POST /api/payments/robokassa/success`
- `GET|POST /api/payments/robokassa/fail`

### Required env vars

See `.env.example` for full list:

- `ROBOKASSA_MERCHANT_LOGIN`
- `ROBOKASSA_PASSWORD1`
- `ROBOKASSA_PASSWORD2`

Optional:

- `ROBOKASSA_HASH_ALGORITHM` (`md5` by default, also supports `sha256`, `sha512`)
- `ROBOKASSA_IS_TEST=true`
- `ROBOKASSA_PAYMENT_URL`
- `ROBOKASSA_SUCCESS_URL`, `ROBOKASSA_FAIL_URL`, `ROBOKASSA_RESULT_URL`
- `ROBOKASSA_FRONTEND_SUCCESS_URL`, `ROBOKASSA_FRONTEND_FAIL_URL`
- `ROBOKASSA_RECEIPT_TAX` (`none`, `vat0`, `vat10`, `vat20`, `vat110`, `vat120`, `vat22`, `vat122`, `vat5`, `vat7`, `vat105`, `vat107`)
- `ROBOKASSA_RECEIPT_PAYMENT_METHOD` (`full_prepayment` by default)
- `ROBOKASSA_RECEIPT_PAYMENT_OBJECT` (`commodity` by default)
- `ROBOKASSA_RECEIPT_SNO` (`osn`, `usn_income`, `usn_income_outcome`, `esn`, `patent`)

### Init request example

```bash
curl -X POST http://localhost:1337/api/payments/robokassa/init \
  -H "Content-Type: application/json" \
  -d '{
    "orderId":"order-1001",
    "amount":"1500.00",
    "description":"Order #1001",
    "email":"buyer@example.com",
    "receipt":{
      "items":[
        {"name":"Букет роз","quantity":1,"sum":1500}
      ]
    },
    "shp":{"orderId":"order-1001"}
  }'
```

Response contains `paymentUrl`; redirect customer to this URL.

### ResultURL callback behavior

- verifies `SignatureValue`
- updates `payment` status to `paid` idempotently
- returns exact `OK{InvId}` text for Robokassa

### Robokassa cabinet checklist

- Set `Result URL` to your public backend endpoint: `/api/payments/robokassa/result`
- Set `Success URL` and `Fail URL` to backend endpoints or frontend pages (depending on your flow)
- Use the same hash algorithm in cabinet and `ROBOKASSA_HASH_ALGORITHM`
- For testing, enable test mode in both cabinet and `ROBOKASSA_IS_TEST=true`

## CMS Catalog (Strapi v5)

Added content structures for managing storefront data from Strapi admin:

- Collection types: `Category`, `Product`, `Banner`, `Page`
- Single type: `Site Settings`
- Components: `shared.seo`, `catalog.product-size`, `catalog.product-option`, `catalog.delivery-interval`, `catalog.product-composition`, `catalog.hero-slide`

All public catalog reads are served via custom API using Document Service (`strapi.documents`).

### Public catalog endpoints

- `GET /api/catalog/public`
- `GET /api/catalog/public/products/:slug`
- `GET /api/catalog/public/categories`
- `GET /api/catalog/public/banners`
- `GET /api/catalog/public/pages/:slug`
- `GET /api/catalog/public/settings`

For correct absolute media links in JSON responses, set:

- `STRAPI_PUBLIC_URL=https://api.your-domain.tld`

### Frontend integration

Frontend product hook first tries `GET /api/catalog/public` and falls back to legacy Telegram JSON if CMS is empty/unavailable.

Optional frontend env overrides:

- `NEXT_PUBLIC_STRAPI_URL`
- `NEXT_PUBLIC_CATALOG_PUBLIC_URL`
- `NEXT_PUBLIC_ROBOKASSA_INIT_URL`

### Admin panel setup

1. Open `/admin` on your Strapi domain.
2. Create the first admin account (if not initialized yet).
3. Fill `Category`, `Product`, `Banner`, `Page`, `Site Settings`.
4. Publish records (drafts are not returned by public catalog API).
