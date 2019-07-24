#!/bin/bash
echo "killing dynamo if already running"
pgrep -f DynamoDBLocal | xargs kill

echo "starting dynamo"
./web-api/start-dynamo.sh &
DYNAMO_PID=$!

node web-api/start-s3rver &
S3RVER_PID=$!

echo "seeding s3"
mkdir -p web-api/storage/s3/noop-documents-local-us-east-1
rm -rf web-api/storage/s3/noop-documents-local-us-east-1 && cp -R web-api/storage/fixtures/s3/ storage/s3/noop-documents-local-us-east-1

echo "creating dynamo tables"
node web-api/create-dynamo-tables.js

echo "seeding dynamo"
node web-api/seed-dynamo.js

echo "starting api service"
SKIP_SANITIZE=true SKIP_VIRUS_SCAN=true AWS_ACCESS_KEY_ID=noop AWS_SECRET_ACCESS_KEY=noop SLS_DEPLOYMENT_BUCKET=noop ./node_modules/.bin/sls offline start --config web-api/serverless-api.yml --noTimeout --stage local --region us-east-1 --domain noop --efcmsTableName=efcms-local --accountId noop &
echo "starting cases service"
SKIP_SANITIZE=true SKIP_VIRUS_SCAN=true AWS_ACCESS_KEY_ID=noop AWS_SECRET_ACCESS_KEY=noop SLS_DEPLOYMENT_BUCKET=noop ./node_modules/.bin/sls offline start --config web-api/serverless-cases.yml --noTimeout --stage local --region us-east-1 --domain noop --efcmsTableName=efcms-local --accountId noop &
echo "starting users service"
SKIP_SANITIZE=true SKIP_VIRUS_SCAN=true AWS_ACCESS_KEY_ID=noop AWS_SECRET_ACCESS_KEY=noop SLS_DEPLOYMENT_BUCKET=noop ./node_modules/.bin/sls offline start --config web-api/serverless-users.yml --noTimeout --stage local --region us-east-1 --domain noop --efcmsTableName=efcms-local --accountId noop &
echo "starting documents service"
SKIP_SANITIZE=true SKIP_VIRUS_SCAN=true AWS_ACCESS_KEY_ID=noop AWS_SECRET_ACCESS_KEY=noop SLS_DEPLOYMENT_BUCKET=noop ./node_modules/.bin/sls offline start --config web-api/serverless-documents.yml --noTimeout --stage local --region us-east-1 --domain noop --efcmsTableName=efcms-local --accountId noop &
echo "starting work items service"
SKIP_SANITIZE=true SKIP_VIRUS_SCAN=true AWS_ACCESS_KEY_ID=noop AWS_SECRET_ACCESS_KEY=noop SLS_DEPLOYMENT_BUCKET=noop ./node_modules/.bin/sls offline start --config web-api/serverless-work-items.yml --noTimeout --stage local --region us-east-1 --domain noop --efcmsTableName=efcms-local --accountId noop &
echo "starting sections service"
SKIP_SANITIZE=true SKIP_VIRUS_SCAN=true AWS_ACCESS_KEY_ID=noop AWS_SECRET_ACCESS_KEY=noop SLS_DEPLOYMENT_BUCKET=noop ./node_modules/.bin/sls offline start --config web-api/serverless-sections.yml --noTimeout --stage local --region us-east-1 --domain noop --efcmsTableName=efcms-local --accountId noop &
echo "starting trial session service"
SKIP_SANITIZE=true SKIP_VIRUS_SCAN=true AWS_ACCESS_KEY_ID=noop AWS_SECRET_ACCESS_KEY=noop SLS_DEPLOYMENT_BUCKET=noop ./node_modules/.bin/sls offline start --config web-api/serverless-trial-sessions.yml --noTimeout --stage local --region us-east-1 --domain noop --efcmsTableName=efcms-local --accountId noop &

echo "starting proxy"
node web-api/proxy.js

pkill -P $DYNAMO_PID
kill $S3RVER_PID
