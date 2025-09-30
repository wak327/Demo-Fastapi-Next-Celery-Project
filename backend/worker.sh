#!/usr/bin/env bash
set -euo pipefail

alembic upgrade head

exec celery -A app.tasks.celery_app.celery_app worker --loglevel=info
