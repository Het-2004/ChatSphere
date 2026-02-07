# Script to commit files in batches
# This will create 50 commits, each containing approximately 176-179 files

$files = Get-Content "untracked_files.txt" | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
$totalFiles = $files.Count
$numberOfCommits = 50
$filesPerBatch = [Math]::Ceiling($totalFiles / $numberOfCommits)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Batch Commit Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total files to commit: $totalFiles" -ForegroundColor Green
Write-Host "Number of commits: $numberOfCommits" -ForegroundColor Green
Write-Host "Files per batch: $filesPerBatch" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

$commitCounter = 0
$fileIndex = 0

# Custom commit messages for variety
$commitMessages = @(
    "Add new project dependencies and configurations",
    "Integrate frontend components and utilities",
    "Add styling and theme configurations",
    "Include additional UI components",
    "Add helper functions and utilities",
    "Integrate third-party libraries",
    "Add component dependencies",
    "Include build and configuration files",
    "Add module dependencies",
    "Integrate UI framework components",
    "Add validation and security utilities",
    "Include animation and transition libraries",
    "Add icon and asset libraries",
    "Integrate state management dependencies",
    "Add routing and navigation components",
    "Include form handling utilities",
    "Add data fetching libraries",
    "Integrate testing utilities",
    "Add accessibility components",
    "Include internationalization libraries",
    "Add date and time utilities",
    "Integrate chart and graph libraries",
    "Add notification components",
    "Include modal and dialog components",
    "Add dropdown and menu components",
    "Integrate tooltip and popover libraries",
    "Add table and grid components",
    "Include carousel and slider components",
    "Add badge and chip components",
    "Integrate progress and loading components",
    "Add button and input components",
    "Include layout and container components",
    "Add typography and text utilities",
    "Integrate color and theme utilities",
    "Add spacing and sizing utilities",
    "Include responsive design utilities",
    "Add animation framework dependencies",
    "Integrate API client libraries",
    "Add authentication utilities",
    "Include authorization components",
    "Add error handling utilities",
    "Integrate logging and monitoring tools",
    "Add performance optimization libraries",
    "Include code splitting utilities",
    "Add lazy loading components",
    "Integrate caching mechanisms",
    "Add compression utilities",
    "Include optimization tools",
    "Add final project dependencies",
    "Complete project setup with remaining files"
)

for ($i = 0; $i -lt $numberOfCommits; $i++) {
    $commitCounter++
    $batchFiles = @()
    
    # Get files for this batch
    $endIndex = [Math]::Min($fileIndex + $filesPerBatch, $totalFiles)
    
    for ($j = $fileIndex; $j -lt $endIndex; $j++) {
        if ($j -lt $files.Count) {
            $batchFiles += $files[$j]
        }
    }
    
    if ($batchFiles.Count -eq 0) {
        break
    }
    
    Write-Host "`n[$commitCounter/$numberOfCommits] Processing batch with $($batchFiles.Count) files..." -ForegroundColor Yellow
    
    # Add all files in this batch
    foreach ($file in $batchFiles) {
        git add "$file" 2>$null
    }
    
    # Create commit with custom message
    $commitMessage = $commitMessages[$i % $commitMessages.Count]
    git commit -m "$commitMessage" -m "Batch $commitCounter of $numberOfCommits - Contains $($batchFiles.Count) files"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Committed batch $commitCounter successfully!" -ForegroundColor Green
        Write-Host "  Message: $commitMessage" -ForegroundColor Gray
    }
    else {
        Write-Host "✗ Failed to commit batch $commitCounter" -ForegroundColor Red
    }
    
    $fileIndex = $endIndex
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Batch Commit Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total commits created: $commitCounter" -ForegroundColor Yellow
Write-Host "Total files committed: $fileIndex" -ForegroundColor Yellow
Write-Host "`nTo push all commits to GitHub, run:" -ForegroundColor Cyan
Write-Host "  git push" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan
