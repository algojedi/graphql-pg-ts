import Redis from 'ioredis'

export const redis = new Redis()

// ioredis supports all Redis commands:
redis.set('foo', 'foobaz') // returns promise which resolves to string, "OK"

// ioredis supports the node.js callback style
redis.get('foo', function (err, result) {
    if (err) {
        console.log('redis did no work')
        console.error(err)
    } else {
        console.log('redis up and running!')
        console.log(result) // Promise resolves to "bar"
    }
})
