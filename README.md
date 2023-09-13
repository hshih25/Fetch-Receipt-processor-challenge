# Fetch Receipt-processor-challenge 

## Environment setup

You need to have
[Node.js](https://nodejs.org/)
installed on your computer.

Verify the tools by running the following commands:

```sh
node --version
npm --version
```

After the tools installation, please run the follwoing command to install the packages needed.

```sh
npm install
```

## Run the Server

Please execute the following command in the terminal to run the server.

```sh
npm run dev
```

## Endpoints 

### Process Receipts

    curl -X POST 
    http://localhost:3000/receipts/process
        -H 'Content-Type: application/json' 
        -d @RECEIPT_JSON_FILE_PATH


### Response

    { "id": "cskhsdjmm593s4bpqtsun60xyj4g1c654wgj" }

| Field | Type | Description |
| :----:| :----: | :----: |
| id | string | The unique id of the receipt. Attach in Get Points endpoints to know the points awarded|


### Get Points

    curl -X GET 
    http://localhost:3000/receipts/{id}/points
        -H 'Content-Type: application/json' 

### Response

    { "points": 32 }

| Field | Type | Description |
| :----:| :----: | :----: |
| points | number | The points awarded by the receipt |
