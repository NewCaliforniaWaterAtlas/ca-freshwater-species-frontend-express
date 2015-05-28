ca-freshwater-species-frontend-express
======================================

### `node-foreman`

We use [`node-foreman`](https://github.com/strongloop/node-foreman), strongloop's Node.js implementation of
[`foreman`](https://github.com/ddollar/foreman). It requires a `Procfile`, which is under source control, and an `.env`
file, which is not. The `.env` file must contain

```
PORT=1234
API_HOST=
```

and may contain, for example, `USER` and `PASS` variables if basic authentication is in use.

We use the tenacious [`supervisord`](http://www.supervisord.org/) in production. `node-foreman` can generate the configuration files
it needs.

```
$ nf export --type supervisord --user ubuntu
Loaded ENV .env File as JSON Format
Wrote  :  ./foreman-web-1.conf
Wrote  :  ./foreman.conf
```

The resulting `.conf` files must be copied or moved to `/etc/supervisor/conf.d/`, after which something like

```
sudo supervisorctl reread foreman-web-1
sudo supervisorctl update foreman-web-1
sudo supervisorctl restart foreman-web-1
```

may get you going again, but may not.
