# Use an official Node runtime as a parent image
FROM node:21

# Install dependencies for serving the built app (if needed)
# RUN apt-get update && apt-get install -y ...

# Create a group and user for the application
RUN groupadd development && \
    useradd -g development -m -d /home/frontend frontend && \
    chown -R frontend:development /home/frontend

# Switch to the non-root user
USER frontend

# Set the working directory in the image
WORKDIR /frontend

# Copy package.json and package-lock.json (or yarn.lock)
COPY --chown=frontend:development package*.json /frontend/

# Install app dependencies
RUN npm install

# Copy the rest of your app's source code
COPY --chown=frontend:development . /frontend/

# Make port 3000 available to the world outside this container
EXPOSE 5173

# Define the command to run your app
CMD ["npm", "run", "dev"]
