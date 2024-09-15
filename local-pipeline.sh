 #!/bin/bash

# Step 1: Build the Docker image
echo "Building the Docker image..."
# docker build --build-arg DATABASE_URL=$(grep DATABASE_URL .env | cut -d '=' -f2)   -t rdr-next-app .
docker build -t rdr-next-app .

if [ $? -ne 0 ]; then
  echo "Docker build failed. Exiting."
  exit 1
fi

# Step 2: Run the container and run tests
echo "Running the tests..."
docker run --rm rdr-next-app bun run test

if [ $? -ne 0 ]; then
  echo "Tests failed. Exiting."
  exit 1
fi

# Step 3: Build the app
echo "Building the Next.js app..."
docker run --rm rdr-next-app bun run build

if [ $? -ne 0 ]; then
  echo "Build failed. Exiting."
  exit 1
fi

# Step 4: Start the container in detached mode
echo "Starting the app in detached mode..."
docker-compose up -d

echo "App started successfully at http://localhost:3000"
