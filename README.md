Based on [`ActixBase`](https://github.com/DawidKrok/ActixBase).

## Important
`.env` file must be added:
```
SERVER.HOST = 127.0.0.1
SERVER.PORT = 8080
```

# Crate structure

(For now there's only one crate)

### server
Contains [`main`](server/src/main.rs) binary file that runs Actix's [`HttpServer`](https://actix.rs/docs/server/).  
[`config.rs`](server/src/config.rs) loads variables from `.env` file.  
[`routes.rs`](server/src/routes.rs) contains modules with [handlers](https://actix.rs/docs/handlers/). They're meant to assign bussiness logic to endpoints and handle exceptions.


## Static folder
Contains all static recsources that'll be exposed to client.