CKEDITOR.plugins.add(
  'addvideo', { // 注册名为addvideo的插件
    init: function(editor) {
      // 添加按钮到编辑器
      editor.ui.addButton('addVideo', {
        label: '添加视频',
        command: 'addVideo',
        icon: this.path + 'addvideo.png'
      });
      editor.addCommand("addVideo", new CKEDITOR.dialogCommand("addVideo"));
      CKEDITOR.dialog.add('addVideo', this.path + 'dialog/code.js');
    }
  }
);
