#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/cvetochek}"
REPO_URL="${REPO_URL:-https://github.com/Ramilko37/cvetochek.git}"
BRANCH="${BRANCH:-main}"
DOMAIN_NAME="${DOMAIN_NAME:-cvetipolubvi.ru}"

export DEBIAN_FRONTEND=noninteractive

if ! command -v docker >/dev/null 2>&1; then
  apt-get update
  apt-get install -y ca-certificates curl gnupg git

  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  . /etc/os-release
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" > /etc/apt/sources.list.d/docker.list

  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

mkdir -p "$APP_DIR"
if [ ! -d "$APP_DIR/.git" ]; then
  git clone "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

mkdir -p deploy
if [ ! -f deploy/backend.env ]; then
  cp deploy/backend.env.example deploy/backend.env
  echo "Created deploy/backend.env from example. Fill secrets before first production use."
fi
if [ ! -f deploy/frontend.env ]; then
  cp deploy/frontend.env.example deploy/frontend.env
  echo "Created deploy/frontend.env from example. Fill secrets before first production use."
fi

if ! command -v nginx >/dev/null 2>&1; then
  apt-get update
  apt-get install -y nginx
fi

install -d -m 0755 /etc/nginx/sites-available /etc/nginx/sites-enabled

cp deploy/nginx/default.conf /etc/nginx/sites-available/default

CERT_CHAIN="/etc/letsencrypt/live/${DOMAIN_NAME}/fullchain.pem"
CERT_KEY="/etc/letsencrypt/live/${DOMAIN_NAME}/privkey.pem"
CERTBOT_SSL_OPTS="/etc/letsencrypt/options-ssl-nginx.conf"
CERTBOT_DHPARAM="/etc/letsencrypt/ssl-dhparams.pem"

if [ -f "$CERT_CHAIN" ] && [ -f "$CERT_KEY" ] && [ -f "$CERTBOT_SSL_OPTS" ] && [ -f "$CERTBOT_DHPARAM" ]; then
  cp deploy/nginx/cvetochek.https.conf /etc/nginx/sites-available/cvetochek
  echo "Applied HTTPS nginx config."
else
  cp deploy/nginx/cvetochek.http.conf /etc/nginx/sites-available/cvetochek
  echo "Applied HTTP-only nginx config (no certbot certificate files found)."
fi

ln -sfn /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
ln -sfn /etc/nginx/sites-available/cvetochek /etc/nginx/sites-enabled/cvetochek

nginx -t
if systemctl is-active --quiet nginx; then
  systemctl reload nginx
else
  systemctl enable --now nginx
fi

docker compose -f docker-compose.prod.yml up -d --build --remove-orphans
