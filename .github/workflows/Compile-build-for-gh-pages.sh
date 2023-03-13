                  # Creating enviornment variables
                  export CHANGES_TO_COMMIT_TO_MAIN=true
                  export CHANGES_TO_COMMIT_TO_GH_PAGES=true
                  export SHOULD_PUSH_TO_GH_PAGES
                  echo 'Running build process'
                  npm run build
                  echo
                  git fetch --prune
                  git config user.email 'clive.dcosta98@gmail.com'
                  git config user.name 'clivedc'
                  git add .
                  # Check whether commit is necessary
                  CHANGES_TO_COMMIT_TO_MAIN=$( git status )
                  if [[ "$CHANGES_TO_COMMIT_TO_MAIN" =~ "nothing to commit" ]]; 
                  then echo $CHANGES_TO_COMMIT_TO_MAIN; 
                  else git commit -m "Compiled new build files"; 
                  fi
                  echo
                  # Switch to gh-pages branch
                  echo 'Checking out gh-pages branch'
                  git checkout -t origin/gh-pages
                  echo
                  # Cleaning current directory
                  echo 'Cleaning gh-pages branch'
                  echo 'Listing all files and directories before cleanup'
                  ls
                  echo ""
                  rm -rf *
                  echo 'All files and directories deleted'
                  echo 'Listing all files and directories after cleanup'
                  ls
                  echo "The 'ls' command exited with exit status $?"
                  echo
                  # Copying build files from main branch
                  echo 'Copying build files from main branch'
                  git checkout main -- build
                  # Moving build files from build folder to root directory so that github pages can access the index.html file
                  echo "Moving all files in build directory to root directory, ${{ github.workspace }}"
                  git mv build/* ./
                  echo 'Removing empty build folder'
                  # Deleting empty build folder
                  rmdir -v build
                  echo
                  echo "Listing all files in current directory, ${{ github.workspace }}"
                  ls
                  echo
                  echo 'Commit and push the changes to the gh-pages branch in the repo'
                  echo 'Adding files to staging area'
                  git add .
                  echo "The 'git add' command exited with exit status $?"
                  echo
                  echo 'Commiting changes locally'
                  # Check whether commit is necessary
                  CHANGES_TO_COMMIT_TO_GH_PAGES=$( git status )
                  # Check for the words 'nothing to commit' in the 'git status' output
                  if [[ "$CHANGES_TO_COMMIT_TO_GH_PAGES" =~ "nothing to commit" ]];
                  # if true, set push variable to false
                  then echo $CHANGES_TO_COMMIT_TO_GH_PAGES; 
                       SHOULD_PUSH_TO_GH_PAGES=false; 
                  else git commit -m "Compiled new build files"; 
                  fi
                  # Check whether push is necessary
                  if [ $SHOULD_PUSH_TO_GH_PAGES = true ]; 
                  then echo 'Pushing changes to repo'; 
                       git push origin gh-pages; 
                  else echo 'No changes to push'; 
                  fi
