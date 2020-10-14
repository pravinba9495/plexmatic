# plexmatic
![GitHub](https://img.shields.io/github/license/pravinba9495/plexmatic)

Organize your Plex Media the way you want.

# Usage
```docker
docker run -dit \
--name plexmatic \
--network bridge \
--cpuset-cpus="0-3" \
--memory 4g \
-v /mnt/user/media/movies/:/movies \
-v /mnt/user/media/tv/:/tv \
-v /mnt/user/media/scripts/:/scripts \
-v /mnt/user/appdata/plexmatic/output/:/output \
-p 5000:5000 \
-e MYSQL_HOST=YOUR_MYSQL_CONTAINER_IP \
-e MYSQL_PORT=3306 \
-e MYSQL_DB=plexmatic \
-e MYSQL_USER=plexmatic \
-e MYSQL_PWD=plexmatic \
pravinba9495/ffmpeg-alpine:latest
```
