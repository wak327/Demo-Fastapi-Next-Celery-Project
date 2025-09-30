from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.campaign import CampaignStatus


class CampaignBase(BaseModel):
    title: str
    content: str
    scheduled_time: datetime


class CampaignCreate(CampaignBase):
    pass


class CampaignInDBBase(CampaignBase):
    id: int
    status: str
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class CampaignResponse(CampaignInDBBase):
    pass


class CampaignStatusResponse(BaseModel):
    id: int
    status: str
    scheduled_time: datetime
    title: str
    content: str

    class Config:
        orm_mode = True


class CampaignUpdateStatus(BaseModel):
    status: str

    @staticmethod
    def valid_status(status: str) -> bool:
        return status in {
            CampaignStatus.SCHEDULED,
            CampaignStatus.RUNNING,
            CampaignStatus.SUCCESS,
            CampaignStatus.FAILED,
        }
