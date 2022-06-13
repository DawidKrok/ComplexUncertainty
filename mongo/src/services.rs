use models::Todo;
use futures::stream::StreamExt;
use bson::oid::ObjectId;
use std::error::Error;

use crate::DB;

// ----------------------------------------------------------------------------||
// File for implementing functions handling collections in Database (Services) ||
// ----------------------------------------------------------------------------||

// ==========| TODO Services |==========
impl DB {
    /// Insert `Todo` into database and returns `id` of added document.
    pub async fn add_todo(&self, todo: &Todo) -> Result<String, Box<dyn Error>> {        
        let result = self.todos.insert_one(todo, None).await?;

        Ok(result.inserted_id.to_string())
    }

    /// finds `Todo` in database by id 
    pub async fn get_todo(&self, id: &str) -> Result<Option<Todo>, Box<dyn Error>> {
        // shadow id with ObjectId from given string, as _id field is ObjectId
        let id = ObjectId::parse_str(id)?;
        let todo = self.todos.find_one(doc! { "_id": id }, None).await?;

        Ok(todo)
    }

    /// returns all `Todo`s from database 
    pub async fn get_all_todo(&self) -> Result<Vec<Todo>, Box<dyn Error>> {        
        let mut cursor = self.todos.find(None, None).await?;

        let mut vec = vec![];

        while let Some(Ok(todo)) = cursor.next().await {
            vec.push(todo)
        }

        Ok(vec)
    }

    /// deletes `Todo` with given id and returns `bool` representing whether document was deleted or not
    pub async fn delete_todo(&self, id: &str) -> Result<bool, Box<dyn Error>> {
        let id = ObjectId::parse_str(id)?;
        let result = self.todos.delete_one(doc! { "_id": id }, None).await?;

        // whether document with given id was found and deleted or not
        Ok(result.deleted_count == 1)
    }

    /// Updates `Todo` with given id and returns `bool` representing whether document was deleted or not
    pub async fn update_todo(&self, id: &str, title: &str, description: &str) -> Result<bool, Box<dyn Error>> {        
        let id = ObjectId::parse_str(id)?;
        let result = self.todos.update_one(doc! { "_id": id }, 
            doc! {"$set": {
                "title": title,
                "description": description
            }}
        ,None).await?;

        Ok(result.modified_count == 1)
    }
}
