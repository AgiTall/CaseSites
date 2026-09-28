param([int]$Port = 5080)

$root = Join-Path $PSScriptRoot 'wwwroot'
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Preview: http://localhost:$Port"

$mime = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.png'='image/png'; '.svg'='image/svg+xml' }
while ($listener.IsListening) {
  $context = $listener.GetContext()
  $relative = $context.Request.Url.AbsolutePath.TrimStart('/')
  if ([string]::IsNullOrWhiteSpace($relative)) { $relative = 'index.html' }
  $path = [System.IO.Path]::GetFullPath((Join-Path $root $relative))
  if (-not $path.StartsWith([System.IO.Path]::GetFullPath($root)) -or -not (Test-Path -LiteralPath $path -PathType Leaf)) {
    $context.Response.StatusCode = 404
    $context.Response.Close()
    continue
  }
  $bytes = [System.IO.File]::ReadAllBytes($path)
  $ext = [System.IO.Path]::GetExtension($path).ToLowerInvariant()
  $context.Response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
  $context.Response.ContentLength64 = $bytes.Length
  $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $context.Response.Close()
}
