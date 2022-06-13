#[macro_use(doc)]
extern crate bson;

use mongodb::{Client, error::Error, Collection};
use models::Todo;

mod services;

pub struct DB {
   todos: Collection<Todo>,
}

/// Base implementation of DB
impl DB {
    pub async fn connect(uri: &str, db: &str) -> Result<Self, Error>{
        let client = Client::with_uri_str(uri).await?;
        
        let todos= client.database(db).collection::<Todo>(Todo::TAG);
        Ok(DB{todos})
    }
}