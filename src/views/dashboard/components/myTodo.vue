<template>
  <Panel class="myTodo-wrap">
    <div class="panel-header">
      <div class="panel-title-box">
        <div class="panel-title">我的待办</div>
        <div class="message-dot" />
      </div>
    </div>
    <div class="card-wrap">
      <div class="card">
        <div class="card-title">
          <div class="el-icon-edit" />
          <div>入会审核</div>
        </div>
        <div class="card-content">吴彦祖发来一条入会申请</div>
        <div class="card-time">17分钟前</div>
      </div>
      <div class="card">
        <div class="card-title">
          <div class="el-icon-edit" />
          <div>入会审核</div>
        </div>
        <div class="card-content">吴彦祖发来一条入会申请</div>
        <div class="card-time">17分钟前</div>
      </div>
      <div class="card">
        <div class="card-title">
          <div class="el-icon-edit" />
          <div>入会审核</div>
        </div>
        <div class="card-content">吴彦祖发来一条入会申请</div>
        <div class="card-time">17分钟前</div>
      </div>
    </div>
  </Panel>
</template>

<script>
import Panel from '../../../components/panel'
export default {
  name: 'MyTodo',
  components: {
    Panel
  }
}
</script>

<style lang="scss" scoped>
.panel-title-box {
  padding: 0 20px;
  display: flex;
  align-items: center;
}
.message-dot {
  margin: 0 7px;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: #eb2626;
}
.card-wrap {
  display: flex;
  .card {
    padding: 25px 35px;
    border: 1px solid #ebebeb;
    border-radius: 2px;
    .card-title {
      margin: 10px 0;
      display: flex;
      font-size: 15px;
      font-weight: 600;
    }
    .card-content {
      font-size: 12px;
    }
    .card-time {
      float: right;
      font-size: 12px;
    }
  }
}
</style>
