# Trello-API

Application is a simple Crud. It contains:
- POST, PUT, DELETE, GET methods

- Request validation (Joi Schema)

- Error handling

- Winston logger


## To Begin
Install dependencies
```
npm i
```
### Production env

To work in production the __.env__ file has to be created, then place there:
```
NODE_ENV=production
```
After write in console

__REMARK__: This step is for both dev and prod env
```
npm run start
```
-------

## URL Paths
For POST, PUT, DELETE actions the __X-Access-Token header__ is required. The header value is stored in authorize folder in __token.json__ file.

__REMARK__: If no header provided for above requests the Access denied error will be thrown
### URL Paths - Board router
```
[GET_ALL_ELEMENTS, POST] = http://localhost:3000/
[DELETE, UPDATE, GET_BY_ID ] = http://localhost:3000/<ITEM_ID>
```

### URL Paths - Card router
```
[GET_ALL_ELEMENTS, POST] = http://localhost:3000/<BOARD_ITEM_ID>
[DELETE, UPDATE, GET_BY_ID ] = http://localhost:3000/<BOARD_ITEM_ID>/<CARD_ITEM_ID>
```

