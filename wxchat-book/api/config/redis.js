
const redis = require('redis')

;(async () =>{
    const redisClient = redis.createClient({
        url: 'redis://lhx:lhxjsg438@ip:port/wx_contact'
        /*
        * redis://[[username][:password]@][host][:port][/db-number]
        * 写密码redis://:123456@127.0.0.1:6379/0
        * 写用户redis://uername@127.0.0.1:6379/0
        * 或者不写密码 redis://127.0.0.1:6379/0
        * 或者不写db_number redis://:127.0.0.1:6379
        * */
    });

    redisClient.on('ready', () => {
        console.log('redis is ready...')
    })

    redisClient.on('error', err => {
        console.log(err)

    })

    await redisClient.connect()   // 连接

    /* 增 改*/
    const status = await redisClient.set('key', 'value') // 设置值
    console.log(status )

    /* 查 */
    const value = await redisClient.get('key') // 得到value 没有则为null
    console.log(value )

    /* 删 */
    const num = await redisClient.del('key') // 0 没有key关键字 // 1删除成功
    console.log(num )

    await redisClient.quit()   // 关闭
})();
