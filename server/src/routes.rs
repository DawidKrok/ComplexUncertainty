use actix_web::web;

/// Function registering all Routes from `routes.rs`
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        pages::index
    );
}



//==========| ROUTES |========= 
mod pages {
    use actix_files::NamedFile;
    use std::path::PathBuf;
    use actix_web::{get, Error};

    // ===========| GET |===========
    #[get("/")]
    async fn index() -> Result<NamedFile, Error> {
        let path: PathBuf = "./static/html/index.html".parse().unwrap();
        Ok(NamedFile::open(path)?)
    }
}