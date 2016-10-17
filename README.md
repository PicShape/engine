# Picshape Engine
_Back-end of PicShape Project_


## Background

Picshape Engine is the Node.js back-end hosting the API for image transformation.
This project exists as a 3rd year project at ENSICAEN and is part of PicShape.


## Structure

This project is structured as below :

```
engine
│   README.md     # The file you're reading
│   .travis.yml   # Travis-CI instructions for this repository
|   package.json  # Dependancies and script for Node Package Manager
|   server.js     # Entry point of the project
│
└───app                         # Root of picshape-engine
│   └───controllers               # Instructions executed (API endpoints)
│   |   │   gallery.js
│   |   │   picshape.js
│   └───models                    # Schema for MongoDB models
│   |   │   ...
│   └───routes                    # Express routes (API entrypoints)
│       │   gallery.js            
|       |   picshape.js
|
|
└───test                        # Mocha tests
    │   
```

## API Documentation

A model to write API documentation in Markdown can be found here : https://gist.githubusercontent.com/iros/3426278/raw/c847a911bfe1ffcd7a2d659bf972e10ef8badb25/API.md


** GET /api/picshape **
----
  Fetch a welcome message for testing purpose.

* **URL**

  `/api/picshape`

* **Method:**

  `GET`

*  **URL Params**

  `None`


* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ message : "Welcome to PicShape sub-API !" }`


* **Error Response:**

  No error expected.

* **Notes:**

  This request may be not released at the end of the project.


  ** POST /api/picshape/convert **
  ----
    Send an image to be converted by PicShape using 'primitive' given a number
    of iteration and a mode.

  * **URL**

    `/api/picshape/convert`

  * **Method:**

    `POST`

  *  **URL Params**

     `iter=[integer]` - Number of iteration

     `mode=[integer]` - Type of shape to be used


  *   **Optional:**

  `iter=[integer]`

  `mode=[integer]`

  * **Data Params**

    The picture has to be sent using **multipart/form-data** encoding type and named **photo**.

  * **Success Response:**

    On success, a response payload contains the URL to get the converted photo back.

    * **Code:** 200 <br />
      **Content:** `{ message : "Conversion done successfully.", url: <url>  }`


  * **Error Response:**

    If no picture is provided when submitting

    * **Code:** 400 <br />
      **Content:** `{ 'You need to provide an input picture' }`

    If there are some validation errors

    * **Code:** 400 <br />
      **Content:** `{ "There have been validation errors: " }`
