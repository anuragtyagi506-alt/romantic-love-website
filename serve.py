#!/usr/bin/env python3
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class RangeRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def send_head(self):
        path = self.translate_path(self.path.split("?", 1)[0])
        if os.path.isdir(path):
            return super().send_head()
        try:
            size = os.path.getsize(path)
        except OSError:
            return super().send_head()

        range_header = self.headers.get("Range")
        if not range_header:
            return super().send_head()

        try:
            range_value = range_header.strip().lower().replace("bytes=", "")
            start_text, end_text = range_value.split("-", 1)
            start = int(start_text) if start_text else 0
            end = int(end_text) if end_text else size - 1
            end = min(end, size - 1)
            if start < 0 or start > end:
                raise ValueError
        except ValueError:
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.end_headers()
            return None

        f = open(path, "rb")
        f.seek(start)
        remaining = end - start + 1

        import mimetypes
        ctype = mimetypes.guess_type(path)[0] or "application/octet-stream"
        self.send_response(206)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(remaining))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        return RangeReader(f, remaining)

class RangeReader:
    def __init__(self, source, length):
        self.source = source
        self.remaining = length

    def read(self, length=-1):
        if self.remaining <= 0:
            return b""
        if length < 0:
            length = self.remaining
        length = min(length, self.remaining)
        data = self.source.read(length)
        self.remaining -= len(data)
        return data

    def close(self):
        self.source.close()

if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", 8000), RangeRequestHandler)
    print("Website running at http://localhost:8000")
    print("On your phone, open http://<this-computer-ip>:8000")
    server.serve_forever()
