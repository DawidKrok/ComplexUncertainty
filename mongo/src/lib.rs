#[macro_use(doc)]
extern crate bson;

use mongodb::{Client, error::Error, Collection};
use models::Todo;

mod services;

/// Object for storing collections from database. 
/// 
/// It's more convenient than storing a `mongodb::Database`, 
/// as it shortens syntax for obtaining collection.
/// 
/// It also allows to implement custom functions that'll work on said collections.
pub struct DB {
   todos: Collection<Todo>,
}

/// Base implementation of DB
impl DB {
    /// Connects with database based on `uri` (valid MongoDB connection string) and `db` (name of database) and returns a new `DB` 
    pub async fn connect(uri: &str, db: &str) -> Result<Self, Error>{
        let client = Client::with_uri_str(uri).await?;
        
        let todos= client.database(db).collection::<Todo>(Todo::TAG);
        Ok(DB{todos})
    }
}