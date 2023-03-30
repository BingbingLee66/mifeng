import request from '@/utils/request';
const baseUrl = '/ecservice';
export function getList(params) {
	return request({
		url: baseUrl + '/ec/articleSource/list',
		method: 'get',
		params,
	});
}

export function save(params) {
	return request({
		url: baseUrl + '/ec/articleSource/save',
		method: 'post',
		data: params,
	});
}

export function updateStatus(params) {
	return request({
		url: baseUrl + '/ec/articleSource/update-status',
		method: 'put',
		params,
	});
}

export function del(params) {
	return request({
		url: baseUrl + '/ec/articleSource/delete',
		method: 'put',
		params,
	});
}

export function getOptions() {
	return request({
		url: baseUrl + '/ec/articleSource/get-options',
		method: 'get',
	});
}
