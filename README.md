# Shoe Store Demo

Small vue3 / Vite / Vuetify demo using data from a websocket

##### Installation

Clone the Repo

```
cd shoe-store
cd vue-frontend
npm install
```

##### Run the Websocket

in a new tab

```
cd shoe-store
websocketd --port=8080 ruby inventory.rb
```

##### Run the App

in a new tab

```
cd vue-frontend
npm run dev
```

visit http://localhost:5173


#### run Tests

```
npx vitest
```
