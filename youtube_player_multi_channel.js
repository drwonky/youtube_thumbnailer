	/* Derived from code/concept by @labnol */
    /* Web: https://www.labnol.org/internet/light-youtube-embeds/27941/ */

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
		'key':'YOUTUBE API KEY',
      'channelId': channelId,
      'maxResults': 1,
      'order': 'date'
		};
	  	var url="https://www.googleapis.com/youtube/v3/search?";
	  	//var url="https://example.com/path/to/ytapi_cache.php?endpoint=search&";
		jQuery.getJSON(url+jQuery.param(obj),function(result) {
				var id=result.items[0].id.videoId,
				title=trunc(result.items[0].snippet.title,30);
				div.setAttribute("data-id", id);
                div.innerHTML = labnolThumb(id);
				div.getElementsByClassName("title")[0].innerHTML=title;
                div.onclick = labnolIframe;
                element.appendChild(div);
		}).then(function() {
      var obj = {
		'part': 'snippet',
		'key':'YOUTUBE API KEY',
      'id': channelId
		};
	  	var url="https://www.googleapis.com/youtube/v3/channels?";
	  	//var url="https://example.com/path/to/ytapi_cache.php?endpoint=channels&";
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

    function labnolIframe() {
        var iframe = document.createElement("iframe");
        var embed = "//www.youtube.com/embed/ID?autoplay=1";
        iframe.setAttribute("src", embed.replace("ID", this.dataset.id));
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "1");
        this.parentNode.replaceChild(iframe, this);
    }
