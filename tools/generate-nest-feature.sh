#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   npm run g:nest -- apps/jobber-auth/src/app/auth/auth
#   ./tools/generate-nest-feature.sh apps/jobber-auth/src/app/users/users

PATH_ARG="${1:-}"

if [[ -z "$PATH_ARG" ]]; then
  echo "Usage: npm run g:nest -- <path>"
  echo "Example: npm run g:nest -- apps/jobber-auth/src/app/auth/auth"
  exit 1
fi

# Strip trailing slash / accidental .ts/.module suffixes
PATH_ARG="${PATH_ARG%/}"
PATH_ARG="${PATH_ARG%.ts}"
PATH_ARG="${PATH_ARG%.module}"
PATH_ARG="${PATH_ARG%.service}"
PATH_ARG="${PATH_ARG%.resolver}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ Generating Nest feature at: $PATH_ARG"
echo "  - module"
npx nx g @nx/nest:module "$PATH_ARG" --skipFormat
echo "  - service"
npx nx g @nx/nest:service "$PATH_ARG" --skipFormat
echo "  - resolver"
npx nx g @nx/nest:resolver "$PATH_ARG" --skipFormat

echo "✔ Done: $PATH_ARG.{module,service,resolver}.ts (+ specs)"
