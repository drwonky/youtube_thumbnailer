/* Based on code/concept by @labnol */
/* Web: http://labnol.org/?p=27941 */

var active_player = null;

function setLatestVideo() {
	var channel,id,div, n,
		v = document.getElementsByClassName("youtube-player");
	for (n = 0; n < v.length; n++) {
		div = document.createElement("div");
		channel=v[n].dataset.id;
		getJSONVidId(channel,v[n],div);
	}
}

function trunc(str, length) {
	return str.length > length ? str.substring(0, length - 3) + '...' : str
}

function getJSONVidId(channelId,element,div) {
	var obj = {
		'part': 'id,snippet',
		'key':'API KEY',
		'channelId': channelId,
		'maxResults': 1,
		'order': 'date'
	};
	//var url="https://www.googleapis.com/youtube/v3/search?";
	var url="https://example.com/path/to/ytapi_cache.php?endpoint=search&";
	jQuery.getJSON(url+jQuery.param(obj),function(result) {
			var id=result.items[0].id.videoId,
			title=trunc(result.items[0].snippet.title,30);
			div.setAttribute("data-id", id);
			div.setAttribute("class", "inactiveplayer");
			div.setAttribute("id", id);
			div.innerHTML = labnolThumb(id);
			div.getElementsByClassName("title")[0].innerHTML=title;
			div.onclick = labnolIframe;
			element.appendChild(div);
			}).then(function() {
				var obj = {
				'part': 'snippet',
				'key':'API KEY',
				'id': channelId
				};
				//var url="https://www.googleapis.com/youtube/v3/channels?";
				var url="https://example.com/path/to/ytapi_cache.php?endpoint=channels&";
				jQuery.getJSON(url+jQuery.param(obj),function(result) {
						var thumb=result.items[0].snippet.thumbnails.default.url,name=result.items[0].snippet.title;
						div.getElementsByClassName("thumb")[0].style.backgroundImage='url('+thumb+')';
								div.getElementsByClassName("name")[0].innerHTML=name;
								});
						});

				}

				document.addEventListener("DOMContentLoaded", setLatestVideo);

				function labnolThumb(id) {
				var divs = '<img src="//i.ytimg.com/vi/ID/hqdefault.jpg">'+
					'<div class="title"></div>'+
					'<div class="play"></div>'+
					'<div class="thumb"></div>'+
					'<div class="name"></div>';
				return divs.replace("ID", id);
				}

var api_loaded = null;
function labnolIframe() {

	this.setAttribute("class", "activeplayer");

	if (api_loaded === null) {
		var tag = document.createElement('script');

		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		api_loaded = true;
	} else {
		if (active_player === null) {
			return onYouTubeIframeAPIReady();
		}
	}
}

var player = [];
function onYouTubeIframeAPIReady() {
	// disable all inactive players so only 1 video can play at a time
	var n,v = document.getElementsByClassName("inactiveplayer");
	for (n = 0; n < v.length; n++) {
		var div = v[n];
		div.style.opacity="0.5";
		div.style.pointerEvents="none";
	}

	// create the video player for the active element
	var n,v = document.getElementsByClassName("activeplayer");
	for (n = 0; n < v.length; n++) {
		var div = v[n];
		player[div.id] = new YT.Player(div.id, {
			videoId: div.id,
			events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
			}
		});
		player[div.id].xvideoId=div.id;
	}

}

function onPlayerReady(event) {
	event.target.playVideo();
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING && active_player === null) {
		// set exclusive owner of play ability
		active_player = event.target;

	} else if (event.data == YT.PlayerState.ENDED && active_player !== null) {
		active_player = null;

		// reset active player to inactive when playing is done
		document.getElementById(event.target.xvideoId).setAttribute("class", "inactiveplayer");

		// make all other video player able to accept input
		var n,v = document.getElementsByClassName("inactiveplayer");
		for (n = 0; n < v.length; n++) {
			var div = v[n];
			div.style.opacity="1";
			div.style.pointerEvents="auto";
		}
	}
}

