# Import models here so Alembic registers them.
from app.db.base_class import Base  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.campaign import Campaign  # noqa: F401
