/*
 Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
CKEDITOR.dialog.add("about", function(editor) {
  a = editor.lang.about;
  var b = CKEDITOR.getUrl(CKEDITOR.plugins.get("about").path + "dialogs/" + (CKEDITOR.env.hidpi ? "hidpi/" : "") + "logo_ckeditor.png");
  return {
    title: a.dlgTitle,
    minWidth: 390,
    minHeight: 210,
    contents: [{
      id: "myvideo",
      label: "",
      title: "",
      expand: !0,
      padding: 0,
      elements: [{
        type: "html",
        html: `<div style="margin:10px;">输入URL</div>
        <input id="inputurl" style="margin:10px;border:1px solid #ccc;border-radius:3px;padding:5px 2px;width:60%;" type="text" placeholder="输入点什么">`
      }]
    }],
    onOk: function() {
      var input_value = document.getElementById('inputurl').value;
      var element = CKEDITOR.dom.element.createFromHtml('<p><video controls="controls" autopaly="" loop="" src="' + input_value + '"></video></p>');
      editor.insertElement(element);
	},
  }
});
