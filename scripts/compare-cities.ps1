$ErrorActionPreference = 'Stop'

$csv = Import-Csv -Path 'data\states\california-citys.csv'
$json = Get-Content 'data\states\california-cities.json' -Raw | ConvertFrom-Json

$csvCities = $csv | ForEach-Object { ($_.'city').Trim() } | Sort-Object -Unique
$jsonCities = $json | ForEach-Object { ($_.'city').Trim() } | Sort-Object -Unique

$missingInJson = $csvCities | Where-Object { $_ -and ($_ -notin $jsonCities) }
$missingInCsv  = $jsonCities | Where-Object { $_ -and ($_ -notin $csvCities) }

Write-Host "CSV cities count: $($csvCities.Count)"
Write-Host "JSON cities count: $($jsonCities.Count)"

Write-Host "Cities in CSV but not in JSON: $($missingInJson.Count)"
$missingInJson | Select-Object -First 50 | ForEach-Object { Write-Host " - $_" }

Write-Host "Cities in JSON but not in CSV: $($missingInCsv.Count)"
$missingInCsv  | Select-Object -First 50 | ForEach-Object { Write-Host " - $_" }

