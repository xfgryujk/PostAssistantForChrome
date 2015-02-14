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
		function setting() {
			var html = '\
<script>\
UseTextSign.checked = parent.localStorage.UseTextSign == "true";\
if(typeof parent.localStorage.TextSign == "string"){\
TextSign.value = parent.localStorage.TextSign\
};\
UseRichTextSign.checked = parent.localStorage.UseRichTextSign == "true";\
if(typeof parent.localStorage.RichTextSign == "string"){\
RichTextSign.value = parent.localStorage.RichTextSign};\
/*UseUnicode.checked = parent.localStorage.UseUnicode == "true";*/\
KeepFormat.checked = parent.localStorage.KeepFormat == "true";\
</script>\
<input type="checkbox" id="UseTextSign"><label for="UseTextSign">使用文字签名</label><br>\
<textarea style="width:100%; height:167px" wrap="off" id="TextSign"></textarea><br>\
<font color=red>一行一个</font><br>\
<input type="checkbox" id="UseRichTextSign"><label for="UseRichTextSign">使用富文本签名</label><br>\
<textarea style="width:100%; height:167px" wrap="off" id="RichTextSign"></textarea><br>\
<font color=red>视频SWF播放器地址或图片，图片格式：宽x高 图片地址，省略宽高或宽高为0将自动获取(可能失败)</font><br>\
<!-- <input type="checkbox" id="UseUnicode"><label for="UseUnicode">使用Unicode码(可以发繁体字、部分和谐内容)</label><br> -->\
<input type="checkbox" id="KeepFormat"><label for="KeepFormat">保持格式</label>\
';

			var i = $.dialog.confirm(html, {
				title: "设置",
				acceptValue: "确定",
				cancelValue: "取消"
			});
			i.width(420);
			i.height(440);
			i.bind("onaccept",
			function() {
				parent.localStorage.UseTextSign		= UseTextSign.checked;
				parent.localStorage.TextSign		= TextSign.value;
				parent.localStorage.UseRichTextSign	= UseRichTextSign.checked;
				parent.localStorage.RichTextSign	= RichTextSign.value;
				//parent.localStorage.UseUnicode	= UseUnicode.checked;
				parent.localStorage.KeepFormat		= KeepFormat.checked;
				getImageSize();
			});
		}

		(function addButton() {
			var target = $(".j_posting_status")[0];
			// 等待插入目标加载
			if (target == null) {
				setTimeout(addButton, 500);
				return;
			};
			var btn = document.createElement("input");
			btn.type		= "button";
			btn.style.height	= "100%";
			btn.value		= "发贴助手设置";
			btn.onclick		= setting;
			target.appendChild(btn);
		})();

		function getImageSize() {
			if (typeof localStorage.RichTextSign != "string")
				return;
			var signs = localStorage.RichTextSign.split("\n");
			var imageExp = /(\d+)x(\d+) (.*)/;
			var modified = false;
			for (var i in signs) {
				var ext = signs[i].substring(signs[i].length - 4).toLowerCase();
				if (! (ext == ".jpg" || ext == ".gif" || ext == ".png")) // 是视频
					continue;

				var match = imageExp.exec(signs[i]);
				if (match != null) { // 指定尺寸
					localStorage[match[3]] = match[1] + "x" + match[2];
					signs[i] = match[3];
					modified = true;
				}
				else {
					var size = typeof localStorage[signs[i]] == "string" ? localStorage[signs[i]].split("x") : [];
					// 需要获取尺寸
					if (size.length != 2 || parseInt(size[0]) <= 0 || parseInt(size[1]) <= 0) {
						var img = new Image();
						img.src = signs[i];
						img.onload = function() {
							localStorage[this.src] = this.width + "x" + this.height;
						}
					}
				}
			}
			if (modified) { // 需要改变localStorage
				var str = signs[0];
				for (var i = 1; i < signs.length; i++)
					str += "\n" + signs[i];
				localStorage.RichTextSign = str;
			}
		}
		getImageSize();
	};

	var script = document.createElement("script");
	script.innerHTML = "(" + code.toString() + ")();";
	document.body.appendChild(script);
})();
