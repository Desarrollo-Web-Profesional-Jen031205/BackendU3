$url = "https://localhost/api/v1/comentarios"
$headers = @{ "Content-Type" = "application/json" }

if ($PSVersionTable.PSVersion.Major -lt 6) {
    [System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }
}

function Invoke-ApiPost {
    param(
        [string]$Body
    )

    $params = @{
        Uri             = $url
        Method          = "POST"
        Headers         = $headers
        Body            = $Body
        UseBasicParsing = $true
    }

    if ($PSVersionTable.PSVersion.Major -ge 6) {
        $params["SkipCertificateCheck"] = $true
    }

    Invoke-WebRequest @params
}

function Get-ErrorStatusCode {
    param($ErrorRecord)

    if ($ErrorRecord -and $ErrorRecord.Exception -and $ErrorRecord.Exception.Response) {
        return $ErrorRecord.Exception.Response.StatusCode.value__
    }

    return $null
}

Write-Host "PRUEBA 1: Ataque XSS"

$bodyXSS = @{
    puntuacion = 5
    texto      = "<script>alert('hack')</script>"
} | ConvertTo-Json

try {
    $response = Invoke-ApiPost -Body $bodyXSS
    Write-Host "Status: $($response.StatusCode)"

    $json = $response.Content | ConvertFrom-Json
    $textoRecibido = $json.data.texto

    if ($textoRecibido -like "*<script>*") {
        Write-Host "RESULTADO PRUEBA 1: FALLA (llego script sin sanitizar)"
    }
    elseif ($textoRecibido -like "*&lt;script&gt;*") {
        Write-Host "RESULTADO PRUEBA 1: OK (script sanitizado)"
    }
    else {
        Write-Host "RESULTADO PRUEBA 1: OK (entrada procesada sin script ejecutable)"
    }

    Write-Host "Respuesta del servidor:"
    Write-Host $response.Content
}
catch {
    $status = Get-ErrorStatusCode -ErrorRecord $_

    if ($status) {
        if ($status -eq 429) {
            Write-Host "Status de error: 429"
            Write-Host "Rate limit activo por una ejecucion anterior. Esperando 61 segundos para reintentar PRUEBA 1..."
            Start-Sleep -Seconds 61

            try {
                $response = Invoke-ApiPost -Body $bodyXSS
                Write-Host "Status: $($response.StatusCode)"

                $json = $response.Content | ConvertFrom-Json
                $textoRecibido = $json.data.texto

                if ($textoRecibido -like "*<script>*") {
                    Write-Host "RESULTADO PRUEBA 1: FALLA (llego script sin sanitizar)"
                }
                elseif ($textoRecibido -like "*&lt;script&gt;*") {
                    Write-Host "RESULTADO PRUEBA 1: OK (script sanitizado)"
                }
                else {
                    Write-Host "RESULTADO PRUEBA 1: OK (entrada procesada sin script ejecutable)"
                }

                Write-Host "Respuesta del servidor:"
                Write-Host $response.Content
            }
            catch {
                $retryStatus = Get-ErrorStatusCode -ErrorRecord $_
                if ($retryStatus) {
                    Write-Host "Status de error: $retryStatus"
                }
                else {
                    Write-Host "Status de error: Error de conexion"
                }
            }

        }

        if ($status -ne 429) {
            Write-Host "Status de error: $status"

            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $body = $reader.ReadToEnd()
                Write-Host "Respuesta del servidor:"
                Write-Host $body
            }
            catch {
                Write-Host "No se pudo leer la respuesta del servidor"
            }

            if ($status -eq 400) {
                Write-Host "RESULTADO PRUEBA 1: OK (payload bloqueado)"
            }
        }
    }
    else {
        Write-Host "Status de error: Error de conexion"
    }
}

# ----------------------------

Write-Host "`nPRUEBA 2: Rate Limit"

for ($i = 1; $i -le 15; $i++) {
    try {
        $body = @{
            puntuacion = 5
            texto      = "test$i"
        } | ConvertTo-Json

        $response = Invoke-ApiPost -Body $body
        Write-Host "Peticion $i -> $($response.StatusCode)"
    }
    catch {
        $status = Get-ErrorStatusCode -ErrorRecord $_

        if ($status) {
            Write-Host "Peticion $i -> $status"

            if ($status -eq 429) {
                if ($i -eq 1) {
                    Write-Host "Rate limit ya venia activo. Esperando 61 segundos y reiniciando PRUEBA 2..."
                    Start-Sleep -Seconds 61
                    $i = 0
                    continue
                }

                Write-Host "RATE LIMIT ACTIVADO"
                break
            }
        }
        else {
            Write-Host "Peticion $i -> Error de conexion"
        }
    }
}

# ----------------------------

Start-Sleep -Seconds 2

Write-Host "`nPRUEBA 3: Redireccion HTTP -> HTTPS"
curl.exe -I http://localhost
