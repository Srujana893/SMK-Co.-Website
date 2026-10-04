#!/usr/bin/env python3
"""Local preview that applies the Caddyfile's routing rules.

    python3 baseline/serve.py           # http://127.0.0.1:8765
    python3 baseline/serve.py 3000

Plain `python3 -m http.server`, VS Code Live Server and file:// all serve paths
literally, so every clean URL in the site (/about, /services, ...) 404s against
them. Production runs Caddy, which rewrites. This mirrors that, so local preview
behaves like the deployed site.

Rules, matching Caddyfile line for line:
    redir /index.html  -> /                     301
    redir /foo.html    -> /foo                  301
    try_files {path} {path}.html
    file_server        (a directory serves its index.html)
"""
import os, re, sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class CaddyLike(SimpleHTTPRequestHandler):
    def send_head(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0]

        # redir /index.html -> /
        if path == "/index.html":
            return self._redirect("/")

        # redir /foo.html -> /foo
        m = re.match(r"^(.+)\.html$", path)
        if m:
            return self._redirect(m.group(1))

        # try_files {path} {path}.html
        rel = path.lstrip("/")
        disk = os.path.join(ROOT, rel)
        if rel and not os.path.exists(disk) and os.path.exists(disk + ".html"):
            self.path = path + ".html"
        return super().send_head()

    def _redirect(self, to):
        self.send_response(301)
        self.send_header("Location", to)
        self.send_header("Content-Length", "0")
        self.end_headers()
        return None

    def log_message(self, fmt, *args):
        if "--quiet" not in sys.argv:
            super().log_message(fmt, *args)

port = next((int(a) for a in sys.argv[1:] if a.isdigit()), 8765)
handler = partial(CaddyLike, directory=ROOT)
print(f"SMK & Co. — serving {ROOT}\n  http://127.0.0.1:{port}   (Caddyfile routing applied)")
ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
