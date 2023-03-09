# Mutex

Receives a MutexDatabase and allows for locking it and unlocking it on demand. The DB will remain locked by recursively extending its lock (pinging).

MutexDatabase's interface is comprehended of three methods: `acquireLock`, `extendLock` and `releaseLock`.

`acquireLock` is called when attempting to lock. If it returns truthy, the db will lock and ping until `unlock` is called. If it returns falsy, `untilAcquired` will take precedence in deciding whether the db will retry to lock or not. In case `untilAcquired` is true, the db will try to relock every `tryLockInterval`.
`extendLock` is called whenever `pingInterval` is fulfilled and the db hasn't been unlocked.
`releaseLock` is called when the db is unlocked.
