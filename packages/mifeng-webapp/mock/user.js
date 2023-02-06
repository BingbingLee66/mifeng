const tokens = {
  admin: {
    token: 'admin'
  },
  editor: {
    token: 'editor'
  }
}

const users = {
  admin: {
    profile: {
      roleName: 'admin',
      remark: 'admin',
      ckey: 'admin',
      chamberName: 'admin',
      systemLogo: 'admin'
    }
  },
  editor: {
    profile: {
      roleName: 'editor',
      remark: 'editor',
      ckey: 'editor',
      chamberName: 'editor',
      systemLogo: 'editor'
    }
  }
}

const passwords = {
  admin: '123456',
  editor: '123456'
}

export default [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username, password } = config.query
      if (password !== passwords[username]) {
        return {
          state: 0,
          msg: '账号不存在或密码错误'
        }
      }

      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          state: 0,
          message: '账号不存在'
        }
      }

      return {
        state: 1,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/ec/user/info',
    type: 'get',
    response: (req, res) => {
      const token = req.header('access-token')
      const info = users[token]
      // mock error
      if (!info) {
        res.status('401')
        return {
          state: 0,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        state: 1,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: () => {
      return {
        state: 1,
        data: 'success'
      }
    }
  }
]
