from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


def _make_engine() -> "Engine":
    return create_engine(
        settings.database_url,
        pool_pre_ping=True,
        pool_recycle=3600,
        future=True,
    )


def _make_session_factory(engine: "Engine") -> sessionmaker:
    return sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)


engine = _make_engine()
SessionLocal = _make_session_factory(engine)
