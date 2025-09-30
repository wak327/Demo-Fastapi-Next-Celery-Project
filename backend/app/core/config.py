from functools import lru_cache
from pydantic import BaseSettings, AnyUrl


class Settings(BaseSettings):
    app_name: str = "Campaign Scheduler"
    environment: str = "development"
    database_url: str
    redis_url: AnyUrl
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    celery_broker_url: AnyUrl | None = None
    celery_result_backend: AnyUrl | None = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @property
    def broker_url(self) -> str:
        return str(self.celery_broker_url or self.redis_url)

    @property
    def result_backend(self) -> str:
        return str(self.celery_result_backend or self.redis_url)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
