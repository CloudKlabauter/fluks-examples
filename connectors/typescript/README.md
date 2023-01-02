# TypeScript Kalypso Connector

This connector is based on NodeJS, TypeScript and Express. It is an example of a connector created based on the <a href="https://docs.kalypso.cloud/docs/partners/tutorial/" target="_blank">tutorial</a> in the docs.

## File structure

The connector is splitted in seperate folders:

- `requests` contains the RequestHandlers for Actions and Triggers registrations
- `store` contains the InMemory Subscription Store to save and remove registered subscriptions
- `types` contains all required types

## Running the connector

To start the connector, run the following command:

```bash
yarn install
yarn dev
```

The connector is running at <a href="<http://localhost:3000>" target="_blank">http://localhost:3000</a>.