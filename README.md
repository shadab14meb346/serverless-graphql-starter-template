# The graphql serverless backend

## Table of Contents

1. [Introduction](#introduction)
2. [How to setup local dev environment](#how-to-setup-local-dev-environment)
3. [Architecture](#architecture)
4. [Coding Practices](#coding-practices)

## Introduction

This repo contains the starter code for the a serverless graphql backend.

## How to setup local dev environment

#### Note: The steps mentioned below is for ubuntu. For MAC as well it should remain same as ubuntu. But for windows some things might change. I haven't tested for the windows yet.

### Prerequisites

- Docker
- Docker Compose
- NodeJS

### Steps

- First clone the repo
- After cloning run below command

```bash
yarn install
```

- Now run below command

```bash
docker volume create --name=local-development-pg-volume
```

OR

```bash
sudo docker volume create --name=local-development-pg-volume
```

- And now run below command

```bash
docker-compose up
```

OR

```bash
sudo docker-compose up
```

- Finally run below command to start the dev server

```bash
yarn dev
```

## Graphql Playground

Open http://localhost:3000/dev/playground and you will be able to access the graphql playground.

## Architecture

The backend is built as a serverless architecture.
We are using a framework https://www.serverless.com/
It helps us deploy and upload our code easily to AWS Lambada.
It utilizes AWS cloudformation to create required resources on AWS.
The file `serverless.yml` in the root folder contains the

#### Tech Stack

- GraphQL
- Apollo
- AWS Lambada
- serverless.com
- NodeJS
- AWS RDS PostGrace

#### How the local dev environment working?

To run the the local development environment we are using a plugin called `serverless-offline`.
This allows us to simulate a lambada function execution.

#### How the staging and prod environments are working?

AWS cloudformation deploy the required stacks.
OAll of the code is stored in s3.
The AWS Lambada then references that code.

## Coding Practices

- For all db operations make a file with the same name as the table and do all of the operations in it. All those files currently are in `core` folder
- All of the data validation, authentication and autherization login should be in the graphql resolver.
- All of the data stored in the DB will be in snake case
- All requests and responses data to client will be in the snake case.
- Any unused variables should start with `_` Like below.

```javascript
async (_parent, _args, ctx, info) => {
      const user = ctx.assertAuthenticated();
      const results = await User.findById(ctx, user.id);
      return results[0];
    },
```
