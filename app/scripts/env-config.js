"use strict";

 angular.module("env-config", [])

.constant("ENV", {
  "name": "development",
  "apiEndpoint": "http://groupeat.dev/api"
})

;