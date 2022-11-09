use actix_web::web;

/// Function registering all Routes from `routes.rs`
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        pages::index
    );
}


//==========| ROUTES |========= 
mod pages {
    use actix_web::{HttpResponse, get, Responder, post};

    // ===========| GET |===========
    #[get("/")]
    async fn index() -> impl Responder {
        HttpResponse::Ok()
            .json("k")
    }
}