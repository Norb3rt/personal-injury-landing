$ErrorActionPreference = 'Stop'

function Remove-Diacritics([string]$s) {
  if (-not $s) { return '' }
  $normalized = $s.Normalize([Text.NormalizationForm]::FormD)
  $sb = New-Object System.Text.StringBuilder
  foreach ($ch in $normalized.ToCharArray()) {
    if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($ch) -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
      [void]$sb.Append($ch)
    }
  }
  return $sb.ToString().Normalize([Text.NormalizationForm]::FormC)
}

function Slugify([string]$text) {
  if (-not $text) { return '' }
  $t = Remove-Diacritics($text).ToLower()
  # remove anything that's not a-z, 0-9, space or hyphen
  $t = [regex]::Replace($t, "[^a-z0-9\s-]", "")
  # collapse whitespace to single hyphen
  $t = [regex]::Replace($t.Trim(), "\s+", "-")
  # collapse multiple hyphens
  $t = [regex]::Replace($t, "-+", "-")
  return $t
}

function NormalizeCity([string]$name) {
  if (-not $name) { return '' }
  return $name.Trim()
}

$csvPath = 'data\states\california-citys.csv'
$jsonPath = 'data\states\california-cities.json'

if (-not (Test-Path $csvPath)) {
  throw "CSV not found at $csvPath"
}
if (-not (Test-Path $jsonPath)) {
  throw "JSON not found at $jsonPath"
}

$csv = Import-Csv -Path $csvPath
$json = Get-Content $jsonPath -Raw | ConvertFrom-Json
if (-not $json) { $json = @() }

# Build dictionary from existing JSON keyed by normalized (diacritics-removed) city
$dict = @{}
foreach ($item in $json) {
  $city = NormalizeCity($item.city)
  if (-not [string]::IsNullOrWhiteSpace($city)) {
    $key = (Remove-Diacritics($city)).ToLower()
    $dict[$key] = [PSCustomObject]@{
      city       = $item.city
      landmark   = $item.landmark
      population = [int]$item.population
      slug       = $item.slug
    }
  }
}

# Merge in CSV entries (ensure all CSV cities exist)
foreach ($row in $csv) {
  $city = NormalizeCity($row.city)
  if ([string]::IsNullOrWhiteSpace($city)) { continue }
  $key = (Remove-Diacritics($city)).ToLower()

  $landmark = $row.landmark
  $population = 0
  if ($row.population) { [void][int]::TryParse($row.population, [ref]$population) }

  if ($dict.ContainsKey($key)) {
    # Update landmark/population from CSV where provided
    if ($landmark -and -not [string]::IsNullOrWhiteSpace($landmark)) {
      $dict[$key].landmark = $landmark
    }
    if ($population -gt 0) {
      $dict[$key].population = $population
    }
    # Keep existing slug if present, otherwise generate
    if (-not $dict[$key].slug -or [string]::IsNullOrWhiteSpace($dict[$key].slug)) {
      $dict[$key].slug = Slugify($city)
    }
    # Normalize city casing from CSV
    $dict[$key].city = $city
  }
  else {
    $dict[$key] = [PSCustomObject]@{
      city       = $city
      landmark   = $landmark
      population = $population
      slug       = Slugify($city)
    }
  }
}

# Emit a stable, sorted array (by city name)
$result = $dict.Keys | Sort-Object | ForEach-Object { $dict[$_] }

# Write back to JSON without BOM (avoid JSON.parse errors)
$jsonString = $result | ConvertTo-Json -Depth 4
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($jsonPath, $jsonString, $utf8NoBom)

Write-Host "Updated $jsonPath with $($result.Count) cities."

