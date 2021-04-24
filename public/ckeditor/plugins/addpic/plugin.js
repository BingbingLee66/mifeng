var httpUrl = 'https://tccc.9kd.com/ecservice/upload/richhtml-custom-img-upload'; //  图片上传路径
CKEDITOR.plugins.add(
  'addpic', { // 注册名为addpic的插件
    init: function(editor) {
      // 添加按钮到编辑器
      editor.ui.addButton('addPic', {
        label: '添加图片',
        command: 'addPic',
        icon: this.path + 'addpic.png'
      });
      editor.addCommand('addPic', {
        exec: function(editor) {
          // 此处定义点击按钮时的行为
          // 实现选择的图片上传到服务器，然后将返回的内容添加到编辑器里
          var $file = document.createElement('input');
          $file.type = 'file';
          $file.accept = 'image/*';
          $file.multiple = 'multiple';
          $file.click();
          $file.addEventListener('change', function(e) {
            var fileList = e.target.files;
            if (fileList.length > 0) {
              let formData = new FormData();
              // for (var i = 0; i < fileList.length; i++) {
                formData.append('upload', fileList[0]);
              // }
              let xhr = new XMLHttpRequest(); // 创建异步对象
              xhr.open('post', httpUrl, true);
              xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
              xhr.send(formData);
              xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                  let result = xhr.responseText;
                  if (typeof result == 'string') {
                    let res = JSON.parse(result)
                    if (res.state == 1) { // 成功
                      // 返回图片的url插入到编辑器中
                      // res.data.forEach(function(item, index) {
                      //   editor.insertHtml("<p><img src=" + item.url + "></p>");
                      // })
                      var element = CKEDITOR.dom.element.createFromHtml('<p><img src=\"' + res.data.filePath + '\"/></p>');
                      editor.insertElement(element);
                    } else {
                      alert(res.msg)
                    }
                  }
                }
              }
            }
          })
        }
      });
    }
  }
);
