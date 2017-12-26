**Getting Started **
===========

To install this service, deploy the source code into a directory. From that directory run:


`npm run start`

The service runs on port 3000, ensure that the server allows this port.


**API Documentation**
========

**List All Compiler Containers**
----
_Gets a list of compiler containers_

* **URL**

    /containers

* **Method:**

    GET
  
*  **URL Params**

    **Required:**
 
    `None`

    **Optional:**
 
    `None`

* **Data Params**

    `None`

* **Success Response:**
    
**Code:** 200

**Content:**    

```json
    [
    {
        "Containers": -1,
        "Created": 1513576976,
        "Id": "sha256:94924b48d596e28b4f51c2452de8defe01b285eeae52134306debcb195f35e2a",
        "Labels": {
            "container": "typescript"
        },
        "ParentId": "sha256:99fe1bd651cd2a81948f2b2417cbf375ef9eb93718399e43b74300d27c87280f",
    "RepoDigests": null,
    "RepoTags": [
        "glot/typescript:latest"
    ],
    "SharedSize": -1,
    "Size": 719200343,
    "VirtualSize": 719200343
    }
    ]
```

    
* **Sample Call:**

```javascript
$.ajax({
  url: "/containers",
  dataType: "json",
  type : "GET",
  success : function(r) {
    console.log(r);
  }
});
```
  
**Submitting Source Code**
----
_Submit source code to the containers and get compilation results_

* **URL**

    /containers/:language

* **Method:**

    `PUT`
  
*  **URL Params**

    **Required:**
 
    * `language=[string]` _compiler language name that follows the container name. For a list of valid values, refer to the label params with container key in API GET /containers_

    **Optional:**

    `None`
    
* **Data Params**

    * `language=[string]` _the language name for required by the container._
    
    * `tag=[string]` _Optional. Specific language version if any. Eg. es6 for javascript._
    
    * `files=[array]`
    
        * `name=[string]` _file name_
            
        * `content=[string]` _source code_


* **Success Response:**
    
**Code:** 200
    
**Content**
            
```json              
    {
    "stdout": "Hello World!\n",
    "stderr": "",
    "error": ""
    }
```  


**Code:** 400
    
**Content:**
    
```json
    {
    "stdout": "",
    "stderr": "",
    "err": "TypeError: Cannot read property 'start' of null"
    }
```

* **Sample Call:**

```javascript
    $.ajax({
      url: "/containers",
      dataType: "json",
      data: $(this).serialize(),
      type : "POST",
      success : function(r) {
        console.log(r);
      }
    });
```