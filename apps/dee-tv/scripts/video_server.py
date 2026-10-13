#!/usr/bin/env python3
"""Serve a video directory with HTTP byte-range support for media seeking."""

import argparse
import os
import re
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class RangeRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def do_GET(self):
        if not self._send_range_response(include_body=True):
            super().do_GET()

    def do_HEAD(self):
        if not self._send_range_response(include_body=False):
            super().do_HEAD()

    def _send_range_response(self, include_body):
        range_header = self.headers.get('Range')
        if not range_header:
            return False

        file_path = Path(self.translate_path(self.path))
        if not file_path.is_file():
            return False

        match = re.fullmatch(r'bytes=(\d*)-(\d*)', range_header.strip())
        file_size = file_path.stat().st_size
        if not match or file_size == 0:
            self._send_range_not_satisfiable(file_size)
            return True

        first, last = match.groups()
        if first:
            start = int(first)
            end = int(last) if last else file_size - 1
        elif last:
            suffix_length = int(last)
            if suffix_length == 0:
                self._send_range_not_satisfiable(file_size)
                return True
            start = max(file_size - suffix_length, 0)
            end = file_size - 1
        else:
            self._send_range_not_satisfiable(file_size)
            return True

        if start >= file_size or end < start:
            self._send_range_not_satisfiable(file_size)
            return True
        end = min(end, file_size - 1)
        content_length = end - start + 1

        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(str(file_path)))
        self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
        self.send_header('Content-Length', str(content_length))
        self.end_headers()

        if include_body:
            with file_path.open('rb') as video_file:
                video_file.seek(start)
                remaining = content_length
                while remaining:
                    chunk = video_file.read(min(64 * 1024, remaining))
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    remaining -= len(chunk)

        return True

    def _send_range_not_satisfiable(self, file_size):
        self.send_response(416)
        self.send_header('Content-Range', f'bytes */{file_size}')
        self.send_header('Content-Length', '0')
        self.end_headers()


def main():
    parser = argparse.ArgumentParser(
        description='Serve videos with byte-range support for browser seeking.'
    )
    parser.add_argument('--directory', default=os.getcwd())
    parser.add_argument('--bind', default='')
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()

    handler = partial(
        RangeRequestHandler,
        directory=args.directory,
    )
    server = ThreadingHTTPServer((args.bind, args.port), handler)
    print(f'Serving {Path(args.directory).resolve()} on port {args.port}')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nStopping video server.')
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
