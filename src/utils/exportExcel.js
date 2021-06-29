import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export function exportJson2Excel (table_name, data_json) {
  // 通过json生成工作簿对象
  // console.log(data_json)
  const worksheet = XLSX.utils.json_to_sheet(data_json)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1')
  /* 获取二进制字符串作为输出 */
  let workbook_out = XLSX.write(workbook, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  })
  try {
    FileSaver.saveAs(
    //Blob 对象表示一个不可变、原始数据的类文件对象。
    //Blob 表示的不一定是JavaScript原生格式的数据。
    //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
    //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
    new Blob([workbook_out], { type: 'application/octet-stream' }),
    //设置导出文件名称
    table_name + '.xlsx'
    )
  } catch (e) {
    if (typeof console !== 'undefined') {
      console.log(e, workbook_out)
    }
  }
  return workbook_out
}

export function exportTable2Excel (tab_id) {
  /* 从表生成工作簿对象 */
  let workbook = XLSX.utils.table_to_book(document.querySelector(tab_id), { raw:true })
  /* 获取二进制字符串作为输出 */
  let workbook_out = XLSX.write(workbook, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  })
  try {
    FileSaver.saveAs(
    //Blob 对象表示一个不可变、原始数据的类文件对象。
    //Blob 表示的不一定是JavaScript原生格式的数据。
    //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
    //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
    new Blob([workbook_out], { type: 'application/octet-stream' }),
    //设置导出文件名称
    '会员数据.xlsx'
    )
  } catch (e) {
    if (typeof console !== 'undefined') {
      console.log(e, workbook_out)
    }
  }
  return workbook_out
}
