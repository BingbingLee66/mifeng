CKEDITOR.dialog.add("addVideo", function(editor) {
  return {
    title: '请输入视频链接',
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
        html: `<div style="margin:10px;">输入视频URL</div>
        <input id="inputurl" style="margin:10px;border:1px solid #ccc;border-radius:3px;padding:5px 2px;width:60%;" type="text" placeholder="https://...">`
      }]
    }],
    onOk: function() {
      var input_value = document.getElementById('inputurl').value;
      var element = CKEDITOR.dom.element.createFromHtml('<p><video controls="controls" autopaly="" loop="" src="' + input_value + '"></video></p>');
      editor.insertElement(element);
    }
  }
});