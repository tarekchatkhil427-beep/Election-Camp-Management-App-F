Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 512, 512
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.Clear([System.Drawing.Color]::Indigo)
$font = New-Object System.Drawing.Font 'Arial', 48
$brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
$graphics.DrawString('CAMP', $font, $brush, 150, 200)
$bmp.Save('public/icon-512.png', [System.Drawing.Imaging.ImageFormat]::Png)

$bmp192 = New-Object System.Drawing.Bitmap 192, 192
$g192 = [System.Drawing.Graphics]::FromImage($bmp192)
$g192.Clear([System.Drawing.Color]::Indigo)
$font192 = New-Object System.Drawing.Font 'Arial', 24
$g192.DrawString('CAMP', $font192, $brush, 40, 75)
$bmp192.Save('public/icon-192.png', [System.Drawing.Imaging.ImageFormat]::Png)
