# orapass

*orapass* is a simple module for generating password hashed for Oracle database
versions 10g, 11g, and 12c. It also includes utility methods for generating
the `ALTER` statements necessary for setting said hashes in the database.

## Example

```javascript
const orapass = require('orapass');
orapass
  .twelve('auser', 'andpassword')
  .then((hash) => console.log(hash));
```

## Methods

+ `ten(username, password)` -- a synchronous method that returns the most basic
  Oracle password hash supported.
+ `eleven(password)` -- returns a Promise with its resolved value set to an
  Oracle 11g password hash.
+ `twelve(username, password, r2)` -- returns a Promise with its resolved value
  set to an Oracle 12c password hash. By default, the hash is compatible with
  12cR2 and later. If you want to support 12cR1, then supply `false` for the
  `r2` parameter; otherwise it isn't necessary.
+ `alterTen(username, password)` -- generates an Oracle 10g password hash and
  then returns an SQL statement that will set the password for the given user.
+ `alterEleven(username, password)` -- generates an Oracle 11g password hash
  and then returns a Promise with its resolved value being an SQL statement
  to set the password for the given user.
+ `alterTenEleven(username, password)` -- generates both Oracle 10g and 11g
  password hashes and then returns a Promise with its resolved value set to
  an SQL statement that will set the password for the given user.
+ `alterTenTwelve(username, password, r2)` -- generates both Oracle 10g
  and 12c password hashes and then returns a Promise with its resolved value set
  to an SQL statement that will set the password for the given user. Note:
  if you specify `false` for `r2` then you will get a statement that contains
  all hashes: 10g, 11g, and 12c.

## License

[MIT License](http://jsumners.mit-license.org/)
