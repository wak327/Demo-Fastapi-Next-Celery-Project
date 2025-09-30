from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "campaign_tasks",
    broker=settings.broker_url,
    backend=settings.result_backend,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    beat_scheduler="celery.beat:PersistentScheduler",
)
