# Youtube "latest video" thumbnail embedder

This code is inspired and derived from a blog article here:

https://www.labnol.org/internet/light-youtube-embeds/27941/

The article shows you how to embed a youtube video in a lightweight manner, just
a thumbnail with clickable play button that loads an iframe player when clicked.

I have a website with several "live tiles" on the homepage, they fetch
interactive content from different locations.  One of the locations is Youtube,
my latest videos on each of my channels.  The default youtube embedded player is
a quite chunky and negatively impacts site loading speed, not to mention that it
wastes a lot of resources if you aren't actually playing a video.

Here is the design document I wrote for this project:

1. Reduced data burden on client
2. Faster rendering
3. Must not block rendering
4. Must work with responsive design
5. Code and data must be small and easy to review
6. Must behave similar to YT embedded player iframe
7. Must be able to play video when clicked on
9. Must not have any dependencies outside of what Wordpress already offers

Design

An inline-block div of nominal size is to be inserted into the original page
content.  The footprint in the homepage document is reduced from the iframe and
layout is greatly simplified.

The base DIV loader is based on public code that was designed to replace a
static video ID with a thumbnail and player that loaded the video in an iframe.
Static video IDs are not sufficient to replace the embedded player's "latest
video" capability.

The JS adds a listener that is invoked at DOMContentLoaded, which then looks for
all youtube-player DIVs in the document.  The Channel ID is extracted from the
DIV data-src and the search API is queried for a list of youtube videos, 1
result sorted by date (latest).  The video id is then used to create a DIV with
a static thumbnail and a clickable play button that can launch an embedded
iframe player.  The video title is truncated to length and displayed in a DIV in
the upper left of the render area.

The JS then fetches a snippet about the channel, uses the channel name and
thumbnail url to display a 32x32 thumbnail in the lower right of the render area
and the channel name in the lower left of the render area.  The look mimics the
embedded player but eschews some of the UI elements to create space.  The space
is used to create distinct branding for each of the video thumbnails that
appears on the page.  The distinct branding helps to differentiate the source of
the content and convey to the audience the channel topics.

This lightweight embedded thumbnailer is designed to be compatible with my PHP
based local API cache.  The cache allows you to transparently query the Google
YouTube API v3, caches the results, and updates the cache entries ever 3600
seconds.  You can find that project here: https://github.com/drwonky/ytapi_cache

This project is licensed under the MIT License because I used some code from
@labnol, effectively in the public domain.  He stated no license in his blog
entry, so I chose the most permissible OSS license.
