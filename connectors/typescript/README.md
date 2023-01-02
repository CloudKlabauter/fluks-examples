# TypeScript Kalypso Connector

This connector is based on NodeJS, TypeScript and Express. It is an example of a connector created based on the <a href="https://docs.kalypso.cloud/docs/partners/tutorial/" target="_blank">tutorial</a> in the docs.

## File structure

The connector is splitted in separate folders:

- `requests` contains the RequestHandlers for Actions and Triggers registrations
- `store` contains the InMemory Subscription Store to save and remove registered subscriptions
- `types` contains all required types

## Running the connector

Create a `.env` file and copy the content of the `.env.example` file into it. Replace the value of the `KALYPSO_API_KEY` variable with your API key. 

> If you do not have an API Key yet, please contact <a href="mailto:info@cloudklabauter.de">support</a>.

### To start the connector, run the following command:

```bash
yarn install
yarn dev
```

The connector is running at <a href="<http://localhost:3000>" target="_blank">http://localhost:3000</a>.
