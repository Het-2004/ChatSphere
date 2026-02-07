# Script to commit each untracked file individually
# This will create separate commits for each file

$files = Get-Content "untracked_files.txt"
$totalFiles = $files.Count
$counter = 0

Write-Host "Total files to commit: $totalFiles" -ForegroundColor Green

foreach ($file in $files) {
    $counter++
    
    # Skip empty lines
    if ([string]::IsNullOrWhiteSpace($file)) {
        continue
    }
    
    Write-Host "`n[$counter/$totalFiles] Processing: $file" -ForegroundColor Cyan
    
    # Add the specific file
    git add "$file"
    
    if ($LASTEXITCODE -eq 0) {
        # Create a commit message based on the file
        $fileName = Split-Path $file -Leaf
        $commitMessage = "Add $fileName"
        
        # Commit the file
        git commit -m "$commitMessage"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Committed: $file" -ForegroundColor Green
            
            # Push to remote (optional - uncomment if you want to push after each commit)
            # git push
            # if ($LASTEXITCODE -eq 0) {
            #     Write-Host "✓ Pushed: $file" -ForegroundColor Green
            # } else {
            #     Write-Host "✗ Failed to push: $file" -ForegroundColor Red
            # }
        } else {
            Write-Host "✗ Failed to commit: $file" -ForegroundColor Red
        }
    } else {
        Write-Host "✗ Failed to add: $file" -ForegroundColor Red
    }
}

Write-Host "`n`nAll files have been committed individually!" -ForegroundColor Green
Write-Host "Total commits created: $counter" -ForegroundColor Yellow
Write-Host "`nTo push all commits to GitHub, run: git push" -ForegroundColor Cyan
