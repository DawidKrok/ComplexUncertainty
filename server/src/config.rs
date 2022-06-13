use serde::Deserialize;
use config::ConfigError;

#[derive(Deserialize)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
}

#[derive(Deserialize)]
pub struct MongoConfig {
    pub uri: String,
    pub db: String,
}


/// holds basic config variables from .env file
#[derive(Deserialize)]
pub struct Config {
    pub server: ServerConfig,
    pub mongo: MongoConfig,
}

impl Config {
    /// loads variables from .env file and returns Config object
    pub fn from_env() -> Result<Self, ConfigError> {
        let mut cfg = config::Config::new();
        cfg.merge(config::Environment::new())?;
        cfg.try_into()
    }
}