import time
from datetime import datetime

from celery.utils.log import get_task_logger
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.campaign import Campaign, CampaignStatus

from .celery_app import celery_app

logger = get_task_logger(__name__)


@celery_app.task(name="campaign.run")
def run_campaign(campaign_id: int) -> None:
    db: Session = SessionLocal()
    try:
        campaign = db.get(Campaign, campaign_id)
        if not campaign:
            logger.error("Campaign %s not found", campaign_id)
            return

        campaign.status = CampaignStatus.RUNNING
        campaign.updated_at = datetime.utcnow()
        db.commit()

        logger.info("Running campaign %s: %s", campaign_id, campaign.title)
        time.sleep(2)

        campaign.status = CampaignStatus.SUCCESS
        campaign.updated_at = datetime.utcnow()
        db.commit()
    except Exception:  # noqa: BLE001
        db.rollback()
        campaign = db.get(Campaign, campaign_id)
        if campaign:
            campaign.status = CampaignStatus.FAILED
            campaign.updated_at = datetime.utcnow()
            db.commit()
        logger.exception("Campaign %s failed", campaign_id)
    finally:
        db.close()
