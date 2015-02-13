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
$("#bText")[0].checked = parent.localStorage.bText == "true";\
if(typeof parent.localStorage.Text == "string"){\
$("#Text")[0].value = parent.localStorage.Text\
};\
$("#bRichText")[0].checked = parent.localStorage.bRichText == "true";\
if(typeof parent.localStorage.RichText == "string"){\
$("#RichText")[0].value = parent.localStorage.RichText};\
//$("#bUnicode")[0].checked = parent.localStorage.bUnicode == "true";\
</script>\
<input type="checkbox"id="bText"><label for="bText">使用文字签名</label><br>\
<textarea style="width:100%; height:167px" wrap="off"id="Text"></textarea><br>\
<font color=red>一行一个</font><br>\
<input type="checkbox"id="bRichText"><label for="bRichText">使用富文本签名</label><br>\
<textarea style="width:100%; height:167px" wrap="off"id="RichText"></textarea><br>\
<font color=red>视频SWF播放器地址或图片，图片格式：宽x高 图片地址</font><br>\
<!-- <input type="checkbox"id="bUnicode"><label for="bUnicode">使用Unicode码(可以发繁体字、部分和谐内容)</label> -->';

			var i = $.dialog.confirm(html, {
				title: "设置",
				acceptValue: "确定",
				cancelValue: "取消"
			});
			i.width(420);
			i.height(428);
			i.bind("onaccept",
			function() {
				parent.localStorage.bText     = $("#bText")[0].checked;
				parent.localStorage.Text      = $("#Text")[0].value;
				parent.localStorage.bRichText = $("#bRichText")[0].checked;
				parent.localStorage.RichText  = $("#RichText")[0].value;
				parent.localStorage.bUnicode  = $("#bUnicode")[0].checked;
			})
		}

		(function addButton() {
			var target = $(".j_posting_status")[0];
			// 等待插入目标加载
			if (target == null) {
				setTimeout(addButton, 500);
				return;
			};
			var btn     = document.createElement("input");
			btn.type    = "button";
			btn.style.height = "100%";
			btn.value   = "发贴助手设置";
			btn.onclick = setting;
			target.appendChild(btn);
		})();
	}

	var script = document.createElement("script");
	script.innerHTML = "(" + code.toString() + ")();";
	document.body.appendChild(script);
})();
