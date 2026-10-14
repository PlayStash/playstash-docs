---
sidebar_position: 3
---

# Reverse proxy and HTTPS

Expose one dedicated hostname, such as `https://games.example.com`, and forward it to `http://SERVER-IP:8080`. This port is the **frontend**. It serves browser pages and forwards `/api/` and `/socket.io/` to the separate backend.

Forward all paths without stripping their prefixes. Enable WebSocket upgrades, allow the size of game archives you want to upload, and allow long-running uploads and downloads. Do not publish PostgreSQL or the backend port to the internet.

## Trust the actual outer proxy

The outer proxy must overwrite `Host`, `X-Forwarded-Proto` and `X-Forwarded-For` using the public hostname, protocol and actual client address. Configure only the proxy's peer IP/CIDR **as seen by the frontend container**:

```dotenv
# .env beside docker-compose.yml
PLAYSTASH_TRUSTED_PROXY_CIDRS=192.168.1.10/32
```

```sh
docker compose up -d
```

The supplied Compose file explicitly passes this particular variable to the frontend. Several trusted peers can be separated by spaces. For a proxy on the Docker host, the observed peer may be a Docker bridge gateway; use that specific address. An empty value is appropriate for direct HTTP access. Do not trust `0.0.0.0/0` or `::/0`.

Restrict incoming access to port 8080 to the outer proxy when publishing an internet-facing instance. Manage TLS certificates, HTTP-to-HTTPS redirection and HSTS in that outer proxy. No extra public WebSocket port is required.

## Optional Nginx outer proxy example

Replace the hostname, certificate paths and upstream address with your installation values. Set the trusted peer above to the address that this Nginx instance uses when contacting the frontend.

```nginx
server {
    listen 443 ssl;
    server_name games.example.com;
    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    client_max_body_size 100g;
    location / {
        proxy_pass http://192.168.1.20:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_request_buffering off;
        proxy_buffering off;
    }
}
```

The example's 100 GiB upload ceiling should match or exceed your desired backend `GAMES_MAX_UPLOAD_SIZE`. API documentation is served at `/api/docs`; preserve the backend response headers there rather than applying the SPA's static caching policy.
