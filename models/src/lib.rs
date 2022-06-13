use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Todo {
    title: String,
    description: String
}

impl Todo {
    pub const TAG: &'static str = "todo";

    pub fn new(title: &str, description: &str) -> Self {
        Self { 
            title: title.to_string(),
            description: description.to_string() 
        }
    }
}
