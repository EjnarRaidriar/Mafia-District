#!/usr/bin/env bash
set -euo pipefail

psql_cmd=(psql -v ON_ERROR_STOP=1)

if [[ -n "${DB_DSN:-}" ]]; then
  psql_cmd+=("${DB_DSN}")
else
  db_user="${POSTGRES_USER:-${TASK_DB_USER:-pad_task}}"
  db_name="${POSTGRES_DB:-${TASK_DB_NAME:-pad_task}}"
  db_password="${POSTGRES_PASSWORD:-${TASK_DB_PASSWORD:-}}"

  if [[ -n "${db_password}" ]]; then
    export PGPASSWORD="${db_password}"
  fi

  psql_cmd+=(--username "${db_user}" --dbname "${db_name}")
fi

"${psql_cmd[@]}" <<'SQL'
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    lobby_id TEXT NOT NULL,
    day INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL,
    reward INTEGER NOT NULL DEFAULT 0,
    required_location TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS task_completions (
    id SERIAL PRIMARY KEY,
    task_id TEXT UNIQUE REFERENCES tasks(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    lobby_id TEXT NOT NULL,
    idempotency_key TEXT UNIQUE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_lobby_day_user ON tasks(lobby_id, day, user_id);
SQL

if [[ -z "${DB_DSN:-}" ]]; then
  unset PGPASSWORD || true
fi
