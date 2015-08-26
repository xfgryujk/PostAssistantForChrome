/*
The MIT License (MIT)

Copyright (c) 2015 xfgryujk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
	var code = function() {
		function toUnicode(text) {
			var result = "";
			for (var i = 0; i < text.length; i++)
				result += "𠀦#" + text.charCodeAt(i) + ";";
			return result;
		}

		function toHTML(text) {
			var result = text.replace(/&/g, "&amp;");
			result = result.replace(/ /g, "&nbsp;");
			result = result.replace(/</g, "&lt;");
			result = result.replace(/>/g, "&gt;");
			return result;
		}

		function random(max) {
			return parseInt(Math.random() * max);
		}

		(function override() {
			// 等待发帖框加载
			if (UE.instants.ueditorInstant0 == null) {
				setTimeout(override, 500);
				return;
			}

			UE.instants.ueditorInstant0.getContent = function() {
				var result = UE.Editor.prototype.getContent.call(this).replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/(^(<br\/>)+)|((<br\/>)+$)/g, "");

				// Unicode
				if (localStorage.UseUnicode == "true") {
					result = toUnicode(result);
					result = result.replace(/𠀦#60;𠀦#98;𠀦#114;𠀦#47;𠀦#62;/g, "<br>");
				}

				// 保持格式
				if (localStorage.KeepFormat == "true")
					result = result.replace(/( |&nbsp;)( |&nbsp;)/g,"　　").replace(/<br\/>/g,"<br>");
				
				var hasTextSign = localStorage.UseTextSign == "true" && localStorage.TextSign != "";
				var hasRichTextSign = localStorage.UseRichTextSign == "true" && localStorage.RichTextSign != "";
				if (!hasTextSign && !hasRichTextSign)
					return result;

				result += "<br><br><br>";

				// 文字签名
				if (hasTextSign) {
					var signs = localStorage.TextSign.split("\n");
					result += toHTML(signs[random(signs.length)]);
				}

				// 富文本签名
				if (hasRichTextSign) {
					if (hasTextSign)
						result += "<br>";

					var signs = localStorage.RichTextSign.split("\n");
					var sign  = signs[random(signs.length)];

					var ext = sign.substring(sign.length - 4).toLowerCase();
					if (! (ext == ".jpg" || ext == ".gif" || ext == ".png")) // 是视频
						result += '<embed class="BDE_Flash" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" wmode="transparent" play="true" loop="false" menu="false" src="' + sign + '" width="500" height="450" allowscriptaccess="never" allowfullscreen="true" scale="noborder">';
					else { // 是图片
						var width = 500, height = 500;
						var size = typeof localStorage[sign] == "string" ? localStorage[sign].split("x") : [];
						if (size.length != 2 || parseInt(size[0]) <= 0 || parseInt(size[1]) <= 0)
							alert("╮(╯_╰)╭图片尺寸获取失败，默认500x500");
						else {
							width  = parseInt(size[0]);
							height = parseInt(size[1]);
						}
						if (width > 560 || height > 600) {
							var scale1 = 560 / width;
							var scale2 = 600 / height;
							var scale  = scale1 < scale2 ? scale1 : scale2;
							width  = parseInt(width  * scale);
							height = parseInt(height * scale);
						}
						result += '<img class="BDE_Image" src="' + sign + '" unselectable="on" pic_type="1" height="' + height + '" width="' + width + '"/>';
					}
				}
				return result;
			};
		})();
	};

	var script = document.createElement("script");
	script.innerHTML = "(" + code.toString() + ")();";
	document.body.appendChild(script);
})();
