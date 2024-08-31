### To update the cache when data is not available ###

Requirements
1.ioredis
2.mysql2
3.SDK for JS

Logic implemented

cache_update() => rds_gdata() 
    |                  |
    |                  |
    |                  |
    V                  V
    gpass()           gpass()


If data is not available in cache it will call the rds_data() function
and update the data.Whenever user request the data application server
from the cache.Here we use Secrete Manager for cache and rds to store
and rotate the credentials.


How rotation works ??
Whenever at is desire time window Secrete Manager automatically invokes
the lambda function which result in updating the Secrete and then cache.

        Secret Manger Time()=> lambda()=>ssm_update()=>cache_update()

lambda require permissions to update the cache and secrete manger with
random password generation permission explicilty.


NOTE for ioredis
1. ioredis handles retry logic. we dont need to apply backoff with jitter
2. No of times it retries is infinite bydefault so we need to apply counter
   with EmittEvent listener

NOTE for mysql2 pooling mechanism
1. Just like normal mysql2 connection without pool we cannot wrap only connection
   logic into try{} catch{} block to handle connection error.
2. Whenever the query get executed then only connection get test and error can be
   handle or thrown.

NOTE for cache update with USER
1. Whenever there is update is going on for user password in cache the user status 
   change to modifying which takes approx 1 Min and 16 Sec.
2. In that 'Modifying' period, cache face downtime.With CLI we can use 'AWSPREVIOUS'
   user password to minimize downtime but for SDK it will not work.