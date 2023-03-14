#!/bin/bash
set -e

export CLEAN=$1

# Remove all untracked files and directories.
if [ -n "$CLEAN" ]; then
  if [ "$CLEAN" = "clean" ]; then
    echo "WARNING: This will erase *all* untracked files, including hooks and submodules."
    echo -n "Continue? [y/n] "
    read user_input
    if [ "$user_input" != "y" ] && [ "$user_input" != "Y" ]; then
      exit 1
    fi
    rm -rf .git/hooks/*
    git clean -fd
    exit 0
  else
    echo "Unknown command: $CLEAN"
    exit 1
  fi
fi

if [ ! -f ~/.nvm/nvm.sh ]; then
  echo "Nvm not found at ~/.nvm"
  exit 1
fi

\. ~/.nvm/nvm.sh
nvm install

# Until we push .yarn/cache, we still need to install.
cd yarn-project
yarn install --immutable
cd ..

PROJECTS=("yarn-project:yarn build")

for E in "${PROJECTS[@]}"; do
  echo
  ARR=(${E//:/ })
  DIR=${ARR[0]}
  COMMAND=${ARR[@]:1}
  echo "Bootstrapping $DIR: $COMMAND"
  pushd $DIR > /dev/null
  $COMMAND
  popd > /dev/null
done

echo
echo "Success!"
