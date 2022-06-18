use serde::{Serialize, Deserialize};

/// Exemplary object for storing in database
#[derive(Serialize, Deserialize)]
pub struct Todo {
    title: String,
    description: String
}

impl Todo {
    /// Tag convention: tag can be used wherever a string representation of object's name is needed 
    /// (e.g. Collection name in MongoDB)
    pub const TAG: &'static str = "todo";

    pub fn new(title: &str, description: &str) -> Self {
        Self { 
            title: title.to_string(),
            description: description.to_string() 
        }
    }
}
