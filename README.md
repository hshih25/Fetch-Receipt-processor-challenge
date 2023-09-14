# Fetch Receipt-processor-challenge 

## Environment setup

Start from building and running the docker image by following command.


```sh
    docker build --tag ts-node-docker --network=host .
    docker run -d -p 3000:3000 ts-node-docker
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
