# plexmatic
![GitHub](https://img.shields.io/github/license/pravinba9495/plexmatic)

Organize your Plex Media the way you want.

# Usage
```bash
docker run -dit --name plexmatic --network bridge --cpuset-cpus="0-3" --memory 4g -v /mnt/user/media/movies/:/movies -v /mnt/user/media/tv:/tv -v /mnt/user/media/scripts:/scripts -p 5000:5000 pravinba9495/ffmpeg-alpine:latest
```
