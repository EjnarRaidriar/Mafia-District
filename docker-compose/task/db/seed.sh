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
INSERT INTO tasks (id, lobby_id, day, user_id, description, status, reward, required_location, created_at, updated_at)
VALUES
    ('t-seed-1', 'l-demo', 1, 'u-sheriff', 'Collect fingerprints at Town Hall', 'pending', 40, 'town-hall', NOW(), NOW()),
    ('t-seed-2', 'l-demo', 1, 'u-alchemist', 'Brew defensive potion', 'pending', 35, 'alchemist-lab', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
SQL

if [[ -z "${DB_DSN:-}" ]]; then
  unset PGPASSWORD || true
fi
