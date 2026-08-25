Add-Type -AssemblyName System.Drawing

$sourcePath = Join-Path $PSScriptRoot '..\public\brand\majestic-lion.png'
$outputs = @(
  @{ Path = '..\public\favicon-32x32.png'; Size = 32 },
  @{ Path = '..\public\icon-192x192.png'; Size = 192 },
  @{ Path = '..\public\apple-touch-icon.png'; Size = 180 }
)

$source = [System.Drawing.Image]::FromFile($sourcePath)
try {
  # Remove the narrow white export margin while retaining the complete lion mark.
  $cropInset = 30
  $cropSize = $source.Width - ($cropInset * 2)
  foreach ($output in $outputs) {
    $destination = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot $output.Path))
    $bitmap = New-Object System.Drawing.Bitmap($output.Size, $output.Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.Clear([System.Drawing.Color]::Black)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.DrawImage($source, [System.Drawing.Rectangle]::new(0, 0, $output.Size, $output.Size), $cropInset, $cropInset, $cropSize, $cropSize, [System.Drawing.GraphicsUnit]::Pixel)
      } finally { $graphics.Dispose() }
      $bitmap.Save($destination, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $bitmap.Dispose() }
  }
} finally { $source.Dispose() }

Write-Output 'Generated Majestic Creations favicon and touch icons.'
