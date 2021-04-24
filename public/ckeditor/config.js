/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		// { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		// { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		// { name: 'links' },
		{ name: 'insert' },
		{ name: 'addpic' },
		// { name: 'html5video' },
		{ name: 'addvideo' },
		// { name: 'forms' },
		// { name: 'tools' },
		// { name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others' },
		// '/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'styles' },
		{ name: 'colors' }
		// { name: 'about' }
	];
	// 添加视频功能
	// config.extraPlugins = 'html5video,widget,widgetselection,clipboard,lineutils';
	// config.extraPlugins = 'addvideo';
	// 添加自定义图片上传功能
	config.extraPlugins = 'addpic,addvideo';
	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	// 隐藏原图像按钮Image
	config.removeButtons = 'Underline,Subscript,Superscript,Image';
	// 隐藏Image后会导致img标签无法解析，需额外添加支持
	// config.extraAllowedContent = 'img[!src,alt,width,height]';
	config.allowedContent = true;

	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';
	// Upload handler url
	config.filebrowserUploadMethod = 'form';
	var domain = window.location.hostname;
	var sitePrefix = 'https://'+domain+'/';
	// config.filebrowserImageUploadUrl = sitePrefix + 'ecadmin/upload/richhtml-img-upload';
	config.filebrowserImageUploadUrl = sitePrefix + 'ecservice/upload/richhtml-img-upload';
	config.image_previewText=' ';

	config.font_names='宋体/simsun;黑体/simhei;微软雅黑/msyh;'+ config.font_names;
	config.placeholder='请输入文章内容';
};
