# Tinker API文档
2016.09.03 18:20  version: 0.0.3  
*本文档使用Markdown格式*

_本次更新说明 :_  
_新增了获得融云token的接口_

_0.0.2更新说明 :_  
_新增了新增维修单的接口_
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
result: 当请求成功时，标准响应格式的JSON对象  

### 响应描述说明:
```
status = {
    '-4': '与容联服务器通讯失败',
    '-3': '页面不存在',
    '-2': '数据库查询失败',
    '-1': '数据库连接失败',
    '0': 'OK',
    '1': '参数不合法',
    '2': '用户名已经被注册',
    '3': '用户名密码错误',
    '4': 'token校验失败',
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
  data: 
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
  code: 0 | 1 | 2
  data: null
}
```

### 认证相关
---

#### 登陆认证
获得身份认证token
```
url: auth  
method: POST
param:
  username (用户名,必填)
  password (密码,必填)
result:   
{
  code: 0 | 1 | 3
  data: JSON Object
    {
      token: 身份认证token
    }
}
```

#### 获得融云token
通过服务端获得融云token
```
url: auth/im
method: POST
param:
  token (身份认证,必填,通过登录认证接口获得)
result:
{
  code: -4 | 0 | 1 | 4
  data: Json Object(引自容云官方文档)
  {
    code	Int	返回码，200 为正常。如果您正在使用开发环境的 AppKey，您的应用只能注册 100 名用户，达到上限后，将返回错误码 2007。如果您需要更多的测试账户数量，您需要在应用配置中申请“增加测试人数”。
    token	String	用户 Token，可以保存应用内，长度在 256 字节以内。
    userId	String	用户 Id，与输入的用户 Id 相同。
  }
}
remark:
当服务器网络状况不佳时,请求会挂起约21s,然后返回code=-4的响应,该情况发生较为频繁.
建议本地长期持有融云token.
```

### 维修单相关
---

#### 新增维修单
学生用户新增一项维修事项
```
url: users/i/jobs
method: POST
param:
  token (身份认证,必填,通过登录认证接口获得)
  pic (图片,选填,暂不支持)
  aud (语音,选填,暂不支持)
  position (地点,必填)
  desc (描述,选填)
result:
{
  code: 0 | 1 | 4
  data: null
}
```