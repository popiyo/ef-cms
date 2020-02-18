#!/bin/bash

STAGE=$1
CHECK_PATH=$2
ORG="${CIRCLE_PROJECT_USERNAME:-"flexion"}"
CURRENT_SHA="${CIRCLE_SHA1:-`git rev-parse HEAD`}"

DEPLOYED_SHA=`curl https://ui-$STAGE.$EFCMS_DOMAIN | awk '/meta name/{ gsub(/.*meta revision=\042|\042.*/,"");print }'`;

if git diff --name-only $CURRENT_SHA $DEPLOYED_SHA | grep -q $CHECK_PATH; then
  echo "found"
else
  echo "not found"
fi