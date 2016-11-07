# Picshape Engine
_Back-end of PicShape Project_

[![bitHound Overall Score](https://www.bithound.io/github/PicShape/engine/badges/score.svg)](https://www.bithound.io/github/PicShape/engine)
[![bitHound Dependencies](https://www.bithound.io/github/PicShape/engine/badges/dependencies.svg)](https://www.bithound.io/github/PicShape/engine/develop/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/PicShape/engine/badges/code.svg)](https://www.bithound.io/github/PicShape/engine)

[![Build Status](https://travis-ci.org/PicShape/engine.svg?branch=develop)](https://travis-ci.org/PicShape/engine)



## Background

Picshape Engine is the Node.js back-end hosting the API for image transformation. It is a 3rd year project part of 'PicShape', a cloud image converter using fogleman's primitive project https://github.com/fogleman/primitive.

The project is composed of a front-end, back-end and an Android application. Check https://github.com/PicShape/picshape for more information.



## Project progress

- [x] Collaborators started with Node.js
- [x] Bridging primitive with node.js back-end
- [x] Setup project structure
- [x] Defining API structure
- [x] Finishing full-cycle conversion API
    - [x] Conversion done by API call
    - [x] Returning link to converted photo
- [ ] Adding fully-functionnal authenticated API based on local accounts.


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
│   |   │   account.js
|   |
│   └───models                    # Schemas for MongoDB models
│   |   │   User.js                 # Schema for an User
|   |
│   └───routes                    # Express routes (API entrypoints)
│   |   │   gallery.js            
|   |   |   picshape.js
|   |   |   account.js
|   |
|   └───utils
|       |   primitive-wrapper.js    # Wrapper to simplify calls to primitive
        |   primitive/              # Directory containing cross-compiled 'primitive' program for Linux, macOS and Windows.
|
|
└───test                        # Mocha tests
    │   
```

## API Documentation

A model to write API documentation in Markdown can be found here : https://gist.githubusercontent.com/iros/3426278/raw/c847a911bfe1ffcd7a2d659bf972e10ef8badb25/API.md

### PicShape conversion API

**GET /api/picshape**
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


**POST /api/picshape/convert**
  ----
    Send an image to be converted by PicShape using 'primitive' given a number
    of iteration and a mode.

  * **URL**

    `/api/picshape/convert`

  * **Method:**

    `POST`

  *  **URL Params**

    There are no required parameter

  *   **Optional:**

  `format=['png' | 'jpg' | 'svg']` - Output image format (default: png)

  `iter=[integer]` - Number of iteration (min: 1, max: 500, default: 100)

  `mode=[integer]` - Type of shape to be used (default: 0)
     * 0: combo
     * 1: triangle
     * 2: rect
     * 3: ellipse
     * 4: circle
     * 5: rotatedrect
     * 6: beziers
     * 7: rotatedellipse
     * 8: polygon

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
      **Content:** `{
  "message": "There have been validation errors.",
  "errors": {
    "iter": {
      "param": "iter",
      "msg": "Invalid iteration amount [1 ; 500]",
      "value": "5000"
    }
  }
}`

**GET /api/gallery/photos/:id**
----
  Fetch hosted image with id <id>

* **URL**

  `/api/gallery/photos/:id`

* **Method:**

  `GET`

*  **URL Params**

   **Required:**

   `id=[string]` - Image identifier

* **Success Response:**

  Returns the requested image.

  * **Code:** 200 <br />
    **Content:** `image`

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "No image associated with submitted id." }`


### PicShape Authentication API

**POST /api/account/login**
  ----
    Send an Authentication Header through HTTP to retrieve an authentication token for API access.

  * **URL**

    `/api/account/login`

  * **Method:**

    `POST`

  *  **URL Params**

    There are no required parameter

  *   **Optional:**



  * **Success Response:**

    On success, a response payload contains the generated token.

    * **Code:** 200 <br />
      **Content:** `{ message : "Authentication successful", token: <token>  }`


  * **Error Response:**

    If some field is missing or invalid.

    * **Code:** 400 <br />
      **Content:** `{ }`

**POST /api/account/signup**
----
  Create account passing parameters as email, password and username.

* **URL**

  `/api/account/signup`

* **Method:**

  `POST`

*  **URL Params**

  There are no required parameter

*   **Optional:**



* **Success Response:**


  * **Code:** 200 <br />
    **Content:** `{ message : "Account created successfully" }`


* **Error Response:**

  If some field is missing or invalid.

  * **Code:** 400 <br />
    **Content:** `{ }`

**DELETE /api/account/**
----
  Delete account associated with your token.

* **URL**

  `/api/account/`

* **Method:**

  `DELETE`

*  **URL Params**

  There are no required parameter

*   **Optional:**



* **Success Response:**

  On success, a response payload is sent.

  * **Code:** 200 <br />
    **Content:** `{ message : "Deletion successful" }`


* **Error Response:**

  If some field is missing or invalid.

  * **Code:** 400 <br />
    **Content:** `{ }`


**PUT /api/account/**
----
  Modify account passing parameters as email, password and username.

* **URL**

  `/api/account/`

* **Method:**

  `PUT`

*  **URL Params**

  There are no required parameter

*   **Optional:**



* **Success Response:**

  On success, a response payload is sent.

  * **Code:** 200 <br />
    **Content:** `{ message : "Update successful" }`


* **Error Response:**

  If some field is missing or invalid.

  * **Code:** 400 <br />
    **Content:** `{ }`

**POST /api/account/forgot**
----
  Send an e-mail to the associated account's e-mail with a reset-password link.

* **URL**

  `/api/account/forgot`

* **Method:**

  `POST`

*  **URL Params**

  There are no required parameter

*   **Optional:**



* **Success Response:**

  On success, a response payload is sent.

  * **Code:** 200 <br />
    **Content:** `{ message : "Authentication successful" }`


* **Error Response:**

  If some field is missing or invalid.

  * **Code:** 400 <br />
    **Content:** `{ }`



**POST /api/account/reset**
----
  Reset password with a new one.

* **URL**

  `/api/account/reset`

* **Method:**

  `POST`

*  **URL Params**

  There are no required parameter

*   **Optional:**



* **Success Response:**

  On success, a response payload is sent.

  * **Code:** 200 <br />
    **Content:** `{ message : "Authentication successful" }`


* **Error Response:**

  If some field is missing or invalid.

  * **Code:** 400 <br />
    **Content:** `{ }`
