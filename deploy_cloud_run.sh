#!/bin/bash

# deploy_cloud_run.sh - Script to deploy Next.js app to Google Cloud Run

# --- Configuration ---
GCP_PROJECT_ID="pyze-automation-dev3"
GCP_REGION="us-east1"
SERVICE_NAME="cibc-business-rules-demo"
IMAGE_NAME="cibc-business-rules-demo"
OPENAI_API_KEY_VALUE="YOUR_OPENAI_API_KEY"

# --- Derived Variables ---
ARTIFACT_REGISTRY_REPO="${SERVICE_NAME}-repo" # Name for the Artifact Registry repository
IMAGE_TAG="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/${IMAGE_NAME}:latest"

# --- Helper Functions ---
check_gcloud() {
  if ! command -v gcloud &> /dev/null; then
    echo "gcloud CLI not found. Please install it from https://cloud.google.com/sdk/docs/install"
    exit 1
  fi
  echo "gcloud CLI found."
}

set_project() {
  echo "Setting active GCP project to $GCP_PROJECT_ID..."
  gcloud config set project "$GCP_PROJECT_ID"
  if [ $? -ne 0 ]; then echo "Failed to set GCP project."; exit 1; fi
}

enable_apis() {
  echo "Enabling required APIs (run, cloudbuild, artifactregistry)..."
  gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --project="$GCP_PROJECT_ID"
  if [ $? -ne 0 ]; then echo "Failed to enable APIs."; exit 1; fi

  echo "Granting Cloud Build Service Agent role to the Cloud Build service account..."
  # Construct the service account email using the project number derived from project ID if possible,
  # or use a known project number if available. For now, assuming project ID can be used to find project number or it's fixed.
  # A more robust way would be to get project number: PROJECT_NUMBER=$(gcloud projects describe $GCP_PROJECT_ID --format='value(projectNumber)')
  # For simplicity, if the service account email format is consistent as P_NUMBER@cloudbuild.gserviceaccount.com
  # and P_NUMBER is known (635110435158 from logs), we can use it directly.
  # Let's use the known project number from the logs for now.
  CLOUDBUILD_SERVICE_ACCOUNT_EMAIL="635110435158@cloudbuild.gserviceaccount.com" # From previous logs

  # Check if the binding already exists to avoid errors on re-runs (though add-iam-policy-binding is often idempotent for additions)
  # This check is a bit complex for a simple script, gcloud add-iam-policy-binding will just ensure it's there.
  gcloud projects add-iam-policy-binding "$GCP_PROJECT_ID" \
    --member="serviceAccount:$CLOUDBUILD_SERVICE_ACCOUNT_EMAIL" \
    --role="roles/cloudbuild.serviceAgent" \
    --condition=None # Explicitly set no condition
  if [ $? -ne 0 ]; then
     echo "Warning: Failed to grant Cloud Build Service Agent role. This might be okay if permissions are already sufficient or set manually."
     # Not exiting on failure here as it might be due to permissions to change IAM, or role already granted.
     # The build will fail later if permissions are truly missing.
  else
    echo "Cloud Build Service Agent role granted/ensured."
  fi
}

create_artifact_registry_repo() {
  echo "Checking for Artifact Registry repository: $ARTIFACT_REGISTRY_REPO in region $GCP_REGION..."
  if ! gcloud artifacts repositories describe "$ARTIFACT_REGISTRY_REPO" --location="$GCP_REGION" --project="$GCP_PROJECT_ID" &> /dev/null; then
    echo "Artifact Registry repository not found. Creating..."
    gcloud artifacts repositories create "$ARTIFACT_REGISTRY_REPO" \
      --repository-format=docker \
      --location="$GCP_REGION" \
      --description="Docker repository for $SERVICE_NAME" \
      --project="$GCP_PROJECT_ID"
    if [ $? -ne 0 ]; then echo "Failed to create Artifact Registry repository."; exit 1; fi
    echo "Artifact Registry repository created."
  else
    echo "Artifact Registry repository already exists."
  fi
}

build_image() {
  echo "Building Docker image with Cloud Build and pushing to Artifact Registry..."
  # Use cloudbuild.yaml for more control over the build process
  gcloud builds submit . --config=cloudbuild.yaml \
    --project="$GCP_PROJECT_ID" \
    --suppress-logs \
    --substitutions="_IMAGE_TAG=$IMAGE_TAG,_OPENAI_API_KEY=$OPENAI_API_KEY_VALUE"

  if [ $? -ne 0 ]; then
    echo "Failed to build Docker image using cloudbuild.yaml. Check Cloud Build logs in Google Cloud Console."
    echo "You can view logs at: https://console.cloud.google.com/cloud-build/builds?project=$GCP_PROJECT_ID"
    exit 1
  fi
  echo "Docker image built and pushed successfully: $IMAGE_TAG"
}

deploy_to_cloud_run() {
  echo "Deploying image to Cloud Run service: $SERVICE_NAME in region $GCP_REGION..."
  # Set runtime environment variables, including OPENAI_API_KEY
  gcloud run deploy "$SERVICE_NAME" \
    --image="$IMAGE_TAG" \
    --platform=managed \
    --region="$GCP_REGION" \
    --allow-unauthenticated \
    --port=3000 \
    --set-env-vars="NODE_ENV=production,OPENAI_API_KEY=$OPENAI_API_KEY_VALUE" \
    --project="$GCP_PROJECT_ID" \
    --quiet

  if [ $? -ne 0 ]; then
    echo "Failed to deploy to Cloud Run. Check logs in Google Cloud Console."
    echo "You can view logs for Cloud Run service $SERVICE_NAME in region $GCP_REGION."
    exit 1
  fi
  SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --platform=managed --region="$GCP_REGION" --format='value(status.url)' --project="$GCP_PROJECT_ID")
  echo "Service deployed successfully!"
  echo "URL: $SERVICE_URL"
}

# --- Main Execution ---
echo "Starting Cloud Run deployment process..."

check_gcloud
set_project
enable_apis
create_artifact_registry_repo
build_image
deploy_to_cloud_run

echo "Cloud Run deployment script finished."
