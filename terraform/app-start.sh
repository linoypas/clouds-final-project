#! /bin/bash 
### check path version if not changed
echo "fixing path"
export PATH=$PATH:/root/.nvm/versions/node/v20.12.2/bin 
cd /opt/cloud-final-project/traveler-backend/ && . /root/.env && npm i && npm run start &
cd /opt/cloud-final-project/traveler-front/ && nohup npm serve -s build &
