$repo = 'C:\dev\persistence\starter-template'
$backup = Join-Path $repo 'local_backups\premerge'
if (Test-Path $backup) { Remove-Item $backup -Recurse -Force }
New-Item -ItemType Directory -Path $backup | Out-Null
$items = @('.gitignore','.agents','backend','my-app','skills-lock.json','stitch_expense_autopsy_dashboard','README-SETUP.md','scripts')
foreach ($i in $items) {
  if (Test-Path $i) {
    Write-Host "Moving $i"
    Move-Item -Path $i -Destination $backup -Force
  }
}
Write-Host "Backup complete at $backup"
