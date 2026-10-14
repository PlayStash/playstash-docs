---
sidebar_position: 8
---

# Covers, backgrounds and media

Game covers/backgrounds and user avatars/backgrounds are stored in the backend's `/media` volume, mapped to `data/media/` by Compose. Screenshot, trailer and gameplay URL lists can point to external resources; loading those URLs contacts their hosts.

For manual artwork, open a game, choose the **Settings** gear, then **Edit Images → Cover** or **Background**. Upload/drop/paste an image or enter an image URL, then select **Save Images**. This requires the relevant editing role. See [metadata providers](metadata-enrichment/metadata.md) for automatically supplied artwork.

## Uploads and conversion

`MEDIA_MAX_SIZE` defaults to `10mb`. The default stored MIME types include BMP, JPEG, PNG, TIFF, GIF and ICO images; MP3/WAV/OGG/AAC/FLAC/WMA/AMR/MP4 audio; and MP4/AVI/MOV/WMV/FLV/MKV/WebM/MPEG/3GP video. An accepted file type does not guarantee playback support in every browser/client.

Decodable WebP, AVIF, TIFF and other images outside the configured stored formats are converted to an allowed PNG/JPEG/WebP output. Passive SVG is rasterized; scripts, active elements and external SVG/XML references are rejected. Image dimensions, processing time and both input/output size are limited. This is image normalization, not arbitrary video/audio transcoding.

Remote artwork URLs must be HTTP(S), without embedded credentials, and resolve to public addresses on every redirect. Private-network artwork should be uploaded as a file instead. Remote requests have a bounded timeout/size; a configured media size of zero still leaves a 64 MiB fallback for remote downloads.

## Authorized caching

`GET /api/media/:id` checks authentication and relevant game permissions before streaming or returning a conditional response. It uses `Cache-Control: private, no-cache` with ETag/Last-Modified support so cached pixels are reused only after authorization is rechecked. Do not replace this with public/shared-cache artwork rules at your proxy.

## Cleanup and backups

Media cleanup removes database entries without references and files without matching database records. The default interval is 60 minutes. Set `MEDIA_GC_DISABLED=true` to disable it, or adjust `MEDIA_GC_INTERVAL_IN_MINUTES`.

Use `data/media/` only for managed media. Files you place there manually without a database reference may be deleted by cleanup. Back up the media directory together with the matching database; starting with an empty database can make old media unreferenced.
