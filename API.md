# Tinker API文档
2016.08.31 23:00  version: 0.0.2  
*本文档使用Markdown格式*

_本次更新说明 :_
_更新了新建用户接口的参数要求_
_更新了响应描述说明_
## 基础配置

### baseUrl = [http://121.250.222.124:3000/api/](http://121.250.222.124:3000/) (会变动) 
### 接口响应规范:
标准响应格式(JSON对象):
```
{  
  code: 响应码,
  status: 响应描述,
  data: 响应结果
}  
```
### 接口描述规范:

url: 接口地址(应用时拼接在baseUrl后)  
method: 请求方法 ( get | post | delete ...)  
param: 参数及要求  
result: 标准响应格式的JSON对象  

### 响应描述说明:
```
status = {
  '-2': '数据库查询失败',
  '-1': '数据库连接失败',
  '0': 'OK',
  '1': '参数不合法',
  '2': '用户名已经被注册'
}
```
响应描述和响应码一一对应，当code不为0时可直接将响应描述显示在屏幕  
接口描述中不再给出响应描述


## 接口描述

### 测试部分
---
#### 测试接口:
用以测试数据库能否正常连接
```
url: users (拼接在baseUrl后，即 http://121.250.222.124:3000/api/users )  
method: GET
param: null  
result:   
{
  code: 0 | -1
  result: 
    JSON Array 所有用户记录
}
```

### 用户相关
---

#### 新增用户
新增一条用户记录
```
url: users  
method: POST
param:
  username (用户名,必填,必须是英文字母,唯一)
  password (密码,必填)
  school (学校,必填)
  pic (头像，暂不支持)
  nickname (昵称,必填)
  phone (手机号,必填,必须是数字)
  type (身份,必填,仅可填1|2，1代表学生，2代表维修工)
result:   
{
  code: 0 | -1
  result: 
    JSON Array 所有用户记录
}
```