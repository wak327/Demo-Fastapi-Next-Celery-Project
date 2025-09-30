from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.campaign import Campaign, CampaignStatus
from app.models.user import User
from app.schemas.campaign import CampaignCreate, CampaignResponse
from app.tasks.campaign import run_campaign

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


@router.post("/", response_model=CampaignResponse)
def create_campaign(
    payload: CampaignCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Campaign:
    if payload.scheduled_time <= datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="scheduled_time must be in the future",
        )

    campaign = Campaign(
        title=payload.title,
        content=payload.content,
        scheduled_time=payload.scheduled_time,
        owner_id=current_user.id,
        status=CampaignStatus.SCHEDULED,
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)

    run_campaign.apply_async(args=[campaign.id], eta=payload.scheduled_time)
    return campaign


@router.get("/{campaign_id}", response_model=CampaignResponse)
def get_campaign(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Campaign:
    campaign = (
        db.query(Campaign)
        .filter(Campaign.id == campaign_id, Campaign.owner_id == current_user.id)
        .first()
    )
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    return campaign


@router.get("/", response_model=list[CampaignResponse])
def list_campaigns(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Campaign]:
    campaigns = (
        db.query(Campaign)
        .filter(Campaign.owner_id == current_user.id)
        .order_by(Campaign.scheduled_time.desc())
        .all()
    )
    return campaigns
