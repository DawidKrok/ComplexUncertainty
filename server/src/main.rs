use actix_web::{HttpServer, App, web};
use std::io;
use dotenv::dotenv;

use mongo;

mod config;
mod routes;


#[actix_web::main]
async fn main() -> io::Result<()> {
    dotenv().ok();
    let config = config::Config::from_env().unwrap();

    let db = web::Data::new(
        mongo::DB::connect(&config.mongo.uri, &config.mongo.db).await.unwrap()
    );

    eprintln!("\x1b[42mConnected to MongoDB database \x1b[0m {}", config.mongo.db);
    eprintln!("\x1b[42mServer is running on \x1b[0m {}:{}", config.server.host, config.server.port);

    HttpServer::new(move || {
        App::new()
            // add App rescources
            .app_data(db.clone())
            //=======| REGISTER ROUTES |=======
            .configure(routes::config)
    })
    .bind((config.server.host, config.server.port))?
    .run()
    .await
}
