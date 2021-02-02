#!/bin/bash
#
# # This is a script that syncronises server version of snake with git one
# Usage: ./snakeUpdater.sh

cd ~/webGames/
echo "Checking for new version."
GIT_STATUS=$(git pull)
if [[ "$GIT_STATUS" != "Already up to date." ]]; then
	rm -r ~/testSite/frontend
	cp -r ~/webGames/snake/frontend/ ~/testSite/frontend
	echo "Restarting nginx"
	sudo service nginx restart
fi
echo "Procedure complete."
