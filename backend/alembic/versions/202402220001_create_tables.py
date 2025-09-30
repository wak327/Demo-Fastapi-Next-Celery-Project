"""create user and campaign tables

Revision ID: 202402220001
Revises: 
Create Date: 2024-02-22 00:01:00.000000
"""
from datetime import datetime

from alembic import op
import sqlalchemy as sa


revision = "202402220001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "user",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index(op.f("ix_user_email"), "user", ["email"], unique=True)
    op.create_index(op.f("ix_user_id"), "user", ["id"], unique=False)

    op.create_table(
        "campaign",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("scheduled_time", sa.DateTime(), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="scheduled"),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("user.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now(), server_onupdate=sa.func.now()),
    )
    op.create_index(op.f("ix_campaign_id"), "campaign", ["id"], unique=False)
    op.create_index(op.f("ix_campaign_owner_id"), "campaign", ["owner_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_campaign_owner_id"), table_name="campaign")
    op.drop_index(op.f("ix_campaign_id"), table_name="campaign")
    op.drop_table("campaign")
    op.drop_index(op.f("ix_user_id"), table_name="user")
    op.drop_index(op.f("ix_user_email"), table_name="user")
    op.drop_table("user")
